import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";

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

  return (
    <Marker
      coordinate={{
        latitude: pothole.location.lat,
        longitude: pothole.location.lng,
      }}
      title={`Pothole #${pothole.id}`}
      description={`${address.street || "Unknown street"}, ${
        address.area || "Unknown area"
      }`}
      pinColor={severityColors[pothole.severity]}
      onPress={() => onPotholePress(pothole)}
    >
      <Callout>
        <View style={styles.callout}>
          <Text style={styles.calloutTitle}>Pothole #{pothole.id}</Text>
          <Text style={styles.calloutText}>
            Severity: {severityLabels[pothole.severity]}
          </Text>
          <Text style={styles.calloutText}>
            Confirmations: {pothole.count}
          </Text>
          <Text style={styles.calloutText}>
            Street: {address.street || "Unknown street"}
          </Text>
          <Text style={styles.calloutText}>
            Area: {address.area || "Unknown area"}
          </Text>
          <Text style={styles.calloutText}>
            Pincode: {address.pincode || "Unknown pincode"}
          </Text>
          <Text style={styles.calloutText} numberOfLines={1}>
            Lat: {pothole.location.lat.toFixed(4)}
            {"\n"}
            Lng: {pothole.location.lng.toFixed(4)}
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
    padding: 10,
    borderRadius: 8,
    backgroundColor: "white",
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  calloutText: {
    fontSize: 12,
    color: "#555",
    marginBottom: 2,
  },
});
