import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import GlassCard from "./GlassCard";
import { colors, spacing, typography, borderRadius } from "../theme/colors";

/**
 * AIInsightsDashboard - Comprehensive AI analysis and recommendations
 */
export default function AIInsightsDashboard({ stats, potholes }) {
  const fadeIn = useSharedValue(0);

  useEffect(() => {
    fadeIn.value = withSpring(1);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value,
  }));

  const criticalCount = stats?.severityCounts?.[3] || 0;
  const mediumCount = stats?.severityCounts?.[2] || 0;
  const lowCount = stats?.severityCounts?.[1] || 0;

  // Calculate road health score
  const calculateHealthScore = () => {
    if (potholes.length === 0) return 100;
    const avgSeverity = potholes.reduce((sum, p) => sum + p.severity, 0) / potholes.length;
    return Math.max(0, 100 - avgSeverity * 20);
  };

  const healthScore = calculateHealthScore();

  // Generate insights
  const getInsights = () => {
    const insights = [];

    if (criticalCount > 0) {
      insights.push({
        icon: "🚨",
        title: "Critical Alert",
        message: `${criticalCount} critical potholes require immediate attention`,
        severity: "critical",
      });
    }

    if (healthScore < 60) {
      insights.push({
        icon: "⚠️",
        title: "Road Health Warning",
        message: "Road infrastructure health below optimal threshold",
        severity: "warning",
      });
    } else if (healthScore >= 85) {
      insights.push({
        icon: "✅",
        title: "Excellent Condition",
        message: "Road is in excellent condition",
        severity: "success",
      });
    }

    if (mediumCount > lowCount) {
      insights.push({
        icon: "🔧",
        title: "Maintenance Recommended",
        message: "Schedule preventive maintenance to address medium-level issues",
        severity: "warning",
      });
    }

    if (potholes.length > 5) {
      insights.push({
        icon: "📊",
        title: "High Pothole Density",
        message: `${potholes.length} issues detected in monitored area`,
        severity: "warning",
      });
    }

    return insights;
  };

  const insights = getInsights();

  const getMostCriticalArea = () => {
    if (potholes.length === 0) return null;
    const critical = potholes.filter((p) => p.severity === 3);
    return critical.length > 0 ? critical[0] : null;
  };

  const mostCritical = getMostCriticalArea();

  return (
    <Animated.View style={animatedStyle}>
      <View style={styles.container}>
        {/* Health Score Card */}
        <GlassCard hasGradient={true} padding={spacing.lg}>
          <View style={styles.healthHeader}>
            <Text style={[styles.healthLabel, typography.body_lg]}>
              Road Health Index
            </Text>
            <Text style={[styles.healthScore, typography.h2]}>
              {healthScore.toFixed(0)}%
            </Text>
          </View>

          <View style={styles.healthBar}>
            <View
              style={[
                styles.healthBarFill,
                {
                  width: `${healthScore}%`,
                  backgroundColor:
                    healthScore >= 80
                      ? colors.low
                      : healthScore >= 60
                      ? colors.medium
                      : colors.critical,
                },
              ]}
            />
          </View>

          <Text style={[styles.healthStatus, typography.body_sm]}>
            {healthScore >= 80
              ? "✓ Road is in excellent condition"
              : healthScore >= 60
              ? "⚠ Road needs maintenance"
              : "🚨 Urgent repairs needed"}
          </Text>
        </GlassCard>

        {/* Alerts */}
        {insights.length > 0 && (
          <View style={styles.alertsSection}>
            <Text style={[styles.sectionTitle, typography.body_lg]}>
              📋 System Alerts
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.alertsScroll}
            >
              {insights.map((insight, index) => (
                <GlassCard
                  key={index}
                  hasGradient={true}
                  padding={spacing.md}
                  style={[
                    styles.alertCard,
                    {
                      borderLeftWidth: 3,
                      borderLeftColor:
                        insight.severity === "critical"
                          ? colors.critical
                          : insight.severity === "warning"
                          ? colors.medium
                          : colors.low,
                    },
                  ]}
                >
                  <Text style={styles.alertIcon}>{insight.icon}</Text>
                  <Text style={[styles.alertTitle, typography.body_sm]}>
                    {insight.title}
                  </Text>
                  <Text style={[styles.alertMessage, typography.caption]}>
                    {insight.message}
                  </Text>
                </GlassCard>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Most Critical Issue */}
        {mostCritical && (
          <GlassCard hasGradient={true} padding={spacing.lg}>
            <View style={styles.criticalHeader}>
              <Text style={styles.criticalIcon}>🎯</Text>
              <View style={styles.criticalInfo}>
                <Text style={[styles.criticalTitle, typography.body_lg]}>
                  Priority Issue
                </Text>
                <Text style={[styles.criticalLocation, typography.body_sm]}>
                  Pothole #{mostCritical.id}
                </Text>
              </View>
            </View>

            <View style={styles.criticalDetails}>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, typography.caption]}>
                  Location
                </Text>
                <Text style={[styles.detailValue, typography.body_sm]}>
                  {mostCritical.address?.street || "Unknown"}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, typography.caption]}>
                  Confirmations
                </Text>
                <Text style={[styles.detailValue, typography.body_sm]}>
                  {mostCritical.count || 0} verified
                </Text>
              </View>
            </View>

            <Text style={[styles.recommendation, typography.body_sm]}>
              ➤ Recommend immediate inspection and repair
            </Text>
          </GlassCard>
        )}

        {/* Statistics Summary */}
        <GlassCard hasGradient={true} padding={spacing.lg}>
          <Text style={[styles.statsTitle, typography.body_lg]}>
            📊 Area Overview
          </Text>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>🔴</Text>
              <Text style={[styles.statNumber, typography.h4]}>
                {criticalCount}
              </Text>
              <Text style={[styles.statLabel, typography.caption]}>
                Critical
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statIcon}>🟡</Text>
              <Text style={[styles.statNumber, typography.h4]}>
                {mediumCount}
              </Text>
              <Text style={[styles.statLabel, typography.caption]}>
                Medium
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statIcon}>🟢</Text>
              <Text style={[styles.statNumber, typography.h4]}>
                {lowCount}
              </Text>
              <Text style={[styles.statLabel, typography.caption]}>
                Low
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statIcon}>👥</Text>
              <Text style={[styles.statNumber, typography.h4]}>
                {stats?.totalConfirmations || 0}
              </Text>
              <Text style={[styles.statLabel, typography.caption]}>
                Confirmed
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* Recommendations */}
        <GlassCard hasGradient={true} padding={spacing.lg}>
          <Text style={[styles.recsTitle, typography.body_lg]}>
            💡 AI Recommendations
          </Text>

          <View style={styles.recsList}>
            <View style={styles.recItem}>
              <Text style={styles.recBullet}>•</Text>
              <Text style={[styles.recText, typography.body_sm]}>
                Deploy maintenance crew to critical zones first
              </Text>
            </View>

            <View style={styles.recItem}>
              <Text style={styles.recBullet}>•</Text>
              <Text style={[styles.recText, typography.body_sm]}>
                Schedule routine inspections every 7 days
              </Text>
            </View>

            <View style={styles.recItem}>
              <Text style={styles.recBullet}>•</Text>
              <Text style={[styles.recText, typography.body_sm]}>
                Focus on medium-level repairs to prevent escalation
              </Text>
            </View>

            <View style={styles.recItem}>
              <Text style={styles.recBullet}>•</Text>
              <Text style={[styles.recText, typography.body_sm]}>
                Encourage community reporting for faster detection
              </Text>
            </View>
          </View>
        </GlassCard>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  healthHeader: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  healthLabel: {
    color: colors.text_secondary,
    fontWeight: "600",
  },
  healthScore: {
    color: colors.primary,
    fontWeight: "700",
  },
  healthBar: {
    height: 8,
    backgroundColor: colors.glass_dark,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: spacing.md,
  },
  healthBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  healthStatus: {
    color: colors.text_secondary,
    fontWeight: "500",
  },
  alertsSection: {
    gap: spacing.md,
  },
  sectionTitle: {
    color: colors.text_primary,
    fontWeight: "600",
  },
  alertsScroll: {
    marginHorizontal: -spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  alertCard: {
    minWidth: 200,
    marginRight: spacing.md,
  },
  alertIcon: {
    fontSize: 24,
    marginBottom: spacing.sm,
  },
  alertTitle: {
    color: colors.text_primary,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  alertMessage: {
    color: colors.text_secondary,
    lineHeight: 16,
  },
  criticalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  criticalIcon: {
    fontSize: 28,
  },
  criticalInfo: {
    flex: 1,
  },
  criticalTitle: {
    color: colors.critical,
    fontWeight: "700",
  },
  criticalLocation: {
    color: colors.text_secondary,
    marginTop: spacing.xs,
  },
  criticalDetails: {
    backgroundColor: colors.glass_dark,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    color: colors.text_muted,
  },
  detailValue: {
    color: colors.text_primary,
    fontWeight: "500",
  },
  recommendation: {
    color: colors.primary,
    fontWeight: "600",
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border_light,
  },
  statsTitle: {
    color: colors.text_primary,
    fontWeight: "600",
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  statItem: {
    alignItems: "center",
    gap: spacing.xs,
    flex: 0.45,
  },
  statIcon: {
    fontSize: 24,
  },
  statNumber: {
    color: colors.text_primary,
    fontWeight: "700",
  },
  statLabel: {
    color: colors.text_tertiary,
  },
  recsTitle: {
    color: colors.text_primary,
    fontWeight: "600",
    marginBottom: spacing.md,
  },
  recsList: {
    gap: spacing.md,
  },
  recItem: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "flex-start",
  },
  recBullet: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "700",
    marginTop: -2,
  },
  recText: {
    color: colors.text_secondary,
    flex: 1,
    lineHeight: 20,
  },
});
