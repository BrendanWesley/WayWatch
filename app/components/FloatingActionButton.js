import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, shadows, spacing } from "../theme/colors";

/**
 * FloatingActionButton - Modern FAB with gradient and glow
 */
export default function FloatingActionButton({
  onPress,
  icon,
  size = "md",
  variant = "primary",
  position = "bottom-right",
  margin = spacing.lg,
  ...props
}) {
  const sizeStyles = {
    sm: { width: 44, height: 44, fontSize: 20 },
    md: { width: 56, height: 56, fontSize: 24 },
    lg: { width: 68, height: 68, fontSize: 28 },
  };

  const variantStyles = {
    primary: {
      colors: [colors.primary, colors.primaryDark],
      shadow: "glow_cyan",
    },
    danger: {
      colors: [colors.critical, colors.critical_light],
      shadow: "glow_danger",
    },
    secondary: {
      colors: [colors.secondary, colors.accent],
      shadow: "lg",
    },
  };

  const positionStyles = {
    "bottom-right": { bottom: margin, right: margin },
    "bottom-left": { bottom: margin, left: margin },
    "top-right": { top: margin, right: margin },
    "top-left": { top: margin, left: margin },
  };

  const sizeData = sizeStyles[size];
  const variantData = variantStyles[variant];

  return (
    <TouchableOpacity
      style={[
        styles.fab,
        {
          width: sizeData.width,
          height: sizeData.height,
          borderRadius: sizeData.width / 2,
          ...positionStyles[position],
          ...shadows[variantData.shadow],
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      {...props}
    >
      <LinearGradient
        colors={variantData.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {typeof icon === "string" ? (
          icon
        ) : (
          icon
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
});
