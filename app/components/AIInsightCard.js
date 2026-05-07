import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import GlassCard from "./GlassCard";
import { colors, typography, spacing, borderRadius } from "../theme/colors";

/**
 * AIInsightCard - Premium card for AI-generated insights
 */
export default function AIInsightCard({
  title,
  description,
  severity,
  icon = "🤖",
  actionText,
  onPress,
}) {
  const getSeverityGradient = () => {
    switch (severity) {
      case "critical":
        return [colors.critical, colors.critical_light];
      case "warning":
        return [colors.medium, colors.medium_light];
      case "info":
        return [colors.primary, colors.primaryLight];
      default:
        return [colors.secondary, colors.accent];
    }
  };

  return (
    <GlassCard
      onPress={onPress}
      hasGradient={true}
      shadow="md"
      padding={0}
      style={styles.card}
    >
      <LinearGradient
        colors={getSeverityGradient()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerIcon}>{icon}</Text>
        <Text style={styles.headerTitle}>AI Analysis</Text>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={[styles.title, typography.body_lg]}>
          {title}
        </Text>
        <Text style={[styles.description, typography.body_sm]}>
          {description}
        </Text>

        {actionText && (
          <View style={styles.actionContainer}>
            <Text style={styles.actionText}>{actionText}</Text>
            <Text style={styles.arrow}>→</Text>
          </View>
        )}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    gap: spacing.md,
  },
  headerIcon: {
    fontSize: 24,
  },
  headerTitle: {
    color: colors.text_primary,
    fontWeight: "600",
    fontSize: 12,
    letterSpacing: 0.5,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    color: colors.text_primary,
    fontWeight: "600",
  },
  description: {
    color: colors.text_secondary,
    lineHeight: 18,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border_light,
  },
  actionText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 12,
  },
  arrow: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "700",
  },
});
