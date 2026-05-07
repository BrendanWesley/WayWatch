import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import GlassCard from "./GlassCard";
import { colors, typography, spacing, borderRadius } from "../theme/colors";

/**
 * EmptyState - Shows when no potholes exist
 */
export default function EmptyState() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["rgba(74, 222, 128, 0.1)", "rgba(0, 217, 255, 0.1)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />

      <View style={styles.content}>
        <Text style={styles.emoji}>✓</Text>
        
        <Text style={[styles.title, typography.h2]}>
          Roads Looking Good!
        </Text>

        <Text style={[styles.description, typography.body_md]}>
          No potholes detected in your area. The road infrastructure is in
          excellent condition.
        </Text>

        <GlassCard
          hasGradient={true}
          padding={spacing.md}
          style={{ marginTop: spacing.lg }}
        >
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>🚀</Text>
              <Text style={[styles.statLabel, typography.caption]}>
                System Active
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>🔍</Text>
              <Text style={[styles.statLabel, typography.caption]}>
                Monitoring 24/7
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>⚡</Text>
              <Text style={[styles.statLabel, typography.caption]}>
                Real-Time Updates
              </Text>
            </View>
          </View>
        </GlassCard>

        <View style={styles.footer}>
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.pulse}
          />
          <Text style={[styles.footerText, typography.body_sm]}>
            Last scanned just now
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    alignItems: "center",
  },
  emoji: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.text_primary,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: spacing.md,
  },
  description: {
    color: colors.text_secondary,
    textAlign: "center",
    maxWidth: 300,
    lineHeight: 24,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  statLabel: {
    color: colors.text_tertiary,
    textAlign: "center",
  },
  footer: {
    marginTop: spacing.xxl,
    alignItems: "center",
    gap: spacing.sm,
  },
  pulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    elevation: 10,
  },
  footerText: {
    color: colors.text_muted,
  },
});
