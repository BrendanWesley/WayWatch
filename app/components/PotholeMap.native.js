import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import { colors } from "../theme/colors";

export default function PotholeMap({
  initialRegion,
  potholes,
  severityColors,
  severityLabels,
  onPotholePress,
}) {
  return (
    <MapView
      style={styles.map}
      initialRegion={initialRegion}
      showsUserLocation={true}
      showsMyLocationButton={true}
      customMapStyle={mapStyle}
    >
      {potholes.map((pothole) => (
        <PotholeMarker
          key={pothole.id}
          pothole={pothole}
          severityColors={severityColors}
          severityLabels={severityLabels}
          onPotholePress={onPotholePress}
        />
      ))}
    </MapView>
  );
}

function PotholeMarker({
  pothole,
  severityColors,
  severityLabels,
  onPotholePress,
}) {
  const address = pothole.address || {};
  const markerColor = severityColors[pothole.severity];

  return (
    <Marker
      coordinate={{
        latitude: pothole.location.lat,
        longitude: pothole.location.lng,
      }}
      title={`Pothole #${pothole.id}`}
      description={`${severityLabels[pothole.severity] || ""}`}
      pinColor={markerColor}
      onPress={() => onPotholePress(pothole)}
    >
      <Callout>
        <View style={styles.callout}>
          <Text style={styles.calloutTitle}>Pothole #{pothole.id}</Text>
          <Text style={[styles.calloutText, { color: markerColor }]}>
            {severityLabels[pothole.severity]}
          </Text>
          <Text style={styles.calloutText}>
            {address.street || "Unknown street"}
          </Text>
          <Text style={styles.calloutText}>
            {address.area || "Unknown area"}
          </Text>
          <Text style={styles.calloutText}>
            Detections: {pothole.detectionCount || 1} • Confirmations:{" "}
            {pothole.count || 0}
          </Text>
        </View>
      </Callout>
    </Marker>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  callout: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.bg_secondary,
    borderWidth: 1,
    borderColor: colors.border_medium,
    minWidth: 200,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text_primary,
    marginBottom: 6,
  },
  calloutText: {
    fontSize: 12,
    color: colors.text_secondary,
    marginBottom: 3,
  },
});

// Dark mode map style
const mapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#1a1a1a" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#8a8a8a" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#1a1a1a" }],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d3d3d3" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d3d3d3" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry.fill",
    stylers: [{ color: "#1b4d3e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [{ color: "#2c2c2c" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212121" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#373737" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#3c3c3c" }],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [{ color: "#4e4e4e" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3f47" }],
  },
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [{ color: "#0d47a1" }],
  },
];
    color: "#555",
    marginBottom: 2,
  },
});
