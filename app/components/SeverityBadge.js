import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, borderRadius, spacing, typography } from "../theme/colors";

/**
 * SeverityBadge - Shows pothole severity with color coding and glow
 */
export default function SeverityBadge({
  severity,
  size = "md",
  showLabel = true,
  animated = false,
}) {
  const getSeverityData = (level) => {
    switch (level) {
      case 1:
        return {
          label: "Low",
          color: colors.low,
          lightColor: colors.low_light,
          bgColor: "rgba(74, 222, 128, 0.15)",
        };
      case 2:
        return {
          label: "Medium",
          color: colors.medium,
          lightColor: colors.medium_light,
          bgColor: "rgba(255, 215, 0, 0.15)",
        };
      case 3:
        return {
          label: "Critical",
          color: colors.critical,
          lightColor: colors.critical_light,
          bgColor: "rgba(255, 59, 92, 0.15)",
        };
      default:
        return {
          label: "Unknown",
          color: colors.text_tertiary,
          lightColor: colors.text_muted,
          bgColor: colors.glass_medium,
        };
    }
  };

  const data = getSeverityData(severity);

  const sizeStyles = {
    xs: {
      width: 20,
      height: 20,
      dotSize: 8,
      fontSize: 10,
    },
    sm: {
      width: 28,
      height: 28,
      dotSize: 10,
      fontSize: 11,
    },
    md: {
      width: 36,
      height: 36,
      dotSize: 12,
      fontSize: 12,
    },
    lg: {
      width: 48,
      height: 48,
      dotSize: 16,
      fontSize: 13,
    },
  };

  const sizeData = sizeStyles[size];

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.badge,
          {
            width: sizeData.width,
            height: sizeData.height,
            backgroundColor: data.bgColor,
            borderColor: data.color,
          },
        ]}
      >
        <LinearGradient
          colors={[data.color, data.lightColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.dot,
            {
              width: sizeData.dotSize,
              height: sizeData.dotSize,
              borderRadius: sizeData.dotSize / 2,
            },
          ]}
        />
      </View>
      {showLabel && (
        <Text
          style={[
            styles.label,
            {
              fontSize: sizeData.fontSize,
              color: data.color,
            },
          ]}
        >
          {data.label}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    borderRadius: 9999,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    elevation: 4,
  },
  label: {
    marginTop: spacing.xs,
    fontWeight: "600",
    textAlign: "center",
  },
});
