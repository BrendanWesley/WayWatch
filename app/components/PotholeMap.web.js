import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import GlassCard from "./GlassCard";
import SeverityBadge from "./SeverityBadge";
import { colors, spacing, typography, borderRadius } from "../theme/colors";

export default function PotholeMap({
  initialRegion,
  potholes,
  severityColors,
  severityLabels,
  onPotholePress,
}) {
  return (
    <View style={styles.container}>
      <GlassCard style={styles.headerCard} hasGradient={true}>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, typography.body_lg]}>
            📍 Current Location
          </Text>
          <Text style={[styles.headerCoords, typography.caption]}>
            {initialRegion.latitude.toFixed(4)}, {initialRegion.longitude.toFixed(4)}
          </Text>
        </View>
      </GlassCard>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {potholes.length === 0 ? (
          <View style={styles.emptyMessage}>
            <Text style={[styles.emptyText, typography.body_md]}>
              🗺️ No potholes detected in map view
            </Text>
          </View>
        ) : (
          potholes.map((pothole) => (
            <PotholeRow
              key={pothole.id}
              pothole={pothole}
              severityColors={severityColors}
              severityLabels={severityLabels}
              onPotholePress={onPotholePress}
            />
          ))
        )}
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
      activeOpacity={0.7}
    >
      <GlassCard hasGradient={true} padding={spacing.md} style={{ flex: 1 }}>
        <View style={styles.rowContent}>
          <View style={styles.rowMain}>
            <View style={styles.rowHeader}>
              <Text style={[styles.rowTitle, typography.body_lg]}>
                Pothole #{pothole.id}
              </Text>
              <SeverityBadge
                severity={pothole.severity}
                size="sm"
                showLabel={false}
              />
            </View>

            <Text style={[styles.rowMeta, typography.body_sm]}>
              {severityLabels[pothole.severity]} · {pothole.detectionCount || 1} detections
            </Text>

            <View style={styles.locationSection}>
              <Text style={[styles.locationLabel, typography.caption]}>
                📍 {address.street || "Unknown street"}
              </Text>
              <Text style={[styles.areaLabel, typography.caption]}>
                {address.area || "Unknown area"}
              </Text>
            </View>

            <View style={styles.statsSection}>
              <View style={styles.statBadge}>
                <Text style={styles.statBadgeText}>
                  {pothole.count || 0} confirmed
                </Text>
              </View>
              <View style={[styles.statBadge, { backgroundColor: colors.glass_dark }]}>
                <Text style={[styles.statBadgeText, { color: colors.primary }]}>
                  {pothole.location.lat.toFixed(4)}, {pothole.location.lng.toFixed(4)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.arrow}>
            <Text style={styles.arrowText}>→</Text>
          </View>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg_primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  headerCard: {
    marginBottom: spacing.lg,
  },
  headerContent: {
    gap: spacing.xs,
  },
  headerTitle: {
    color: colors.text_primary,
    fontWeight: "600",
  },
  headerCoords: {
    color: colors.primary,
    fontFamily: "monospace",
  },
  list: {
    paddingBottom: spacing.xxl,
  },
  row: {
    marginBottom: spacing.md,
  },
  rowContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
  },
  rowMain: {
    flex: 1,
    gap: spacing.md,
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowTitle: {
    color: colors.text_primary,
    fontWeight: "700",
  },
  rowMeta: {
    color: colors.text_tertiary,
  },
  locationSection: {
    gap: spacing.xs,
  },
  locationLabel: {
    color: colors.text_secondary,
  },
  areaLabel: {
    color: colors.text_muted,
  },
  statsSection: {
    flexDirection: "row",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  statBadge: {
    backgroundColor: colors.glass_medium,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border_light,
  },
  statBadgeText: {
    color: colors.text_secondary,
    fontSize: 11,
    fontWeight: "500",
  },
  arrow: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.5,
  },
  arrowText: {
    color: colors.text_tertiary,
    fontSize: 18,
    fontWeight: "600",
  },
  emptyMessage: {
    paddingVertical: spacing.xxl,
    alignItems: "center",
  },
  emptyText: {
    color: colors.text_tertiary,
  },
});
