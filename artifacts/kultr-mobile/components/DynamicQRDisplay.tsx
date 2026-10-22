import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

import { generateQRMatrix } from "@/components/QRDisplay";
import { generateDynamicTicketPayload } from "@/lib/totp";

interface Props {
  ticketNumber: string;
  size?: number;
  showWatermark?: boolean;
}

export function DynamicQRDisplay({
  ticketNumber,
  size = 210,
  showWatermark = true,
}: Props) {
  const [dynamicState, setDynamicState] = useState(() =>
    generateDynamicTicketPayload(ticketNumber)
  );

  // Periodic 1-second interval to update the countdown ring
  useEffect(() => {
    const timer = setInterval(() => {
      setDynamicState(generateDynamicTicketPayload(ticketNumber));
    }, 1000);

    return () => clearInterval(timer);
  }, [ticketNumber]);

  // Sweeping laser animation
  const laserAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(laserAnim, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(laserAnim, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [laserAnim]);

  // Compute QR matrix for dynamic payload
  const matrix = useMemo(() => {
    try {
      return generateQRMatrix(dynamicState.payload);
    } catch {
      return generateQRMatrix(ticketNumber);
    }
  }, [dynamicState.payload, ticketNumber]);

  const moduleCount = matrix.length;
  const cellSize = size / moduleCount;

  // Build SVG path data for dark modules
  const svgPath = useMemo(() => {
    let d = "";
    matrix.forEach((row, ri) => {
      row.forEach((cell, ci) => {
        if (cell === 1) {
          d += `M${ci * cellSize},${ri * cellSize}h${cellSize}v${cellSize}h-${cellSize}z `;
        }
      });
    });
    return d;
  }, [matrix, cellSize]);

  const handleManualRefresh = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDynamicState(generateDynamicTicketPayload(ticketNumber));
  };

  const laserTranslateY = laserAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, size - 4],
  });

  // Circular progress calculations (Radius = 14, Circumference = 2 * PI * 14 = 87.96)
  const radius = 13;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - dynamicState.progressFraction);

  const countdownColor =
    dynamicState.secondsRemaining <= 5
      ? "#EF4444"
      : dynamicState.secondsRemaining <= 12
      ? "#FFA726"
      : "#10B981";

  return (
    <View style={styles.container}>
      {/* ── Security Shield Pill ── */}
      <View style={styles.badgeRow}>
        <View style={styles.shieldBadge}>
          <Feather name="shield" size={11} color="#10B981" />
          <Text style={styles.shieldBadgeText}>LIVE TIME-ROLLING QR</Text>
        </View>
        <View style={styles.antiScreenshotPill}>
          <Text style={styles.antiScreenshotText}>ANTI-SCREENSHOT</Text>
        </View>
      </View>

      {/* ── QR Matrix Canvas with Sweeping Laser ── */}
      <View style={[styles.canvasWrapper, { width: size + 32, height: size + 32 }]}>
        <View style={[styles.qrCanvas, { width: size, height: size }]}>
          <Svg width={size} height={size}>
            <Path d={svgPath} fill="#000000" />
          </Svg>

          {/* Sweeping holographic laser line */}
          {showWatermark && (
            <Animated.View
              pointerEvents="none"
              style={[
                styles.laserLine,
                {
                  width: size,
                  transform: [{ translateY: laserTranslateY }],
                },
              ]}
            >
              <View style={styles.laserCore} />
              <View style={styles.laserGlow} />
            </Animated.View>
          )}
        </View>
      </View>

      {/* ── Dynamic Progress & Countdown Ring ── */}
      <View style={styles.footerRow}>
        <View style={styles.ringWrapper}>
          <Svg width={34} height={34} viewBox="0 0 34 34">
            {/* Background ring */}
            <Circle
              cx={17}
              cy={17}
              r={radius}
              stroke="#2A2A2A"
              strokeWidth={3}
              fill="none"
            />
            {/* Active countdown arc */}
            <Circle
              cx={17}
              cy={17}
              r={radius}
              stroke={countdownColor}
              strokeWidth={3}
              fill="none"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 17 17)"
            />
          </Svg>
          <View style={styles.ringCenterText}>
            <Text style={[styles.ringSeconds, { color: countdownColor }]}>
              {dynamicState.secondsRemaining}
            </Text>
          </View>
        </View>

        <View style={styles.footerInfo}>
          <Text style={styles.refreshText}>
            Refreshes in{" "}
            <Text style={{ color: countdownColor, fontWeight: "800" }}>
              {dynamicState.secondsRemaining}s
            </Text>
          </Text>
          <Text style={styles.hashNote}>
            HMAC token: <Text style={styles.hashText}>{dynamicState.hash}</Text>
          </Text>
        </View>

        <Pressable
          onPress={handleManualRefresh}
          style={styles.refreshBtn}
          accessibilityLabel="Refresh security QR code"
          accessibilityRole="button"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="refresh-cw" size={13} color="#FF6B00" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 4,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  shieldBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(16,185,129,0.12)",
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.25)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  shieldBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#10B981",
    letterSpacing: 0.6,
  },
  antiScreenshotPill: {
    backgroundColor: "rgba(255,107,0,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,107,0,0.2)",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  antiScreenshotText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#FF6B00",
    letterSpacing: 0.5,
  },
  canvasWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF6B00",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 8,
  },
  qrCanvas: {
    position: "relative",
    overflow: "hidden",
  },
  laserLine: {
    position: "absolute",
    left: 0,
    height: 4,
  },
  laserCore: {
    height: 2,
    backgroundColor: "#FF6B00",
  },
  laserGlow: {
    height: 4,
    backgroundColor: "rgba(255,107,0,0.35)",
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    backgroundColor: "#161616",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#282828",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 10,
  },
  ringWrapper: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  ringCenterText: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  ringSeconds: {
    fontSize: 11,
    fontWeight: "900",
  },
  footerInfo: {
    flex: 1,
  },
  refreshText: {
    fontSize: 12,
    color: "#E0E0E0",
    fontWeight: "600",
  },
  hashNote: {
    fontSize: 10,
    color: "#888888",
    marginTop: 1,
  },
  hashText: {
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    color: "#FFA726",
    fontWeight: "700",
  },
  refreshBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#222222",
    alignItems: "center",
    justifyContent: "center",
  },
});
