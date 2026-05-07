import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { colors, typography } from "../theme/colors";

/**
 * LoadingScreen - Elegant loading animation
 */
export default function LoadingScreen() {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.1, { duration: 2000 }),
      -1,
      true
    );
    opacity.value = withRepeat(
      withTiming(1, { duration: 2000 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <LinearGradient
      colors={[colors.bg_primary, colors.bg_secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Animated.View style={animatedStyle}>
        <Text style={styles.logo}>🛣️</Text>
      </Animated.View>

      <Text style={[styles.title, typography.h3]}>WAY WATCH</Text>
      <Text style={[styles.subtitle, typography.body_md]}>
        Smart City Dashboard
      </Text>

      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>

      <Text style={[styles.loadingText, typography.body_sm]}>
        Initializing system...
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    color: colors.text_primary,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 8,
  },
  subtitle: {
    color: colors.text_tertiary,
    marginBottom: 40,
  },
  loaderContainer: {
    marginVertical: 30,
  },
  loadingText: {
    color: colors.text_secondary,
    marginTop: 20,
    letterSpacing: 0.5,
  },
});