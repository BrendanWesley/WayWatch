#!/usr/bin/env python3
"""
Smart Road Quality Monitoring System - Pothole Detection Module
Captures webcam feed, detects pothole-like objects, and reports to backend
"""

import cv2
import numpy as np
import os
import requests
import sys
import time
from threading import Thread

# Backend API endpoint
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:3000/report")

# Fallback coordinates are used only if live/device location is unavailable.
FALLBACK_LAT = float(os.getenv("DEVICE_LAT", "13.0827"))
FALLBACK_LNG = float(os.getenv("DEVICE_LNG", "80.2707"))

# Detection sensitivity parameters
BLUR_KERNEL = (7, 7)
THRESHOLD_VALUE = 75
MIN_CONTOUR_AREA = 1200
MAX_CONTOUR_AREA = 100000
MIN_ASPECT_RATIO = 0.35
MAX_ASPECT_RATIO = 3.2
MIN_DARK_RATIO = 0.35
REPORT_INTERVAL = 1.0
DEFAULT_ADDRESS = {
    "street": "Unknown street",
    "area": "Unknown area",
    "pincode": "Unknown pincode",
    "displayName": "Address unavailable"
}


def calculate_severity(bbox_area, impact=False):
    """
    Calculate pothole severity based on bounding box area and impact
    Args:
        bbox_area: Area of detected bounding box
        impact: Boolean indicating high impact (keyboard press)
    Returns:
        severity: 1 (small), 2 (medium), or 3 (large)
    """
    if impact:
        return 3  # High impact detected
    
    # Area-based severity
    if bbox_area > 15000:
        return 3  # Large pothole
    elif bbox_area > 5000:
        return 2  # Medium pothole
    else:
        return 1  # Small pothole


def send_pothole_report(severity, lat, lng, address):
    """
    Send pothole detection report to backend
    Args:
        severity: Severity level (1-3)
        lat: Latitude
        lng: Longitude
    """
    payload = {
        "type": "pothole",
        "severity": severity,
        "source": "webcam",
        "capturedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "location": {
            "lat": lat,
            "lng": lng
        },
        "address": address
    }
    
    try:
        response = requests.post(BACKEND_URL, json=payload, timeout=2)
        if response.status_code == 200:
            print(
                "✓ Pothole reported: "
                f"severity={severity}, lat={lat}, lng={lng}, "
                f"street={address['street']}, area={address['area']}, "
                f"pincode={address['pincode']}"
            )
        else:
            print(f"✗ Backend error: {response.status_code}")
    except Exception as e:
        print(f"✗ Connection error: {e}")


def first_present(data, keys):
    for key in keys:
        value = data.get(key)
        if value:
            return value
    return None


def reverse_geocode(lat, lng):
    """
    Convert coordinates into street, area, and pincode.
    Uses OpenStreetMap Nominatim when internet is available.
    """
    try:
        response = requests.get(
            "https://nominatim.openstreetmap.org/reverse",
            params={
                "lat": lat,
                "lon": lng,
                "format": "jsonv2",
                "zoom": 18,
                "addressdetails": 1
            },
            headers={
                "User-Agent": "pothole-project/1.0"
            },
            timeout=4
        )
        response.raise_for_status()
        data = response.json()
        raw_address = data.get("address", {})

        street = first_present(
            raw_address,
            ["road", "pedestrian", "footway", "residential", "path", "suburb"]
        )
        area = first_present(
            raw_address,
            [
                "neighbourhood",
                "suburb",
                "quarter",
                "city_district",
                "county",
                "city",
                "town",
                "village"
            ]
        )
        pincode = raw_address.get("postcode")

        address = {
            "street": street or DEFAULT_ADDRESS["street"],
            "area": area or DEFAULT_ADDRESS["area"],
            "pincode": pincode or DEFAULT_ADDRESS["pincode"],
            "displayName": data.get("display_name") or DEFAULT_ADDRESS["displayName"]
        }
        print(
            "Resolved address: "
            f"{address['street']}, {address['area']} - {address['pincode']}"
        )
        return address
    except Exception as e:
        print(f"Reverse geocoding unavailable: {e}")
        return DEFAULT_ADDRESS.copy()


def get_device_location():
    """
    Resolve the current device location.

    Priority:
    1. DEVICE_LAT and DEVICE_LNG environment variables for exact demo control.
    2. IP-based location lookup, which works without GPS but is approximate.
    3. Chennai fallback coordinates.
    """
    if "DEVICE_LAT" in os.environ and "DEVICE_LNG" in os.environ:
        print(f"Using location from env: {FALLBACK_LAT}, {FALLBACK_LNG}")
        return FALLBACK_LAT, FALLBACK_LNG

    try:
        response = requests.get("https://ipapi.co/json/", timeout=3)
        response.raise_for_status()
        data = response.json()
        lat = data.get("latitude")
        lng = data.get("longitude")
        if isinstance(lat, (int, float)) and isinstance(lng, (int, float)):
            print(f"Using approximate device location: {lat}, {lng}")
            return float(lat), float(lng)
    except Exception as e:
        print(f"Location lookup unavailable: {e}")

    print(f"Using fallback location: {FALLBACK_LAT}, {FALLBACK_LNG}")
    return FALLBACK_LAT, FALLBACK_LNG


def is_pothole_candidate(area, x, y, w, h, thresh):
    """
    Filter dark regions so regular shadows/noise are less likely to report.
    This is a demo detector, not a trained model.
    """
    if not (MIN_CONTOUR_AREA < area < MAX_CONTOUR_AREA):
        return False

    aspect_ratio = w / float(h)
    if aspect_ratio < MIN_ASPECT_RATIO or aspect_ratio > MAX_ASPECT_RATIO:
        return False

    roi = thresh[y:y + h, x:x + w]
    dark_ratio = cv2.countNonZero(roi) / float(w * h)
    return dark_ratio >= MIN_DARK_RATIO


def detect_potholes(frame):
    """
    Detect pothole-like regions in frame
    Args:
        frame: Input frame from webcam
    Returns:
        List of (x, y, w, h, area) tuples and processed frame
    """
    # Convert to grayscale
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    # Apply Gaussian blur to reduce noise.
    blurred = cv2.GaussianBlur(gray, BLUR_KERNEL, 0)
    
    # Detect dark regions. This works well for a printed/displayed pothole image.
    _, fixed_thresh = cv2.threshold(
        blurred,
        THRESHOLD_VALUE,
        255,
        cv2.THRESH_BINARY_INV
    )
    adaptive_thresh = cv2.adaptiveThreshold(
        blurred,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV,
        31,
        7
    )
    thresh = cv2.bitwise_or(fixed_thresh, adaptive_thresh)
    
    # Morphological operations to clean up
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)
    
    # Find contours
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    detections = []
    processed_frame = frame.copy()
    
    for contour in contours:
        area = cv2.contourArea(contour)
        x, y, w, h = cv2.boundingRect(contour)

        if is_pothole_candidate(area, x, y, w, h, thresh):
            detections.append((x, y, w, h, area))
            
            # Draw bounding box
            cv2.rectangle(processed_frame, (x, y), (x + w, y + h), (0, 0, 255), 2)
            cv2.putText(
                processed_frame,
                f"Pothole? area={int(area)}",
                (x, max(y - 10, 20)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.55,
                (0, 0, 255),
                2
            )
    
    return detections, processed_frame


def run_detection():
    """
    Main detection loop
    """
    # Open webcam
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("Error: Cannot access webcam")
        sys.exit(1)
    
    # Set resolution
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    
    lat, lng = get_device_location()
    address = reverse_geocode(lat, lng)

    print("🚗 Pothole Detection System Started")
    print(f"Backend: {BACKEND_URL}")
    print(f"Report location: lat={lat}, lng={lng}")
    print(
        "Report address: "
        f"{address['street']}, {address['area']} - {address['pincode']}"
    )
    print("Show a pothole image to the webcam.")
    print("Press 'P' to simulate high impact / 'R' to refresh location / 'Q' to quit")
    print("=" * 50)
    
    last_report_time = 0
    
    try:
        while True:
            ret, frame = cap.read()
            
            if not ret:
                print("Error: Failed to read frame")
                break
            
            # Detect potholes
            detections, processed_frame = detect_potholes(frame)
            
            # Report detections
            current_time = time.time()
            if detections and (current_time - last_report_time) > REPORT_INTERVAL:
                # Get keyboard input (non-blocking)
                key = cv2.waitKey(1) & 0xFF
                
                impact = key == ord('p') or key == ord('P')
                
                for x, y, w, h, area in detections:
                    severity = calculate_severity(area, impact)
                    
                    # Send report asynchronously
                    Thread(
                        target=send_pothole_report,
                        args=(severity, lat, lng, address),
                        daemon=True
                    ).start()
                
                last_report_time = current_time
            
            # Display frame
            cv2.imshow("Pothole Detection", processed_frame)
            
            # Handle keyboard input
            key = cv2.waitKey(1) & 0xFF
            if key == ord('q') or key == ord('Q'):
                print("\n🛑 Stopping detection system...")
                break
            elif key == ord('p') or key == ord('P'):
                print("💥 High impact detected!")
            elif key == ord('r') or key == ord('R'):
                lat, lng = get_device_location()
                address = reverse_geocode(lat, lng)
                print(f"Report location refreshed: lat={lat}, lng={lng}")
                print(
                    "Report address refreshed: "
                    f"{address['street']}, {address['area']} - {address['pincode']}"
                )
    
    except KeyboardInterrupt:
        print("\n🛑 Interrupted by user")
    
    finally:
        cap.release()
        cv2.destroyAllWindows()
        print("✓ Detection system stopped")


if __name__ == "__main__":
    run_detection()
