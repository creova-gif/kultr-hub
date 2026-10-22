import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { QRDisplay } from "@/components/QRDisplay";
import { useColors } from "@/hooks/useColors";
import { useEventCatalog } from "@/hooks/useEventCatalog";
import { useApp } from "@/context/AppContext";

export default function BarPassViewScreen() {
  const { id, eventId, voucherCode, totalUnits, redeemedUnits, flavor, title } =
    useLocalSearchParams<{
      id: string;
      eventId?: string;
      voucherCode?: string;
      totalUnits?: string;
      redeemedUnits?: string;
      flavor?: string;
      title?: string;
    }>();

  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { getEventById } = useEventCatalog();
  const { authToken } = useApp();

  const [liveVoucher, setLiveVoucher] = useState<{
    voucherCode: string;
    totalUnits: number;
    redeemedUnits: number;
    eventTitle?: string;
  } | null>(null);

  useEffect(() => {
    if (!id || voucherCode) return;
    const apiBase = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001";
    fetch(`${apiBase}/api/beverages/my-vouchers`, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.vouchers) {
          const match = data.vouchers.find((v: { id: string }) => v.id === id);
          if (match) setLiveVoucher(match);
        }
      })
      .catch(() => {});
  }, [id, voucherCode, authToken]);

  const event = getEventById(eventId ?? "");
  const activeVoucherCode = voucherCode ?? liveVoucher?.voucherCode ?? "KTR-BAR-8X29Q";
  const total = Number(totalUnits ?? liveVoucher?.totalUnits ?? 4);
  const redeemed = Number(redeemedUnits ?? liveVoucher?.redeemedUnits ?? 0);
  const remaining = Math.max(0, total - redeemed);
  const activeTitle = title ?? liveVoucher?.eventTitle ?? "Kultr Canned Drink 4-Pack";

  const [counter, setCounter] = useState(30);

  // Dynamic 30-second rotating security timer to deter screenshot reuse
  useEffect(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const interval = setInterval(() => {
      setCounter((prev) => (prev <= 1 ? 30 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const bottomPad = Platform.OS === "web" ? Math.max(insets.bottom, 34) : insets.bottom;

  return (
    <View style={[styles.root, { backgroundColor: "#0A0A0A" }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: topPad + 12, paddingBottom: bottomPad + 40 }}
      >
        {/* Navigation Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: "#1A1A1A" }]}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Feather name="arrow-left" size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={[styles.headerTitle, { color: "#FFFFFF" }]}>My Bar Pass</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Bar Pass Card */}
        <View style={styles.card}>
          {/* Top Banner */}
          <View style={styles.cardTop}>
            <View style={styles.statusPill}>
              <View style={[styles.statusDot, { backgroundColor: remaining > 0 ? "#00E676" : "#757575" }]} />
              <Text style={styles.statusText}>
                {remaining > 0 ? "READY TO POUR" : "FULLY REDEEMED"}
              </Text>
            </View>
            <Text style={styles.flavorTitle}>{activeTitle}</Text>
            <Text style={styles.flavorSubtitle}>{flavor ?? "Sparkling Hibiscus & Ginger · 330ml"}</Text>
          </View>

          {/* High-Contrast QR Code View */}
          <View style={styles.qrContainer}>
            <QRDisplay value={activeVoucherCode} size={220} />
            <Text style={styles.voucherCodeText}>{activeVoucherCode}</Text>
            <View style={styles.securityRow}>
              <Feather name="shield" size={13} color="#FF6B00" />
              <Text style={styles.securityText}>
                Dynamic token refreshes in {counter}s
              </Text>
            </View>
          </View>

          {/* Unit Remaining Counter */}
          <View style={styles.unitsSection}>
            <Text style={styles.unitsRemainingNumber}>{remaining}</Text>
            <Text style={styles.unitsRemainingLabel}>
              of {total} DRINKS REMAINING
            </Text>

            {/* Visual Can Indicators */}
            <View style={styles.cansRow}>
              {Array.from({ length: total }).map((_, i) => {
                const isClaimed = i >= remaining;
                return (
                  <View
                    key={i}
                    style={[
                      styles.canSlot,
                      { backgroundColor: isClaimed ? "#222222" : "#FF6B00" },
                    ]}
                  >
                    <Text style={[styles.canIcon, { opacity: isClaimed ? 0.3 : 1 }]}>
                      🥫
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Event Context */}
          {event && (
            <View style={styles.eventContext}>
              <Feather name="map-pin" size={14} color="#888888" />
              <Text style={styles.eventContextText}>
                Valid at {event.venue} — Express Bar Stations
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  card: {
    marginHorizontal: 20,
    backgroundColor: "#141414",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#282828",
    overflow: "hidden",
  },
  cardTop: {
    padding: 20,
    backgroundColor: "#1A1A1A",
    borderBottomWidth: 1,
    borderBottomColor: "#282828",
    alignItems: "center",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  flavorTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },
  flavorSubtitle: {
    color: "#AAAAAA",
    fontSize: 13,
    marginTop: 4,
    textAlign: "center",
  },
  qrContainer: {
    paddingVertical: 28,
    alignItems: "center",
    backgroundColor: "#0D0D0D",
  },
  voucherCodeText: {
    color: "#E0E0E0",
    fontSize: 16,
    fontWeight: "800",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    marginTop: 16,
    letterSpacing: 2,
  },
  securityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  securityText: {
    color: "#FF6B00",
    fontSize: 12,
    fontWeight: "600",
  },
  unitsSection: {
    padding: 24,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#242424",
  },
  unitsRemainingNumber: {
    color: "#FF6B00",
    fontSize: 48,
    fontWeight: "900",
    lineHeight: 52,
  },
  unitsRemainingLabel: {
    color: "#888888",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginTop: 4,
  },
  cansRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  canSlot: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  canIcon: {
    fontSize: 20,
  },
  eventContext: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    backgroundColor: "#181818",
    borderTopWidth: 1,
    borderTopColor: "#222222",
  },
  eventContextText: {
    color: "#888888",
    fontSize: 12,
  },
});
