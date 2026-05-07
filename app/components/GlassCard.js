import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, shadows, borderRadius, spacing } from "../theme/colors";

/**
 * GlassCard - Premium glassmorphic card component
 * Creates a frosted glass effect with gradient and blur
 */
export default function GlassCard({
  children,
  style,
  onPress,
  activeOpacity = 0.7,
  hasGradient = true,
  glassIntensity = "medium",
  padding = spacing.lg,
  borderColor = "border_medium",
  shadow = "md",
  borderRadius: customBorderRadius = borderRadius.lg,
  ...props
}) {
  const glassColor =
    glassIntensity === "light"
      ? colors.glass_light
      : glassIntensity === "dark"
      ? colors.glass_dark
      : colors.glass_medium;

  const borderStyle = {
    borderColor: colors[borderColor] || borderColor,
    borderWidth: 1,
  };

  const containerStyle = [
    styles.container,
    {
      backgroundColor: glassColor,
      padding,
      borderRadius: customBorderRadius,
      ...shadows[shadow],
      ...borderStyle,
    },
    style,
  ];

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={containerStyle}
      onPress={onPress}
      activeOpacity={activeOpacity}
      {...props}
    >
      {hasGradient && (
        <LinearGradient
          colors={["rgba(0, 217, 255, 0.1)", "rgba(124, 58, 237, 0.05)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
      )}
      {children}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: "none",
  },
});
