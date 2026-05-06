#!/usr/bin/env python3

import os
import sys
import time
from pathlib import Path
from threading import Thread

import cv2
import numpy as np
import requests
from tensorflow.keras.layers import DepthwiseConv2D
from tensorflow.keras.models import load_model

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = Path(os.getenv("MODEL_PATH", BASE_DIR / "keras_model.h5"))
LABELS_PATH = Path(os.getenv("LABELS_PATH", BASE_DIR / "label.txt"))

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:3000/report")
BACKEND_BASE_URL = BACKEND_URL.rsplit("/", 1)[0]
DEVICE_LOCATION_URL = os.getenv(
    "DEVICE_LOCATION_URL",
    f"{BACKEND_BASE_URL}/device-location",
)

FALLBACK_LAT = float(os.getenv("DEVICE_LAT", "13.0827"))
FALLBACK_LNG = float(os.getenv("DEVICE_LNG", "80.2707"))
REPORT_INTERVAL = float(os.getenv("REPORT_INTERVAL", "2.0"))
POTHOLE_THRESHOLD = float(os.getenv("POTHOLE_THRESHOLD", "0.90"))
STABLE_DETECTION_FRAMES = int(os.getenv("STABLE_DETECTION_FRAMES", "4"))
CALIBRATION_FRAMES = int(os.getenv("CALIBRATION_FRAMES", "30"))
CALIBRATION_MARGIN = float(os.getenv("CALIBRATION_MARGIN", "0.08"))
MAX_DYNAMIC_THRESHOLD = float(os.getenv("MAX_DYNAMIC_THRESHOLD", "0.995"))
NO_POTHOLE_LABEL = os.getenv("NO_POTHOLE_LABEL", "No pothole")

DEFAULT_ADDRESS = {
    "street": "Unknown street",
    "area": "Unknown area",
    "pincode": "Unknown pincode",
    "displayName": "Address unavailable",
}


class CompatibleDepthwiseConv2D(DepthwiseConv2D):
    def __init__(self, *args, **kwargs):
        kwargs.pop("groups", None)
        super().__init__(*args, **kwargs)


def load_labels():
    if not LABELS_PATH.exists():
        raise FileNotFoundError(f"Labels file not found: {LABELS_PATH}")

    labels = [line.strip() for line in LABELS_PATH.read_text().splitlines() if line.strip()]
    if not labels:
        raise ValueError(f"Labels file is empty: {LABELS_PATH}")
    return labels


def load_teachable_machine_model():
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model file not found: {MODEL_PATH}")

    return load_model(
        MODEL_PATH,
        compile=False,
        custom_objects={"DepthwiseConv2D": CompatibleDepthwiseConv2D},
    )


def first_present(data, keys):
    for key in keys:
        value = data.get(key)
        if value:
            return value
    return None


def reverse_geocode(lat, lng):
    try:
        response = requests.get(
            "https://nominatim.openstreetmap.org/reverse",
            params={
                "lat": lat,
                "lon": lng,
                "format": "jsonv2",
                "zoom": 18,
                "addressdetails": 1,
            },
            headers={"User-Agent": "pothole-project/1.0"},
            timeout=4,
        )
        response.raise_for_status()
        data = response.json()
        raw_address = data.get("address", {})

        return {
            "street": first_present(
                raw_address,
                ["road", "pedestrian", "footway", "residential", "path", "suburb"],
            )
            or DEFAULT_ADDRESS["street"],
            "area": first_present(
                raw_address,
                [
                    "neighbourhood",
                    "suburb",
                    "quarter",
                    "city_district",
                    "county",
                    "city",
                    "town",
                    "village",
                ],
            )
            or DEFAULT_ADDRESS["area"],
            "pincode": raw_address.get("postcode") or DEFAULT_ADDRESS["pincode"],
            "displayName": data.get("display_name") or DEFAULT_ADDRESS["displayName"],
        }
    except Exception as exc:
        print(f"Reverse geocoding unavailable: {exc}")
        return DEFAULT_ADDRESS.copy()


def get_backend_device_location():
    try:
        response = requests.get(DEVICE_LOCATION_URL, timeout=2)
        response.raise_for_status()
        data = response.json()
        location = data.get("location", {})
        lat = location.get("lat")
        lng = location.get("lng")
        if isinstance(lat, (int, float)) and isinstance(lng, (int, float)):
            address = data.get("address") or reverse_geocode(float(lat), float(lng))
            return float(lat), float(lng), address
    except Exception as exc:
        print(f"Backend device location unavailable: {exc}")

    return None


def get_report_location():
    backend_location = get_backend_device_location()
    if backend_location:
        lat, lng, address = backend_location
        return lat, lng, address

    address = reverse_geocode(FALLBACK_LAT, FALLBACK_LNG)
    return FALLBACK_LAT, FALLBACK_LNG, address


def calculate_severity(high_impact=False):
    return 3 if high_impact else 2


def send_pothole_report(severity, lat, lng, address):
    payload = {
        "type": "pothole",
        "severity": severity,
        "source": "webcam",
        "capturedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "location": {"lat": lat, "lng": lng},
        "address": address,
    }

    try:
        response = requests.post(BACKEND_URL, json=payload, timeout=3)
        response.raise_for_status()
        print(
            "Reported pothole | "
            f"severity={severity} | lat={lat} | lng={lng} | "
            f"street={address['street']} | area={address['area']} | "
            f"pincode={address['pincode']}"
        )
    except Exception as exc:
        print(f"Connection error while reporting pothole: {exc}")


def preprocess_frame(frame, input_shape):
    _, height, width, channels = input_shape
    if channels != 3:
        raise ValueError(f"Unsupported channel count from model: {channels}")

    image = cv2.resize(frame, (width, height), interpolation=cv2.INTER_AREA)
    image = np.asarray(image, dtype=np.float32)
    image = (image / 127.5) - 1.0
    return image.reshape(1, height, width, channels)


def parse_prediction(prediction, class_names):
    scores = np.asarray(prediction[0]).astype(np.float32).flatten()

    if scores.size == 1:
        pothole_score = float(scores[0])
        pothole_label = class_names[0]
        if pothole_score >= POTHOLE_THRESHOLD:
            return pothole_label, pothole_score, True
        return NO_POTHOLE_LABEL, 1.0 - pothole_score, False

    index = int(np.argmax(scores))
    label = class_names[index] if index < len(class_names) else f"class_{index}"
    confidence = float(scores[index])
    is_pothole = "pothole" in label.lower() and confidence >= POTHOLE_THRESHOLD
    return label, confidence, is_pothole


def prediction_score(prediction):
    scores = np.asarray(prediction[0]).astype(np.float32).flatten()
    return float(scores[0]) if scores.size == 1 else float(np.max(scores))


def run_detection():
    try:
        model = load_teachable_machine_model()
        class_names = load_labels()
    except Exception as exc:
        print(f"Failed to load Teachable Machine assets: {exc}")
        sys.exit(1)

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Cannot access webcam")
        sys.exit(1)

    print("Smart Road Quality Monitoring Started")
    print(f"Model: {MODEL_PATH.name}")
    print(f"Labels: {LABELS_PATH.name}")
    print("Keep the camera on a normal non-pothole scene for initial calibration.")
    print("Then show a pothole image/video to the webcam.")
    print("Press C to recalibrate, P for severe pothole, R to refresh location, Q to quit")
    print("=" * 50)

    lat, lng, address = get_report_location()
    print(
        f"Initial location: {lat}, {lng} | "
        f"{address['street']}, {address['area']} {address['pincode']}"
    )

    last_report_time = 0.0
    stable_pothole_frames = 0
    calibration_scores = []
    dynamic_threshold = POTHOLE_THRESHOLD

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                print("Error reading frame")
                break

            image = preprocess_frame(frame, model.input_shape)
            prediction = model.predict(image, verbose=0)
            pothole_score = prediction_score(prediction)

            if len(calibration_scores) < CALIBRATION_FRAMES:
                calibration_scores.append(pothole_score)
                dynamic_threshold = min(
                    MAX_DYNAMIC_THRESHOLD,
                    max(POTHOLE_THRESHOLD, max(calibration_scores) + CALIBRATION_MARGIN),
                )
                class_name = "Calibrating"
                confidence_score = pothole_score
                is_pothole = False
            else:
                class_name, confidence_score, is_pothole = parse_prediction(
                    prediction, class_names
                )
                if pothole_score < dynamic_threshold:
                    class_name = NO_POTHOLE_LABEL
                    confidence_score = 1.0 - pothole_score
                    is_pothole = False

            stable_pothole_frames = stable_pothole_frames + 1 if is_pothole else 0

            overlay_color = (0, 0, 255) if is_pothole else (0, 255, 0)
            cv2.putText(
                frame,
                f"{class_name} ({confidence_score:.2f})",
                (20, 40),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                overlay_color,
                2,
            )
            cv2.putText(
                frame,
                f"score={pothole_score:.3f} threshold={dynamic_threshold:.3f}",
                (20, 80),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (255, 255, 255),
                2,
            )

            current_time = time.time()
            if (
                is_pothole
                and stable_pothole_frames >= STABLE_DETECTION_FRAMES
                and (current_time - last_report_time) > REPORT_INTERVAL
            ):
                lat, lng, address = get_report_location()

                print("Pothole detected")
                print(f"Confidence: {confidence_score:.2f}")
                print(f"Stable frames: {stable_pothole_frames}")
                print(f"Location: {lat}, {lng}")

                Thread(
                    target=send_pothole_report,
                    args=(calculate_severity(False), lat, lng, address),
                    daemon=True,
                ).start()

                last_report_time = current_time

            cv2.imshow("Pothole Detection", frame)
            key = cv2.waitKey(1) & 0xFF

            if key in (ord("q"), ord("Q")):
                print("Stopping system...")
                break

            if key in (ord("p"), ord("P")) and is_pothole:
                lat, lng, address = get_report_location()
                Thread(
                    target=send_pothole_report,
                    args=(calculate_severity(True), lat, lng, address),
                    daemon=True,
                ).start()
                print("High impact pothole reported")
                last_report_time = time.time()

            if key in (ord("r"), ord("R")):
                lat, lng, address = get_report_location()
                print(
                    f"Location refreshed: {lat}, {lng} | "
                    f"{address['street']}, {address['area']} {address['pincode']}"
                )
            if key in (ord("c"), ord("C")):
                calibration_scores = []
                dynamic_threshold = POTHOLE_THRESHOLD
                stable_pothole_frames = 0
                print("Calibration reset. Show a normal non-pothole scene for a few seconds.")
    finally:
        cap.release()
        cv2.destroyAllWindows()


if __name__ == "__main__":
    run_detection()
