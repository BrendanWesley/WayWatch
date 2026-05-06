import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PotholeMap({
  initialRegion,
  potholes,
  severityColors,
  severityLabels,
  onPotholePress,
}) {
  return (
    <View style={styles.panel}>
      <View style={styles.centerMarker}>
        <Text style={styles.centerTitle}>Current Device Location</Text>
        <Text style={styles.centerCoords}>
          {initialRegion.latitude.toFixed(4)}, {initialRegion.longitude.toFixed(4)}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {potholes.map((pothole) => (
          <PotholeRow
            key={pothole.id}
            pothole={pothole}
            severityColors={severityColors}
            severityLabels={severityLabels}
            onPotholePress={onPotholePress}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function PotholeRow({ pothole, severityColors, severityLabels, onPotholePress }) {
  const address = pothole.address || {};

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={() => onPotholePress(pothole)}
    >
      <View
        style={[
          styles.dot,
          { backgroundColor: severityColors[pothole.severity] },
        ]}
      />
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>Pothole #{pothole.id}</Text>
        <Text style={styles.rowMeta}>
          {severityLabels[pothole.severity]} · {pothole.detectionCount || 1} detections · {pothole.count || 0} confirmations
        </Text>
        <Text style={styles.rowAddress}>
          {address.street || "Unknown street"}, {address.area || "Unknown area"}
        </Text>
        <Text style={styles.rowAddress}>
          Pincode: {address.pincode || "Unknown pincode"}
        </Text>
        <Text style={styles.rowCoords}>
          {pothole.location.lat.toFixed(4)}, {pothole.location.lng.toFixed(4)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  panel: {
    flex: 1,
    backgroundColor: "#e9f3f7",
    padding: 16,
  },
  centerMarker: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: "#d5e4ea",
  },
  centerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  centerCoords: {
    marginTop: 4,
    color: "#64748b",
  },
  list: {
    paddingTop: 12,
    paddingBottom: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#d5e4ea",
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 12,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e293b",
  },
  rowMeta: {
    marginTop: 2,
    color: "#475569",
  },
  rowAddress: {
    marginTop: 2,
    color: "#334155",
  },
  rowCoords: {
    marginTop: 2,
    fontSize: 12,
    color: "#64748b",
  },
});
