import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";

interface RedemptionLogItem {
  id: string;
  voucherCode: string;
  units: number;
  remainingUnits: number;
  time: string;
}

export default function BartenderScannerScreen() {
  const insets = useSafeAreaInsets();
  const { authToken } = useApp();

  const [stationIdentifier, setStationIdentifier] = useState("MAIN_BAR_STATION_1");
  const [inputCode, setInputCode] = useState("");
  const [unitsToRedeem, setUnitsToRedeem] = useState(1);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [lastResult, setLastResult] = useState<{
    success: boolean;
    message: string;
    voucherCode?: string;
    remainingUnits?: number;
    totalUnits?: number;
  } | null>(null);

  const [shiftCount, setShiftCount] = useState(0);
  const [recentLogs, setRecentLogs] = useState<RedemptionLogItem[]>([]);

  const apiBase = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001";

  const handleRedeem = async (codeToUse?: string) => {
    const targetCode = (codeToUse ?? inputCode).trim().toUpperCase();
    if (!targetCode) {
      Alert.alert("Input Required", "Please enter or scan a Kultr Bar Pass code");
      return;
    }

    setIsRedeeming(true);
    setLastResult(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const idempotencyKey = `scan-${targetCode}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    try {
      const res = await fetch(`${apiBase}/api/beverages/redeem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({
          voucherCode: targetCode,
          stationIdentifier,
          units: unitsToRedeem,
          idempotencyKey,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setLastResult({
          success: false,
          message: data.message ?? "Redemption rejected by venue server",
        });
        return;
      }

      // Success
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setLastResult({
        success: true,
        message: data.alreadyRedeemed
          ? "Already processed (idempotent match)"
          : `Poured ${unitsToRedeem} can${unitsToRedeem > 1 ? "s" : ""}!`,
        voucherCode: data.voucherCode,
        remainingUnits: data.remainingUnits,
        totalUnits: data.totalUnits,
      });

      setShiftCount((prev) => prev + unitsToRedeem);
      setRecentLogs((prev) => [
        {
          id: idempotencyKey,
          voucherCode: targetCode,
          units: unitsToRedeem,
          remainingUnits: data.remainingUnits,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        },
        ...prev.slice(0, 9),
      ]);

      setInputCode("");
    } catch {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setLastResult({
        success: false,
        message: "Network error connecting to venue bar system",
      });
    } finally {
      setIsRedeeming(false);
    }
  };

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const bottomPad = Platform.OS === "web" ? Math.max(insets.bottom, 34) : insets.bottom;

  return (
    <View style={[styles.root, { backgroundColor: "#0A0A0A" }]}>
      <ScrollView
        contentContainerStyle={{ paddingTop: topPad + 12, paddingBottom: bottomPad + 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backBtn}
            accessibilityLabel="Exit Bartender Mode"
            accessibilityRole="button"
          >
            <Feather name="arrow-left" size={20} color="#FFFFFF" />
          </Pressable>
          <View style={styles.headerCenter}>
            <View style={styles.stationBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.stationText}>{stationIdentifier}</Text>
            </View>
            <Text style={styles.headerTitle}>BAR SCANNER</Text>
          </View>
          <View style={styles.shiftBadge}>
            <Text style={styles.shiftLabel}>POURED</Text>
            <Text style={styles.shiftCount}>{shiftCount}</Text>
          </View>
        </View>

        {/* Viewfinder Scanner Area */}
        <View style={styles.viewfinderCard}>
          <View style={styles.viewfinder}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />

            {/* Glowing Scanline */}
            <View style={styles.scanline} />

            <View style={styles.viewfinderContent}>
              <Feather name="maximize" size={44} color="rgba(255, 107, 0, 0.6)" />
              <Text style={styles.viewfinderHint}>Align Attendee Bar Pass QR</Text>
              <Text style={styles.viewfinderSub}>Laser auto-detects 30s dynamic tokens</Text>
            </View>
          </View>

          {/* Quick Demo Scan triggers */}
          <View style={styles.sampleScanRow}>
            <Text style={styles.sampleLabel}>Fast Demo Codes:</Text>
            <Pressable
              style={styles.samplePill}
              onPress={() => {
                setInputCode("KTR-BAR-8X29Q");
                handleRedeem("KTR-BAR-8X29Q");
              }}
            >
              <Text style={styles.samplePillText}>8X29Q</Text>
            </Pressable>
            <Pressable
              style={styles.samplePill}
              onPress={() => {
                setInputCode("KTR-BAR-ZOBO-01");
                handleRedeem("KTR-BAR-ZOBO-01");
              }}
            >
              <Text style={styles.samplePillText}>ZOBO-01</Text>
            </Pressable>
          </View>
        </View>

        {/* Manual Code Input & Unit Selector */}
        <View style={styles.actionCard}>
          <Text style={styles.sectionTitle}>MANUAL BAR PASS ENTRY</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={inputCode}
              onChangeText={setInputCode}
              placeholder="e.g. KTR-BAR-8X29Q"
              placeholderTextColor="#666"
              autoCapitalize="characters"
              autoCorrect={false}
            />
            {inputCode.length > 0 && (
              <Pressable
                onPress={() => setInputCode("")}
                style={styles.clearBtn}
                accessibilityLabel="Clear input"
              >
                <Feather name="x" size={16} color="#888" />
              </Pressable>
            )}
          </View>

          {/* Units Selector */}
          <View style={styles.unitSelectorRow}>
            <Text style={styles.unitSelectorLabel}>Cans to Pour:</Text>
            <View style={styles.stepperContainer}>
              <Pressable
                style={[styles.stepBtn, unitsToRedeem <= 1 && styles.stepBtnDisabled]}
                onPress={() => {
                  if (unitsToRedeem > 1) {
                    Haptics.selectionAsync();
                    setUnitsToRedeem((u) => u - 1);
                  }
                }}
              >
                <Feather name="minus" size={16} color={unitsToRedeem <= 1 ? "#555" : "#FFF"} />
              </Pressable>
              <Text style={styles.stepValue}>{unitsToRedeem} {unitsToRedeem === 1 ? "Can" : "Cans"}</Text>
              <Pressable
                style={[styles.stepBtn, unitsToRedeem >= 4 && styles.stepBtnDisabled]}
                onPress={() => {
                  if (unitsToRedeem < 4) {
                    Haptics.selectionAsync();
                    setUnitsToRedeem((u) => u + 1);
                  }
                }}
              >
                <Feather name="plus" size={16} color={unitsToRedeem >= 4 ? "#555" : "#FFF"} />
              </Pressable>
            </View>
          </View>

          {/* Big Pour Button */}
          <Pressable
            style={[styles.pourBtn, isRedeeming && styles.pourBtnDisabled]}
            disabled={isRedeeming}
            onPress={() => handleRedeem()}
          >
            {isRedeeming ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <>
                <Text style={{ fontSize: 18 }}>🥫</Text>
                <Text style={styles.pourBtnText}>POUR & REDEEM PASS</Text>
              </>
            )}
          </Pressable>
        </View>

        {/* Live Result Feedback Banner */}
        {lastResult && (
          <View
            style={[
              styles.feedbackBanner,
              { backgroundColor: lastResult.success ? "rgba(0, 230, 118, 0.15)" : "rgba(255, 23, 68, 0.15)" },
              { borderColor: lastResult.success ? "#00E676" : "#FF1744" },
            ]}
          >
            <View style={styles.feedbackIconWrap}>
              <Feather
                name={lastResult.success ? "check-circle" : "alert-circle"}
                size={24}
                color={lastResult.success ? "#00E676" : "#FF1744"}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.feedbackTitle,
                  { color: lastResult.success ? "#00E676" : "#FF1744" },
                ]}
              >
                {lastResult.success ? "DISPENSE AUTHORIZED" : "REDEMPTION DECLINED"}
              </Text>
              <Text style={styles.feedbackMessage}>{lastResult.message}</Text>
              {lastResult.remainingUnits !== undefined && (
                <Text style={styles.feedbackBalance}>
                  Remaining on Pass: {lastResult.remainingUnits} / {lastResult.totalUnits} Cans
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Recent Redemptions Log */}
        <View style={styles.historyCard}>
          <View style={styles.historyHeader}>
            <Feather name="clock" size={15} color="#888" />
            <Text style={styles.historyTitle}>RECENT SHIFT ACTIVITY</Text>
          </View>

          {recentLogs.length === 0 ? (
            <Text style={styles.historyEmpty}>No drink passes scanned yet this shift.</Text>
          ) : (
            recentLogs.map((log) => (
              <View key={log.id} style={styles.historyItem}>
                <View style={styles.historyItemLeft}>
                  <Text style={styles.historyCode}>{log.voucherCode}</Text>
                  <Text style={styles.historyTime}>{log.time}</Text>
                </View>
                <View style={styles.historyItemRight}>
                  <Text style={styles.historyPoured}>+{log.units} can{log.units > 1 ? "s" : ""}</Text>
                  <Text style={styles.historyRemaining}>{log.remainingUnits} left</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: { alignItems: "center" },
  stationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: "#1F1F1F",
    borderRadius: 10,
    marginBottom: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#00E676",
  },
  stationText: {
    color: "#888888",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  shiftBadge: {
    alignItems: "flex-end",
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  shiftLabel: {
    color: "#FF6B00",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  shiftCount: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  viewfinderCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#141414",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#222222",
  },
  viewfinder: {
    height: 180,
    backgroundColor: "#080808",
    borderRadius: 14,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  corner: {
    position: "absolute",
    width: 20,
    height: 20,
    borderColor: "#FF6B00",
  },
  cornerTL: { top: 12, left: 12, borderTopWidth: 3, borderLeftWidth: 3 },
  cornerTR: { top: 12, right: 12, borderTopWidth: 3, borderRightWidth: 3 },
  cornerBL: { bottom: 12, left: 12, borderBottomWidth: 3, borderLeftWidth: 3 },
  cornerBR: { bottom: 12, right: 12, borderBottomWidth: 3, borderRightWidth: 3 },
  scanline: {
    position: "absolute",
    top: "50%",
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: "#FF6B00",
    shadowColor: "#FF6B00",
    shadowRadius: 8,
    shadowOpacity: 0.8,
  },
  viewfinderContent: {
    alignItems: "center",
    gap: 6,
  },
  viewfinderHint: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  viewfinderSub: {
    color: "#777777",
    fontSize: 11,
  },
  sampleScanRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  sampleLabel: {
    color: "#888",
    fontSize: 11,
    fontWeight: "600",
  },
  samplePill: {
    backgroundColor: "#202020",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  samplePillText: {
    color: "#FF6B00",
    fontSize: 11,
    fontWeight: "700",
  },

  actionCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#141414",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#222222",
    gap: 14,
  },
  sectionTitle: {
    color: "#777",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#080808",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    height: 48,
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 1,
  },
  clearBtn: {
    padding: 6,
  },
  unitSelectorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  unitSelectorLabel: {
    color: "#DDD",
    fontSize: 14,
    fontWeight: "600",
  },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#080808",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    padding: 4,
    gap: 12,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
  },
  stepBtnDisabled: {
    backgroundColor: "#141414",
    opacity: 0.5,
  },
  stepValue: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
    minWidth: 48,
    textAlign: "center",
  },
  pourBtn: {
    backgroundColor: "#FF6B00",
    borderRadius: 14,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  pourBtnDisabled: {
    opacity: 0.5,
  },
  pourBtnText: {
    color: "#000000",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 1,
  },

  feedbackBanner: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    flexDirection: "row",
    gap: 12,
  },
  feedbackIconWrap: {
    marginTop: 2,
  },
  feedbackTitle: {
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  feedbackMessage: {
    color: "#DDD",
    fontSize: 13,
    marginTop: 2,
  },
  feedbackBalance: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 6,
  },

  historyCard: {
    marginHorizontal: 16,
    backgroundColor: "#141414",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#222222",
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  historyTitle: {
    color: "#888",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  historyEmpty: {
    color: "#555",
    fontSize: 12,
    fontStyle: "italic",
    paddingVertical: 10,
    textAlign: "center",
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1E1E1E",
  },
  historyItemLeft: {
    gap: 2,
  },
  historyCode: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  historyTime: {
    color: "#666",
    fontSize: 11,
  },
  historyItemRight: {
    alignItems: "flex-end",
    gap: 2,
  },
  historyPoured: {
    color: "#00E676",
    fontSize: 13,
    fontWeight: "700",
  },
  historyRemaining: {
    color: "#888",
    fontSize: 11,
  },
});
