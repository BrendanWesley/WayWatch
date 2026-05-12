# 🛣️ WAY WATCH

### AI-Powered Smart Road Quality Monitoring System

WAY WATCH is a real-time AI-powered road infrastructure monitoring platform built for the **Niral Thiruvizha Hackathon**.

The system detects potholes using computer vision, dynamically updates a live dashboard, tracks road damage severity, and enables crowd-sourced road validation for smarter and safer urban infrastructure.

---

# 🚀 Project Vision

Road damage such as potholes and cracks often goes unreported until it becomes dangerous.

WAY WATCH aims to solve this problem through:

* AI-based pothole detection
* Real-time infrastructure monitoring
* Dynamic severity ranking
* Crowd validation
* Smart-city analytics

The platform transforms ordinary vehicles into intelligent road monitoring systems.

---

# 🧠 Core Features

✅ AI-powered pothole detection
✅ Real-time dashboard updates
✅ Severity classification
✅ GPS-based pothole mapping
✅ Crowd confirmation system
✅ Smart infrastructure analytics
✅ Modern futuristic UI
✅ Live map visualization
✅ Browser-based location tracking
✅ OpenStreetMap reverse geocoding
✅ Scalable smart-city architecture

---

# 🏗️ System Architecture

```text
Laptop Webcam
      ↓
Python AI Detection Engine
      ↓
Teachable Machine Keras Model
      ↓
Pothole Detection
      ↓
Severity Assignment
      ↓
Location Retrieval
      ↓
Node.js Backend API
      ↓
React Native Dashboard
      ↓
Real-Time Public Monitoring
```

---

# ⚙️ Tech Stack

## Frontend

* React Native
* Expo
* Expo Web
* React Native Maps
* Axios
* Modern Glassmorphism UI

## Backend

* Node.js
* Express.js
* REST APIs

## AI Detection

* Python
* TensorFlow/Keras
* OpenCV
* Teachable Machine

## Location Services

* Browser Geolocation API
* OpenStreetMap Nominatim API

## Future AI Integration

* Gemini API

---

# 🧠 AI Detection Pipeline

The system uses a Teachable Machine image classification model trained on:

* potholes
* non-pothole environments

The detection engine:

1. Captures webcam frames
2. Resizes image to 224x224
3. Normalizes image
4. Runs Keras inference
5. Applies confidence threshold
6. Uses stable-frame detection
7. Sends pothole report to backend

---

# 📍 Real-Time Location Tracking

WAY WATCH dynamically retrieves:

* device location
* road name
* area
* pincode

using:

* Browser Geolocation API
* OpenStreetMap reverse geocoding

This allows potholes to appear live on the map dashboard.

---

# 🚨 Severity Classification

Current severity system:

| Level | Meaning  |
| ----- | -------- |
| 1     | Minor    |
| 2     | Moderate |
| 3     | Critical |

The prototype currently simulates accelerometer-based impact detection.

Future implementation:

* real accelerometer integration
* vibration analysis
* AI-based prioritization

---

# 🗺️ Live Dashboard Features

The dashboard includes:

* live pothole map
* severity color coding
* road statistics
* crowd confirmation
* AI insight cards
* futuristic smart-city UI

Severity Colors:

* 🟢 Green → Minor
* 🟡 Yellow → Moderate
* 🔴 Red → Critical

---

# 👥 Crowd Validation System

Public users can:

* confirm pothole existence
* mark potholes as resolved
* improve data reliability

This creates a dynamic community-driven road monitoring ecosystem.

---

# 🤖 Future Gemini AI Integration

Gemini AI will be integrated for:

* infrastructure analysis
* maintenance recommendations
* hotspot analysis
* road risk assessment
* severity prioritization
* smart-city reporting

Example:

> “Recurring severe potholes detected in high-traffic zones. Immediate maintenance recommended.”

---

# 📁 Project Structure

```text
pothole-project/

├── app/
│   ├── App.js
│   ├── components/
│   ├── theme/
│   └── package.json
│
├── backend/
│   ├── server.js
│   └── package.json
│
├── detection/
│   ├── detect.py
│   ├── keras_model.h5
│   └── labels.txt
│
└── README.md
```

---

# 🚀 Running the Project

## 1️⃣ Backend

```bash
cd backend
npm install
npm start
```

---

## 2️⃣ Frontend

```bash
cd app
npm install
npx expo start --web
```

---

## 3️⃣ AI Detection Engine

```bash
cd detection
pip install tensorflow opencv-python numpy requests
python3 detect.py
```

---

# 📡 Backend API Endpoints

| Method | Endpoint         | Description            |
| ------ | ---------------- | ---------------------- |
| POST   | /report          | Create pothole report  |
| GET    | /potholes        | Get all potholes       |
| POST   | /device-location | Update device location |
| GET    | /device-location | Retrieve location      |
| POST   | /confirm         | Confirm pothole        |
| GET    | /stats           | Dashboard statistics   |
| GET    | /health          | Health check           |

---

# 🎯 Hackathon Innovation

WAY WATCH combines:

* AI
* computer vision
* geolocation
* crowd intelligence
* smart-city analytics

into one unified intelligent infrastructure platform.

Unlike traditional reporting systems, WAY WATCH enables:

* proactive road monitoring
* automated damage detection
* dynamic public validation
* scalable urban analytics

---

# 🔮 Future Scope

* YOLO-based pothole detection
* Real accelerometer integration
* Cloud database persistence
* Municipal authority dashboard
* Push notifications
* Heatmap visualization
* Predictive road analytics
* Autonomous vehicle integration

---

# 🌍 Impact

WAY WATCH aims to:

* reduce accidents
* improve road maintenance
* enable faster municipal response
* build smarter cities
* improve commuter safety

---

# 👨‍💻 Team

Built for **Niral Thiruvizha Hackathon** 🚀

WAY WATCH — Reimagining Road Infrastructure with AI.
