import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
  SafeAreaView,
  ScrollView,
} from "react-native";
import axios from "axios";
import * as Location from "expo-location";
import PotholeMap from "./components/PotholeMap";

/**
 * Smart Road Quality Monitoring System - React Native App
 * Displays potholes on a map with real-time updates
 */

const BACKEND_IP = "192.168.1.100"; // Use your laptop's IP for Expo Go on a phone.
const BACKEND_PORT = 3000;
const BACKEND_HOST =
  Platform.OS === "web"
    ? "localhost"
    : Platform.OS === "android"
    ? "10.0.2.2"
    : BACKEND_IP;
const BACKEND_URL = `http://${BACKEND_HOST}:${BACKEND_PORT}`;

const DEFAULT_REGION = {
  latitude: 13.0827,
  longitude: 80.2707,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

// Severity colors
const SEVERITY_COLORS = {
  1: "#4CAF50", // Green - Small
  2: "#FFC107", // Yellow - Medium
  3: "#F44336", // Red - Large
};

const SEVERITY_LABELS = {
  1: "Small (Low)",
  2: "Medium",
  3: "Large (Critical)",
};

export default function App() {
  const [potholes, setPotholes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [currentRegion, setCurrentRegion] = useState(DEFAULT_REGION);

  /**
   * Fetch potholes from backend
   */
  const fetchPotholes = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/potholes`, {
        timeout: 5000,
      });
      setPotholes(response.data.potholes || []);
      setError(null);
    } catch (err) {
      console.log("Connection error:", err.message);
      setError(`Cannot connect to backend at ${BACKEND_URL}`);
      // Continue polling even on error
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch statistics from backend
   */
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/stats`, {
        timeout: 5000,
      });
      setStats(response.data);
    } catch (err) {
      console.log("Stats error:", err.message);
    }
  };

  const buildAddress = (reverseGeocodeResult) => ({
    street:
      reverseGeocodeResult?.street ||
      reverseGeocodeResult?.name ||
      "Unknown street",
    area:
      reverseGeocodeResult?.district ||
      reverseGeocodeResult?.subregion ||
      reverseGeocodeResult?.city ||
      "Unknown area",
    pincode: reverseGeocodeResult?.postalCode || "Unknown pincode",
    displayName: [
      reverseGeocodeResult?.street || reverseGeocodeResult?.name,
      reverseGeocodeResult?.district ||
        reverseGeocodeResult?.subregion ||
        reverseGeocodeResult?.city,
      reverseGeocodeResult?.postalCode,
    ]
      .filter(Boolean)
      .join(", "),
  });

  const publishCurrentDeviceLocation = async () => {
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== "granted") {
        console.log("Location permission denied");
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      const [reverseGeocodeResult] = await Location.reverseGeocodeAsync({
        latitude: location.lat,
        longitude: location.lng,
      });

      setCurrentRegion({
        latitude: location.lat,
        longitude: location.lng,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });

      await axios.post(
        `${BACKEND_URL}/device-location`,
        {
          location,
          address: buildAddress(reverseGeocodeResult),
        },
        { timeout: 5000 }
      );
    } catch (err) {
      console.log("Location publish error:", err.message);
    }
  };

  /**
   * Confirm pothole existence (user action)
   */
  const confirmPothole = async (id, exists) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/confirm`,
        { id, exists },
        { timeout: 5000 }
      );

      if (response.status === 200) {
        const action = exists ? "confirmed" : "not found";
        Alert.alert("Success", `Pothole ${action} and updated!`);
        fetchPotholes(); // Refresh list
        fetchStats();
      }
    } catch (err) {
      Alert.alert("Error", "Failed to update pothole: " + err.message);
    }
  };

  /**
   * Handle marker press - show confirmation dialog
   */
  const handleMarkerPress = (pothole) => {
    const address = pothole.address || {};

    Alert.alert(
      "Pothole Confirmation",
      `Severity: ${SEVERITY_LABELS[pothole.severity]}\nDetections: ${pothole.detectionCount || 1}\nConfirmations: ${pothole.count || 0}\nStreet: ${address.street || "Unknown street"}\nArea: ${address.area || "Unknown area"}\nPincode: ${address.pincode || "Unknown pincode"}`,
      [
        {
          text: "Still exists (Yes)",
          onPress: () => confirmPothole(pothole.id, true),
          style: "destructive",
        },
        {
          text: "Fixed (No)",
          onPress: () => confirmPothole(pothole.id, false),
          style: "default",
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  // Fetch potholes every second so webcam detections appear quickly.
  useEffect(() => {
    publishCurrentDeviceLocation();
    fetchPotholes();
    fetchStats();

    const interval = setInterval(() => {
      fetchPotholes();
      fetchStats();
    }, 1000);

    const locationInterval = setInterval(publishCurrentDeviceLocation, 30000);

    return () => {
      clearInterval(interval);
      clearInterval(locationInterval);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>WAY WATCH</Text>
        <Text style={styles.subtitle}>Tap markers to confirm potholes</Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <Text style={styles.errorSubtext}>
            Start the backend with: cd backend && npm start
          </Text>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Connecting to backend...</Text>
        </View>
      ) : (
        <>
          <PotholeMap
            initialRegion={currentRegion}
            potholes={potholes}
            severityColors={SEVERITY_COLORS}
            severityLabels={SEVERITY_LABELS}
            onPotholePress={handleMarkerPress}
          />

          {stats && (
            <View style={styles.statsContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Total Potholes</Text>
                  <Text style={styles.statValue}>{stats.totalPotholes}</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Critical (Red)</Text>
                  <Text style={[styles.statValue, { color: SEVERITY_COLORS[3] }]}>
                    {stats.severityCounts[3]}
                  </Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Medium (Yellow)</Text>
                  <Text style={[styles.statValue, { color: SEVERITY_COLORS[2] }]}>
                    {stats.severityCounts[2]}
                  </Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Low (Green)</Text>
                  <Text style={[styles.statValue, { color: SEVERITY_COLORS[1] }]}>
                    {stats.severityCounts[1]}
                  </Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Confirmations</Text>
                  <Text style={styles.statValue}>
                    {stats.totalConfirmations}
                  </Text>
                </View>
              </ScrollView>
            </View>
          )}

          {potholes.length === 0 && !loading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>✓ No potholes detected!</Text>
              <Text style={styles.emptySubtext}>
                Road is in good condition
              </Text>
            </View>
          )}
        </>
      )}

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendColor, { backgroundColor: SEVERITY_COLORS[3] }]}
          />
          <Text style={styles.legendLabel}>Critical</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendColor, { backgroundColor: SEVERITY_COLORS[2] }]}
          />
          <Text style={styles.legendLabel}>Medium</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendColor, { backgroundColor: SEVERITY_COLORS[1] }]}
          />
          <Text style={styles.legendLabel}>Low</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 12,
    color: "#e3f2fd",
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    borderBottomWidth: 2,
    borderBottomColor: "#f44336",
    padding: 12,
  },
  errorText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#c62828",
  },
  errorSubtext: {
    fontSize: 12,
    color: "#d32f2f",
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4CAF50",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#888",
    marginTop: 8,
  },
  statsContainer: {
    backgroundColor: "white",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    maxHeight: 100,
  },
  statBox: {
    marginHorizontal: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    alignItems: "center",
    minWidth: 90,
  },
  statLabel: {
    fontSize: 11,
    color: "#666",
    fontWeight: "600",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2196F3",
    marginTop: 4,
  },
  legend: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendLabel: {
    fontSize: 12,
    color: "#666",
  },
});
