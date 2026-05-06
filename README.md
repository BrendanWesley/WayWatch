# 🚗 Smart Road Quality Monitoring System

A full-stack prototype for real-time pothole detection using webcam input, with a Node.js backend and React Native mobile app for crowd-sourced validation.

## 📋 Project Overview

This system demonstrates:
- **Python/OpenCV**: Webcam-based pothole detection using contour analysis
- **Node.js/Express**: RESTful backend with clustering and confirmation logic
- **React Native/Expo**: Real-time map display with severity-based markers
- **Crowd Validation**: Users confirm/reject pothole reports for data accuracy

### System Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Vehicle (Laptop)                   │
│  ┌────────────────────────────────────────────────┐ │
│  │   Python Detection Script (detect.py)          │ │
│  │  - Webcam capture & OpenCV processing          │ │
│  │  - Contour detection for potholes              │ │
│  │  - Severity calculation                        │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
             │ HTTP POST /report
             ▼
┌─────────────────────────────────────────────────────┐
│            Backend Server (Node.js)                 │
│  ┌────────────────────────────────────────────────┐ │
│  │  Express Server - Port 3000                    │ │
│  │  - Store pothole data (in-memory)              │ │
│  │  - Cluster nearby detections                   │ │
│  │  - Track confirmation count                    │ │
│  │  - REST APIs for mobile app                    │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
       │ HTTP GET /potholes    │ HTTP POST /confirm
       ▼                        ▼
┌─────────────────────────────────────────────────────┐
│           Mobile App (React Native/Expo)            │
│  ┌────────────────────────────────────────────────┐ │
│  │  - Map display (centered at Chennai)           │ │
│  │  - Real-time marker updates (3sec interval)    │ │
│  │  - Severity-based color coding                 │ │
│  │  - Confirmation dialog on marker tap           │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
pothole-project/
├── detection/
│   └── detect.py              # Python pothole detection script
│
├── backend/
│   ├── server.js              # Express.js server
│   ├── package.json           # Node dependencies
│   └── node_modules/          # (created after npm install)
│
├── app/
│   ├── App.js                 # Main React Native component
│   ├── package.json           # Expo dependencies
│   ├── app.json               # Expo configuration
│   ├── babel.config.js        # Babel configuration
│   ├── .gitignore             # Git ignore rules
│   ├── node_modules/          # (created after npm install)
│   └── .expo/                 # (created when running Expo)
│
└── README.md                  # This file
```

---

## 🚀 Quick Start Guide

### Prerequisites

- **Python 3.8+** with pip
- **Node.js 16+** with npm
- **Expo CLI** (`npm install -g expo-cli`)
- **Git** (optional)

### Installation & Setup

#### 1️⃣ Clone/Download the Project

```bash
cd ~/pothole-project
```

#### 2️⃣ Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**React Native App:**
```bash
cd ../app
npm install
# This may take a few minutes
```

**Python:**
```bash
cd ../detection
pip install opencv-python requests
```

#### 3️⃣ Find Your Laptop's IP Address

**On macOS/Linux:**
```bash
ifconfig | grep "inet "
# Look for your local IP (e.g., 192.168.1.100)
```

**On Windows:**
```bash
ipconfig
# Look for IPv4 Address (e.g., 192.168.1.100)
```

**Update the React Native app with your IP:**
- Edit [app/App.js](app/App.js)
- Find line: `const BACKEND_IP = "192.168.1.100";`
- Replace with your actual laptop IP address

---

## ▶️ Running the System

### Step 1: Start the Backend Server

```bash
cd backend
npm start
# Output: Server running on http://localhost:3000
```

✅ Backend should be running on `http://localhost:3000`

### Step 2: Start the Python Detection Script

**In a new terminal:**
```bash
cd detection
python3 detect.py
```

✅ The script will:
- Open your webcam
- Display real-time frame with detected objects
- Show "🚗 Pothole Detection System Started"

**Controls:**
- **P** → Simulate high impact (severity = 3)
- **Q** → Quit application

### Step 3: Start the React Native App

**In a new terminal:**
```bash
cd app
npm start
# or: expo start
```

✅ This launches Expo:
- Press **a** to open Android emulator (requires Android Studio)
- Press **i** to open iOS simulator (macOS only)
- Scan QR code with **Expo Go** app on physical device

**Important:** Make sure the app can reach your backend:
- If using physical device: Ensure it's on the same WiFi as laptop
- If using emulator: Android emulator can reach `localhost`, iOS cannot (use laptop IP)

---

## 🔌 API Endpoints

### 1. Report Pothole
**POST** `http://localhost:3000/report`

**Request Body:**
```json
{
  "type": "pothole",
  "severity": 2,
  "location": {
    "lat": 13.0827,
    "lng": 80.2707
  }
}
```

**Response:**
```json
{
  "status": "created",
  "id": 1,
  "severity": 2
}
```

### 2. Get All Potholes
**GET** `http://localhost:3000/potholes`

**Response:**
```json
{
  "count": 2,
  "potholes": [
    {
      "id": 1,
      "type": "pothole",
      "severity": 3,
      "location": { "lat": 13.0827, "lng": 80.2707 },
      "count": 5,
      "confirmed": false,
      "createdAt": "2024-05-06T10:00:00Z",
      "lastUpdated": "2024-05-06T10:05:00Z"
    }
  ]
}
```

### 3. Confirm Pothole
**POST** `http://localhost:3000/confirm`

**Request Body:**
```json
{
  "id": 1,
  "exists": true
}
```

**Response:**
```json
{
  "status": "confirmed",
  "id": 1,
  "count": 6,
  "exists": true
}
```

### 4. Get Statistics
**GET** `http://localhost:3000/stats`

**Response:**
```json
{
  "totalPotholes": 2,
  "totalConfirmations": 11,
  "severityCounts": { "1": 1, "2": 0, "3": 1 },
  "averageConfirmations": "5.50"
}
```

### 5. Delete Pothole
**DELETE** `http://localhost:3000/potholes/:id`

**Response:**
```json
{
  "status": "deleted",
  "id": 1
}
```

### 6. Health Check
**GET** `http://localhost:3000/health`

---

## 🧠 How It Works

### Detection Logic (Python)

1. **Frame Capture**: OpenCV captures webcam frames (640x480)
2. **Preprocessing**:
   - Convert to grayscale
   - Apply Gaussian blur (9x9 kernel)
   - Threshold to create binary image (dark regions = potholes)
   - Morphological operations for noise removal
3. **Contour Detection**: Find contours in threshold image
4. **Filtering**: Keep contours with area between 500-100,000 pixels
5. **Severity Calculation**:
   - Area < 5,000 px² → Severity 1 (green)
   - Area 5,000-15,000 px² → Severity 2 (yellow)
   - Area > 15,000 px² → Severity 3 (red)
   - **P** key press → Override to Severity 3
6. **Report**: Send JSON to backend with severity and location

### Backend Logic (Node.js)

1. **Receive Report**: POST /report endpoint receives pothole data
2. **Clustering**:
   - Check if pothole exists within 0.001° (≈100m) proximity
   - If exists: Increment count, update max severity
   - If new: Create entry with ID, count=1
3. **Storage**: Keep in-memory array (resets on server restart)
4. **Confirmation**:
   - POST /confirm with `exists=true` → Increment count
   - POST /confirm with `exists=false` → Decrement count
   - If count reaches 0 → Remove pothole

### Mobile App Logic (React Native)

1. **Initialization**: Load initial region (Chennai)
2. **Fetch Loop**: Every 3 seconds:
   - GET /potholes from backend
   - GET /stats for dashboard
3. **Map Rendering**:
   - Display map centered at Chennai
   - Add marker for each pothole
   - Color by severity: Red=3, Yellow=2, Green=1
4. **User Interaction**:
   - Tap marker → Show alert dialog
   - Select "Still exists" → POST /confirm with `exists=true`
   - Select "Fixed" → POST /confirm with `exists=false`
5. **Real-time Update**: Map updates immediately after confirmation

---

## 🎨 Severity Color Coding

| Severity | Color  | Size Category | Action Priority |
|----------|--------|---------------|-----------------|
| 1        | 🟢 Green | Small        | Low             |
| 2        | 🟡 Yellow | Medium       | Medium          |
| 3        | 🔴 Red  | Large        | Critical        |

---

## 🧪 Testing the System

### Test Scenario 1: Create a Pothole
1. Start all three components
2. Show a dark object (phone screen) to webcam
3. Watch Python detect and report it
4. Check mobile app - marker appears
5. Confirm in app

### Test Scenario 2: Cluster Detection
1. Show same object multiple times
2. Watch pothole count increase
3. Severity stays at maximum

### Test Scenario 3: Simulate Impact
1. Press **P** while dark object is visible
2. Severity overrides to 3 (red marker)
3. New report created if not nearby existing

### Test Scenario 4: Remove Pothole
1. Tap marker in app
2. Select "Fixed (No)"
3. Count decreases
4. When count = 0, marker disappears

---

## ⚙️ Configuration

### Python (detect.py)

```python
# Adjust detection sensitivity
BLUR_KERNEL = (9, 9)           # Increase for more blur
THRESHOLD_VALUE = 50            # Lower = detect darker objects
MIN_CONTOUR_AREA = 500          # Minimum size to detect
MAX_CONTOUR_AREA = 100000       # Maximum size to detect

# Backend endpoint
BACKEND_URL = "http://localhost:3000/report"

# GPS coordinates
STATIC_LAT = 13.0827
STATIC_LNG = 80.2707
```

### React Native App (App.js)

```javascript
// Update with your laptop IP
const BACKEND_IP = "192.168.1.100";
const BACKEND_PORT = 3000;

// Fetch interval (milliseconds)
const FETCH_INTERVAL = 3000;

// Initial map region
const INITIAL_REGION = {
  latitude: 13.0827,
  longitude: 80.2707,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};
```

### Backend (server.js)

```javascript
// Proximity threshold for clustering (degrees)
const PROXIMITY_THRESHOLD = 0.001; // ~100 meters

// Port
const PORT = 3000;
```

---

## 🐛 Troubleshooting

### Issue: "Connection refused" in Python script
**Solution:**
- Make sure backend is running: `npm start` in `backend/`
- Check backend URL in detect.py matches your setup

### Issue: App shows "Cannot connect to backend"
**Solution:**
- Verify laptop IP is correct: Use `ifconfig` and update App.js
- Ensure app and laptop are on **same WiFi network**
- Check if backend is running: `curl http://localhost:3000/health`

### Issue: Webcam not detected
**Solution:**
```bash
# macOS: Grant camera permission in System Preferences > Security & Privacy
# Check if Python can access camera:
python3 -c "import cv2; cap = cv2.VideoCapture(0); print(cap.isOpened())"
```

### Issue: Expo app won't start
**Solution:**
```bash
# Clear Expo cache
cd app
rm -rf .expo/
npm install
npm start
```

### Issue: Map not showing potholes
**Solution:**
- Verify backend IP in App.js: `const BACKEND_IP = "YOUR_IP";`
- Test connectivity: Open `http://YOUR_IP:3000/potholes` in browser
- Check if Python is sending reports: Watch backend console

### Issue: "Module not found" errors
**Solution:**
```bash
# Reinstall dependencies
cd backend
rm -rf node_modules
npm install

cd ../app
rm -rf node_modules
npm install
```

---

## 📊 Data Storage

All pothole data is stored **in-memory** on the backend server:
- Data is lost when server restarts
- Perfect for prototyping and testing
- For production: Replace with MongoDB/PostgreSQL

### Sample In-Memory Data Structure
```javascript
potholes = [
  {
    id: 1,
    type: "pothole",
    severity: 3,
    location: { lat: 13.0827, lng: 80.2707 },
    count: 5,
    confirmed: false,
    createdAt: "2024-05-06T10:00:00Z",
    lastUpdated: "2024-05-06T10:05:00Z"
  }
]
```

---

## 🔄 Real-Time Data Flow Example

```
Time: 0s
Python detects pothole → POST /report (severity=2)
Backend: Creates pothole ID=1, count=1

Time: 0.5s
Python detects same pothole → POST /report (severity=2)
Backend: Found nearby pothole, update ID=1, count=2

Time: 3s
App: GET /potholes
Response: Returns ID=1 with count=2
App: Renders yellow marker at location

Time: 5s
User taps marker: "Still exists (Yes)"
App: POST /confirm { id: 1, exists: true }
Backend: Update ID=1, count=3

Time: 6s
App: GET /potholes (refresh)
Response: ID=1 now has count=3
```

---

## 🎯 Next Steps / Enhancements

**Future improvements:**
- [ ] Add database persistence (MongoDB/PostgreSQL)
- [ ] GPS from phone (instead of static coordinates)
- [ ] ML model for accurate pothole detection
- [ ] User authentication & contribution scoring
- [ ] Heatmap visualization
- [ ] Notifications for critical potholes
- [ ] Image capture & storage
- [ ] Offline-first sync capabilities

---

## 📄 License

MIT License - Feel free to use and modify!

---

## 🤝 Contributing

Found a bug? Have suggestions?
1. Test the system thoroughly
2. Document the issue clearly
3. Provide test steps to reproduce

---

## 📞 Support

**Questions?**
- Check troubleshooting section above
- Review API endpoints documentation
- Examine code comments for details

---

## 🎓 Learning Resources

- **OpenCV**: https://docs.opencv.org/
- **Express.js**: https://expressjs.com/
- **React Native**: https://reactnative.dev/
- **Expo**: https://expo.dev/
- **REST APIs**: https://restfulapi.net/

---

**Built with ❤️ for smart city infrastructure**
