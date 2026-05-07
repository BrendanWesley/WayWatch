import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import GlassCard from "./GlassCard";
import SeverityBadge from "./SeverityBadge";
import { colors, spacing, typography, shadows, borderRadius } from "../theme/colors";

/**
 * PotholeBottomSheet - Modern bottom sheet modal for pothole details
 */
export default function PotholeBottomSheet({
  visible,
  pothole,
  onClose,
  onConfirm,
  severityLabels = {},
}) {
  const slideAnim = useRef(new Animated.Value(1000)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: false,
        speed: 12,
        bounciness: 8,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 1000,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [visible]);

  if (!pothole) return null;

  const address = pothole.address || {};

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={styles.overlay}
      >
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.content}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <View style={styles.handleBar}>
              <View style={styles.handle} />
            </View>

            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={[styles.title, typography.h3]}>
                  Pothole #{pothole.id}
                </Text>
                <Text style={[styles.location, typography.body_sm]}>
                  {address.street || "Unknown street"}
                </Text>
              </View>
              <SeverityBadge
                severity={pothole.severity}
                size="lg"
                showLabel={true}
              />
            </View>

            {/* Details Grid */}
            <View style={styles.detailsGrid}>
              <GlassCard padding={spacing.md}>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, typography.body_sm]}>
                    Severity
                  </Text>
                  <Text
                    style={[
                      styles.detailValue,
                      typography.body_lg,
                      { fontWeight: "600" },
                    ]}
                  >
                    {severityLabels[pothole.severity] || `Level ${pothole.severity}`}
                  </Text>
                </View>
              </GlassCard>

              <GlassCard padding={spacing.md}>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, typography.body_sm]}>
                    Detections
                  </Text>
                  <Text
                    style={[
                      styles.detailValue,
                      typography.body_lg,
                      { fontWeight: "600", color: colors.primary },
                    ]}
                  >
                    {pothole.detectionCount || 1}
                  </Text>
                </View>
              </GlassCard>

              <GlassCard padding={spacing.md}>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, typography.body_sm]}>
                    Confirmations
                  </Text>
                  <Text
                    style={[
                      styles.detailValue,
                      typography.body_lg,
                      { fontWeight: "600", color: colors.low },
                    ]}
                  >
                    {pothole.count || 0}
                  </Text>
                </View>
              </GlassCard>

              <GlassCard padding={spacing.md}>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, typography.body_sm]}>
                    Area
                  </Text>
                  <Text
                    style={[
                      styles.detailValue,
                      typography.body_sm,
                    ]}
                  >
                    {address.area || "Unknown"}
                  </Text>
                </View>
              </GlassCard>
            </View>

            {/* Coordinates */}
            <View style={{ paddingHorizontal: spacing.lg }}>
              <GlassCard padding={spacing.md}>
                <Text style={[styles.coordLabel, typography.body_sm]}>
                  📍 Location Coordinates
                </Text>
                <Text
                  style={[
                    styles.coordValue,
                    typography.caption,
                    { marginTop: spacing.sm, color: colors.primary },
                  ]}
                >
                  Lat: {pothole.location.lat.toFixed(6)}
                </Text>
                <Text
                  style={[
                    styles.coordValue,
                    typography.caption,
                    { marginTop: 2, color: colors.primary },
                  ]}
                >
                  Lng: {pothole.location.lng.toFixed(6)}
                </Text>
              </GlassCard>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={styles.buttonNegative}
                onPress={() => {
                  onConfirm(pothole.id, false);
                  onClose();
                }}
              >
                <LinearGradient
                  colors={[colors.critical, colors.critical_light]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>✓ Resolved</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonPositive}
                onPress={() => {
                  onConfirm(pothole.id, true);
                  onClose();
                }}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>⚠ Still Exists</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Close hint */}
            <Text style={[styles.closeHint, typography.caption]}>
              Swipe down or tap outside to close
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.bg_overlay,
    justifyContent: "flex-end",
  },
  container: {
    width: "100%",
  },
  content: {
    backgroundColor: colors.bg_primary,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    paddingBottom: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border_medium,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    elevation: 20,
  },
  handleBar: {
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border_medium,
    borderRadius: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border_light,
    gap: spacing.md,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    color: colors.text_primary,
    fontWeight: "700",
  },
  location: {
    color: colors.text_secondary,
    marginTop: spacing.xs,
  },
  detailsGrid: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    color: colors.text_tertiary,
    fontWeight: "500",
  },
  detailValue: {
    color: colors.text_primary,
  },
  coordLabel: {
    color: colors.text_secondary,
    fontWeight: "500",
  },
  coordValue: {
    color: colors.primary,
    fontFamily: "monospace",
  },
  actionContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.md,
    flexDirection: "row",
  },
  buttonNegative: {
    flex: 1,
    overflow: "hidden",
    borderRadius: borderRadius.lg,
    ...shadows.lg,
  },
  buttonPositive: {
    flex: 1,
    overflow: "hidden",
    borderRadius: borderRadius.lg,
    ...shadows.glow_cyan,
  },
  buttonGradient: {
    paddingVertical: spacing.md,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: colors.text_primary,
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 0.5,
  },
  closeHint: {
    textAlign: "center",
    color: colors.text_muted,
    marginTop: spacing.md,
  },
});
