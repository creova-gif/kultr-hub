import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { QRDisplay } from "@/components/QRDisplay";

interface PerkItem {
  id: string;
  title: string;
  category: "drinks" | "fast_track" | "lounge" | "merch";
  costPoints: number;
  description: string;
  partner: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
  stockRemaining: number;
}

export default function PerksCatalogScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { authToken } = useApp();

  const [userPoints, setUserPoints] = useState(1450);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockedPerk, setUnlockedPerk] = useState<{
    perk: PerkItem;
    redemptionCode: string;
  } | null>(null);

  const perks: PerkItem[] = [
    {
      id: "perk-1",
      title: "Complimentary Kultr Cold Brew Can",
      category: "drinks",
      costPoints: 300,
      description: "Redeem 1 can of Kultr Cold Brew or Botanical Hibiscus at any festival express bar.",
      partner: "Kultr Canned Beverages",
      icon: "coffee",
      color: "#FF6B00",
      stockRemaining: 140,
    },
    {
      id: "perk-2",
      title: "Express Gate Priority Pass",
      category: "fast_track",
      costPoints: 500,
      description: "Skip the general admission queue at all official partnered diaspora concerts.",
      partner: "Kultr Gate Access",
      icon: "zap",
      color: "#FFD700",
      stockRemaining: 55,
    },
    {
      id: "perk-3",
      title: "VIP Backstage Lounge Upgrade",
      category: "lounge",
      costPoints: 1200,
      description: "Access to private creator lounge, dedicated bar, and artist meet & greet balcony.",
      partner: "Afrobeats Global",
      icon: "star",
      color: "#7C4DFF",
      stockRemaining: 12,
    },
    {
      id: "perk-4",
      title: "25% Off Official Merch Store",
      category: "merch",
      costPoints: 400,
      description: "Discount voucher applicable to limited edition Kultr streetwear hoodies and caps.",
      partner: "Creova Apparel",
      icon: "shopping-bag",
      color: "#00E676",
      stockRemaining: 80,
    },
    {
      id: "perk-5",
      title: "Kultr 4-Pack Express Bar Pass",
      category: "drinks",
      costPoints: 950,
      description: "A complete 4-pack voucher with fast-track line privileges at major summer festivals.",
      partner: "Kultr Canned Beverages",
      icon: "gift",
      color: "#FF6B00",
      stockRemaining: 30,
    },
  ];

  const filteredPerks =
    selectedCategory === "all"
      ? perks
      : perks.filter((p) => p.category === selectedCategory);

  const handleUnlockPerk = async (perk: PerkItem) => {
    if (userPoints < perk.costPoints) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert(
        "Insufficient KULTROINS",
        `You have ${userPoints} KULTROINS. This perk requires ${perk.costPoints}. Complete more cultural quests to earn points!`,
        [
          { text: "View Quests", onPress: () => router.push("/quests" as any) },
          { text: "OK", style: "cancel" },
        ],
      );
      return;
    }

    setIsUnlocking(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await new Promise((r) => setTimeout(r, 800));
      setUserPoints((prev) => prev - perk.costPoints);
      const code = `PERK-${perk.id.slice(0, 4).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setUnlockedPerk({ perk, redemptionCode: code });
    } catch {
      Alert.alert("Unlock Error", "Could not unlock perk. Please try again.");
    } finally {
      setIsUnlocking(false);
    }
  };

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 60) : insets.top;
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
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Feather name="arrow-left" size={22} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Perks Catalog</Text>
          <Pressable
            onPress={() => router.push("/pass" as any)}
            style={styles.passBtn}
            accessibilityLabel="View KULTR PASS"
            accessibilityRole="button"
          >
            <Text style={styles.passBtnText}>PASS</Text>
          </Pressable>
        </View>

        {/* User Balance Header Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceCol}>
            <Text style={styles.balanceLabel}>YOUR REWARD BALANCE</Text>
            <View style={styles.balanceRow}>
              <Text style={styles.balancePoints}>{userPoints.toLocaleString()}</Text>
              <Text style={styles.balanceSymbol}>KULTROINS</Text>
            </View>
          </View>
          <Pressable
            style={styles.earnMoreBtn}
            onPress={() => router.push("/quests" as any)}
            accessibilityLabel="Earn more points"
            accessibilityRole="button"
          >
            <Feather name="plus-circle" size={14} color="#0A0A0A" />
            <Text style={styles.earnMoreText}>Earn More</Text>
          </Pressable>
        </View>

        {/* Category Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {[
            { id: "all", label: "All Perks" },
            { id: "drinks", label: "Free Drinks" },
            { id: "fast_track", label: "Line Jumps" },
            { id: "lounge", label: "VIP Lounges" },
            { id: "merch", label: "Merch Discounts" },
          ].map((cat) => (
            <Pressable
              key={cat.id}
              style={[
                styles.categoryChip,
                selectedCategory === cat.id && styles.categoryChipActive,
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedCategory(cat.id);
              }}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === cat.id && styles.categoryChipTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Perks Grid */}
        <View style={styles.perksList}>
          {filteredPerks.map((perk) => {
            const canAfford = userPoints >= perk.costPoints;
            return (
              <View key={perk.id} style={styles.perkCard}>
                <View style={styles.perkTopRow}>
                  <View style={[styles.perkIconWrap, { backgroundColor: perk.color }]}>
                    <Feather name={perk.icon} size={20} color="#0A0A0A" />
                  </View>
                  <View style={styles.perkCostPill}>
                    <Text style={styles.perkCostPoints}>{perk.costPoints}</Text>
                    <Text style={styles.perkCostCurrency}>PTS</Text>
                  </View>
                </View>

                <Text style={styles.perkTitle}>{perk.title}</Text>
                <Text style={styles.perkDesc}>{perk.description}</Text>
                <Text style={styles.perkPartner}>Partner: {perk.partner}</Text>

                <View style={styles.perkCardFooter}>
                  <Text style={styles.perkStockText}>
                    {perk.stockRemaining} passes left
                  </Text>
                  <Pressable
                    style={[
                      styles.unlockBtn,
                      { backgroundColor: canAfford ? perk.color : "#2A2A2A" },
                    ]}
                    onPress={() => handleUnlockPerk(perk)}
                    accessibilityLabel={`Unlock ${perk.title}`}
                    accessibilityRole="button"
                  >
                    <Text
                      style={[
                        styles.unlockBtnText,
                        !canAfford && { color: "#777777" },
                      ]}
                    >
                      {canAfford ? "Unlock Perk" : "Need Points"}
                    </Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Perk Unlock Success Modal */}
      {unlockedPerk && (
        <Modal
          visible={!!unlockedPerk}
          transparent
          animationType="fade"
          onRequestClose={() => setUnlockedPerk(null)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <View style={[styles.modalCelebrationBadge, { backgroundColor: unlockedPerk.perk.color }]}>
                <Feather name="gift" size={32} color="#0A0A0A" />
              </View>
              <Text style={styles.modalTitle}>Perk Unlocked!</Text>
              <Text style={styles.modalPerkName}>{unlockedPerk.perk.title}</Text>
              <Text style={styles.modalSub}>
                Present this barcode to the staff or bar cashier to redeem your perk:
              </Text>

              <View style={styles.qrContainer}>
                <QRDisplay value={unlockedPerk.redemptionCode} size={160} />
                <Text style={styles.codeText}>{unlockedPerk.redemptionCode}</Text>
              </View>

              <Pressable
                style={styles.doneBtn}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setUnlockedPerk(null);
                }}
                accessibilityLabel="Close unlock modal"
                accessibilityRole="button"
              >
                <Text style={styles.doneBtnText}>Save to My Passes</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
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
    marginBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1C1C1C",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  passBtn: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  passBtnText: {
    color: "#0A0A0A",
    fontSize: 12,
    fontWeight: "900",
  },
  balanceCard: {
    marginHorizontal: 20,
    backgroundColor: "#161616",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#262626",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  balanceCol: {},
  balanceLabel: {
    color: "#888888",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 4,
  },
  balancePoints: {
    color: "#FFD700",
    fontSize: 26,
    fontWeight: "900",
  },
  balanceSymbol: {
    color: "#A0A0A0",
    fontSize: 11,
    fontWeight: "700",
    marginLeft: 6,
  },
  earnMoreBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFD700",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  earnMoreText: {
    color: "#0A0A0A",
    fontSize: 12,
    fontWeight: "800",
  },
  categoryScroll: {
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 20,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#262626",
  },
  categoryChipActive: {
    backgroundColor: "#FF6B00",
    borderColor: "#FF6B00",
  },
  categoryChipText: {
    color: "#888888",
    fontSize: 12,
    fontWeight: "700",
  },
  categoryChipTextActive: {
    color: "#FFFFFF",
  },
  perksList: {
    marginHorizontal: 20,
    gap: 14,
  },
  perkCard: {
    backgroundColor: "#141414",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#222222",
    padding: 18,
  },
  perkTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  perkIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  perkCostPill: {
    flexDirection: "row",
    alignItems: "baseline",
    backgroundColor: "#202020",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#303030",
  },
  perkCostPoints: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
  perkCostCurrency: {
    color: "#FFD700",
    fontSize: 10,
    fontWeight: "700",
    marginLeft: 3,
  },
  perkTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 6,
  },
  perkDesc: {
    color: "#999999",
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
  perkPartner: {
    color: "#666666",
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 14,
  },
  perkCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#202020",
    paddingTop: 12,
  },
  perkStockText: {
    color: "#777777",
    fontSize: 11,
    fontWeight: "600",
  },
  unlockBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  unlockBtnText: {
    color: "#0A0A0A",
    fontSize: 13,
    fontWeight: "800",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#161616",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#2E2E2E",
    padding: 24,
    alignItems: "center",
  },
  modalCelebrationBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
  },
  modalPerkName: {
    color: "#FFD700",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 4,
    textAlign: "center",
  },
  modalSub: {
    color: "#888888",
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 18,
  },
  qrContainer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  codeText: {
    color: "#000000",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: 8,
  },
  doneBtn: {
    width: "100%",
    height: 50,
    backgroundColor: "#FF6B00",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  doneBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
});
