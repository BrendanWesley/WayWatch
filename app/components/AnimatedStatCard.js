import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import GlassCard from "./GlassCard";
import { colors, typography, spacing } from "../theme/colors";

/**
 * AnimatedStatCard - Animated metric card with spring animation
 */
export default function AnimatedStatCard({
  label,
  value,
  icon,
  color = colors.primary,
  trend,
  unit = "",
  animated = true,
}) {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      scale.value = withSpring(1, { damping: 8, mass: 1, stiffness: 100 });
      opacity.value = withSpring(1);
    } else {
      scale.value = 1;
      opacity.value = 1;
    }
  }, [value]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animatedStyle}>
      <GlassCard padding={spacing.md}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={[styles.label, { color: colors.text_tertiary }]}>
              {label}
            </Text>
            {icon && (
              <Text style={[styles.icon, { color }]}>
                {icon}
              </Text>
            )}
          </View>

          <View style={styles.content}>
            <Text
              style={[
                styles.value,
                { color },
                typography.h2,
              ]}
            >
              {value}
            </Text>
            {unit && (
              <Text
                style={[
                  styles.unit,
                  { color: colors.text_tertiary },
                  typography.body_sm,
                ]}
              >
                {unit}
              </Text>
            )}
          </View>

          {trend && (
            <View style={styles.trendContainer}>
              <Text
                style={[
                  styles.trend,
                  {
                    color: trend.isPositive
                      ? colors.low
                      : colors.critical,
                  },
                ]}
              >
                {trend.isPositive ? "↑" : "↓"} {trend.value}%
              </Text>
            </View>
          )}
        </View>
      </GlassCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: spacing.xs,
  },
  value: {
    fontWeight: "700",
  },
  unit: {
    fontWeight: "400",
  },
  trendContainer: {
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border_light,
  },
  trend: {
    fontSize: 12,
    fontWeight: "600",
  },
});
