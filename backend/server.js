/**
 * Smart Road Quality Monitoring System - Backend Server
 * Stores and manages pothole reports, handles clustering and confirmations
 */

const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage
let potholes = [];
let nextId = 1;
let currentDeviceLocation = null;

// Constants
const PROXIMITY_THRESHOLD = 0.001; // ~100 meters in lat/lng
const MAX_SEVERITY = 3;
const DEFAULT_ADDRESS = {
  street: "Unknown street",
  area: "Unknown area",
  pincode: "Unknown pincode",
  displayName: "Address unavailable",
};

/**
 * Calculate distance between two coordinates
 * Uses simple Euclidean distance (approximate for small distances)
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
  const dLat = Math.abs(lat1 - lat2);
  const dLng = Math.abs(lng1 - lng2);
  return Math.sqrt(dLat * dLat + dLng * dLng);
}

/**
 * Find nearby pothole within proximity threshold
 */
function findNearbyPothole(lat, lng) {
  return potholes.find(
    (pothole) =>
      calculateDistance(
        pothole.location.lat,
        pothole.location.lng,
        lat,
        lng
      ) < PROXIMITY_THRESHOLD
  );
}

function normalizeAddress(address) {
  return {
    street: address?.street || DEFAULT_ADDRESS.street,
    area: address?.area || DEFAULT_ADDRESS.area,
    pincode: address?.pincode || DEFAULT_ADDRESS.pincode,
    displayName: address?.displayName || DEFAULT_ADDRESS.displayName,
  };
}

function normalizeLocation(location) {
  if (!location) {
    return null;
  }

  const lat = Number(location.lat);
  const lng = Number(location.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  return { lat, lng };
}

/**
 * POST /device-location - Store the latest app/device GPS location
 * Body: { location: { lat, lng }, address? }
 */
app.post("/device-location", (req, res) => {
  const location = normalizeLocation(req.body.location);

  if (!location) {
    return res.status(400).json({
      error: "Missing or invalid location: { lat, lng }",
    });
  }

  currentDeviceLocation = {
    location,
    address: normalizeAddress(req.body.address),
    updatedAt: new Date().toISOString(),
  };

  res.json({
    status: "updated",
    deviceLocation: currentDeviceLocation,
  });
});

/**
 * GET /device-location - Retrieve the latest app/device GPS location
 */
app.get("/device-location", (req, res) => {
  if (!currentDeviceLocation) {
    return res.status(404).json({ error: "Device location not available yet" });
  }

  res.json(currentDeviceLocation);
});

/**
 * POST /report - Report a new pothole
 * Body: { type, severity, location: { lat, lng }, address? }
 */
app.post("/report", (req, res) => {
  const { type, severity, location, address, source, capturedAt } = req.body;

  // Validation
  if (!type || !severity || !location) {
    return res.status(400).json({
      error: "Missing required fields: type, severity, location",
    });
  }

  if (severity < 1 || severity > MAX_SEVERITY) {
    return res.status(400).json({ error: "Severity must be 1-3" });
  }

  const normalizedLocation = normalizeLocation(location);
  if (!normalizedLocation) {
    return res.status(400).json({
      error: "Invalid location: lat and lng must be numbers",
    });
  }

  const { lat, lng } = normalizedLocation;
  const normalizedAddress = normalizeAddress(address);

  // Check if nearby pothole exists (clustering logic)
  const existingPothole = findNearbyPothole(lat, lng);

  if (existingPothole) {
    // Update existing pothole
    existingPothole.detectionCount = (existingPothole.detectionCount || 1) + 1;
    existingPothole.severity = Math.max(existingPothole.severity, severity);
    existingPothole.location = { lat, lng };
    existingPothole.address = normalizedAddress;
    existingPothole.source = source || existingPothole.source;
    existingPothole.capturedAt = capturedAt || existingPothole.capturedAt;
    existingPothole.lastUpdated = new Date().toISOString();

    console.log(
      `✓ Updated pothole ID ${existingPothole.id}: detections=${existingPothole.detectionCount}, confirmations=${existingPothole.count}, severity=${existingPothole.severity}`
    );

    return res.json({
      status: "updated",
      id: existingPothole.id,
      count: existingPothole.count,
      detectionCount: existingPothole.detectionCount,
      severity: existingPothole.severity,
      address: existingPothole.address,
    });
  } else {
    // Create new pothole
    const newPothole = {
      id: nextId++,
      type,
      severity,
      location: { lat, lng },
      address: normalizedAddress,
      source: source || "unknown",
      capturedAt: capturedAt || null,
      detectionCount: 1,
      count: 0,
      confirmed: false,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    potholes.push(newPothole);

    console.log(
      `✓ New pothole created: ID ${newPothole.id}, severity=${newPothole.severity}, lat=${lat}, lng=${lng}, street=${normalizedAddress.street}, area=${normalizedAddress.area}, pincode=${normalizedAddress.pincode}`
    );

    return res.json({
      status: "created",
      id: newPothole.id,
      severity: newPothole.severity,
      address: newPothole.address,
    });
  }
});

/**
 * GET /potholes - Retrieve all potholes
 */
app.get("/potholes", (req, res) => {
  res.json({
    count: potholes.length,
    potholes: potholes,
  });
});

/**
 * POST /confirm - User confirmation of pothole existence
 * Body: { id, exists }
 */
app.post("/confirm", (req, res) => {
  const { id, exists } = req.body;

  // Validation
  if (id === undefined || exists === undefined) {
    return res.status(400).json({
      error: "Missing required fields: id, exists",
    });
  }

  // Find pothole
  const pothole = potholes.find((p) => p.id === id);

  if (!pothole) {
    return res.status(404).json({ error: "Pothole not found" });
  }

  // Update count based on confirmation
  if (exists === true) {
    pothole.count += 1;
    console.log(`✓ Pothole ID ${id} confirmed: count=${pothole.count}`);
  } else if (exists === false) {
    pothole.count = Math.max(0, pothole.count - 1);

    // Remove if count reaches 0
    if (pothole.count === 0) {
      potholes = potholes.filter((p) => p.id !== id);
      console.log(`✓ Pothole ID ${id} removed (count reached 0)`);
      return res.json({
        status: "removed",
        id: id,
      });
    }

    console.log(`✓ Pothole ID ${id} marked not found: count=${pothole.count}`);
  }

  pothole.lastUpdated = new Date().toISOString();

  res.json({
    status: "confirmed",
    id: pothole.id,
    count: pothole.count,
    exists: exists,
  });
});

/**
 * DELETE /potholes/:id - Remove a specific pothole
 */
app.delete("/potholes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const initialCount = potholes.length;

  potholes = potholes.filter((p) => p.id !== id);

  if (potholes.length < initialCount) {
    console.log(`✓ Pothole ID ${id} deleted`);
    res.json({ status: "deleted", id: id });
  } else {
    res.status(404).json({ error: "Pothole not found" });
  }
});

/**
 * GET /stats - Get system statistics
 */
app.get("/stats", (req, res) => {
  const severityCounts = {
    1: potholes.filter((p) => p.severity === 1).length,
    2: potholes.filter((p) => p.severity === 2).length,
    3: potholes.filter((p) => p.severity === 3).length,
  };

  const totalConfirmations = potholes.reduce((sum, p) => sum + p.count, 0);

  res.json({
    totalPotholes: potholes.length,
    totalConfirmations: totalConfirmations,
    severityCounts: severityCounts,
    averageConfirmations:
      potholes.length > 0 ? (totalConfirmations / potholes.length).toFixed(2) : 0,
  });
});

/**
 * Health check endpoint
 */
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║   Smart Road Quality Monitoring System - Backend Server   ║
╚═══════════════════════════════════════════════════════════╝

🚀 Server running on http://localhost:${PORT}

Endpoints:
  POST   /report        - Report a pothole
  GET    /potholes      - Get all potholes
  POST   /device-location - Update current device location
  GET    /device-location - Get current device location
  POST   /confirm       - Confirm pothole existence
  DELETE /potholes/:id  - Delete a pothole
  GET    /stats         - Get system statistics
  GET    /health        - Health check

Press Ctrl+C to stop the server
`);
});
