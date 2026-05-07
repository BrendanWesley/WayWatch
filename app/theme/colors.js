/**
 * Modern Dark Theme - WAY WATCH Smart City Dashboard
 * Premium glassmorphism + neon cyan aesthetic
 */

export const colors = {
  // Primary colors
  primary: "#00D9FF", // Neon cyan
  primaryLight: "#33E5FF",
  primaryDark: "#00B8D4",

  // Secondary colors
  secondary: "#7C3AED", // Vibrant purple
  accent: "#A78BFA", // Lighter purple

  // Severity colors
  critical: "#FF3B5C", // Bright red/pink
  critical_light: "#FF6B7F",
  medium: "#FFD700", // Gold/yellow
  medium_light: "#FFF44F",
  low: "#4ADE80", // Bright green
  low_light: "#86EFAC",

  // Backgrounds
  bg_primary: "#0F172A", // Deep dark blue
  bg_secondary: "#1E293B", // Slightly lighter
  bg_tertiary: "#334155", // Even lighter
  bg_surface: "rgba(30, 41, 59, 0.7)", // Semi-transparent
  bg_overlay: "rgba(15, 23, 42, 0.8)",

  // Glass effect backgrounds
  glass_light: "rgba(255, 255, 255, 0.05)",
  glass_medium: "rgba(255, 255, 255, 0.08)",
  glass_dark: "rgba(255, 255, 255, 0.03)",

  // Text colors
  text_primary: "#F1F5F9", // Off-white
  text_secondary: "#CBD5E1", // Light gray
  text_tertiary: "#94A3B8", // Medium gray
  text_muted: "#64748B", // Muted gray
  text_dark: "#475569", // Darker gray

  // Status colors
  success: "#4ADE80",
  warning: "#FFD700",
  error: "#FF3B5C",
  info: "#00D9FF",

  // Borders
  border_light: "rgba(255, 255, 255, 0.1)",
  border_medium: "rgba(255, 255, 255, 0.15)",
  border_dark: "rgba(255, 255, 255, 0.2)",

  // Gradients
  gradient_primary: {
    start: "#00D9FF",
    end: "#7C3AED",
  },
  gradient_dark: {
    start: "#1E293B",
    end: "#334155",
  },
  gradient_danger: {
    start: "#FF3B5C",
    end: "#FF6B7F",
  },

  // Transparency
  transparent: "transparent",
};

export const shadows = {
  xs: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 1,
  },
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    elevation: 3,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    elevation: 5,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    elevation: 8,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.3,
    elevation: 12,
  },
  glow_cyan: {
    shadowColor: "#00D9FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    elevation: 10,
  },
  glow_danger: {
    shadowColor: "#FF3B5C",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    elevation: 8,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 28,
  },
  h5: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 24,
  },
  body_lg: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
  body_md: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },
  body_sm: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
  },
  caption: {
    fontSize: 10,
    fontWeight: "400",
    lineHeight: 14,
  },
  button: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
};
