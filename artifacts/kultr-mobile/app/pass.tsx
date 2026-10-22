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
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

interface PassTier {
  id: string;
  name: string;
  badge: string;
  monthlyPrice: string;
  annualPrice: string;
  currency: string;
  description: string;
  color: string;
  benefits: string[];
}

export default function KultrPassScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { authToken, userCountry } = useApp();
  const userCurrency = userCountry?.currencyCode ?? "USD";

  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [selectedTierId, setSelectedTierId] = useState<string>("vip");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const tiers: PassTier[] = [
    {
      id: "explorer",
      name: "Kultr Explorer",
      badge: "ESSENTIAL",
      monthlyPrice: userCurrency === "KES" ? "KES 1,200" : "$9.99",
      annualPrice: userCurrency === "KES" ? "KES 12,000" : "$99.00",
      currency: userCurrency,
      description: "For active culture seekers attending 1–2 events every month.",
      color: "#FF6B00",
      benefits: [
        "2x KULTROINS on every event check-in",
        "Free RSVP access to community mixers & club nights",
        "48-hour early ticket pre-sale window",
        "Verified Community Member profile badge",
      ],
    },
    {
      id: "vip",
      name: "Kultr VIP Pass",
      badge: "MOST POPULAR",
      monthlyPrice: userCurrency === "KES" ? "KES 3,200" : "$24.99",
      annualPrice: userCurrency === "KES" ? "KES 32,000" : "$249.00",
      currency: userCurrency,
      description: "Complete festival VIP status across London, Lagos, and Nairobi.",
      color: "#FFD700",
      benefits: [
        "15% off all festival & headline concert tickets",
        "Express fast-track gate entrance lane",
        "1 complimentary Kultr Canned Drink 4-pack at partnered festivals",
        "Exclusive backstage afterparty lottery entry",
        "3x KULTROINS token multiplier",
      ],
    },
    {
      id: "founder",
      name: "Founder Patron Pass",
      badge: "PRESTIGE",
      monthlyPrice: userCurrency === "KES" ? "KES 7,500" : "$59.99",
      annualPrice: userCurrency === "KES" ? "KES 75,000" : "$599.00",
      currency: userCurrency,
      description: "For cultural ambassadors and patrons building diaspora arts.",
      color: "#00E676",
      benefits: [
        "Guaranteed VVIP lounge admission at flagship festivals",
        "Direct voting power on Kultr Creator Grant allocations",
        "Quarterly private dinner with headlining artists",
        "Physical NFC-embedded matte-black membership card",
        "Unlimited guest pass invitations (2 per event)",
      ],
    },
  ];

  const currentTier = tiers.find((t) => t.id === selectedTierId) || tiers[1];

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    try {
      // Simulate pass activation
      await new Promise((r) => setTimeout(r, 1200));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        "🎉 Welcome to KULTR PASS!",
        `You are now a subscribed ${currentTier.name} member. Your benefits, 2x point multiplier, and express bar lanes are active immediately.`,
        [
          {
            text: "Explore Perks",
            onPress: () => router.push("/perks" as any),
          },
          {
            text: "Done",
            style: "cancel",
            onPress: () => router.back(),
          },
        ],
      );
    } catch {
      Alert.alert("Subscription Error", "Unable to complete subscription. Please try again.");
    } finally {
      setIsSubscribing(false);
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
        {/* Top Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backBtn}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Feather name="arrow-left" size={22} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>KULTR PASS</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Hero Card Showcase */}
        <View style={styles.heroCard}>
          <View style={styles.heroBackgroundPattern}>
            <View style={[styles.glowOrb, { backgroundColor: currentTier.color }]} />
          </View>
          <View style={styles.heroTopRow}>
            <View style={[styles.heroBadge, { borderColor: currentTier.color }]}>
              <Text style={[styles.heroBadgeText, { color: currentTier.color }]}>
                {currentTier.badge}
              </Text>
            </View>
            <Feather name="shield" size={24} color={currentTier.color} />
          </View>

          <Text style={styles.heroCardTitle}>{currentTier.name}</Text>
          <Text style={styles.heroCardSub}>{currentTier.description}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceAmount}>
              {billingCycle === "monthly" ? currentTier.monthlyPrice : currentTier.annualPrice}
            </Text>
            <Text style={styles.pricePeriod}>
              {billingCycle === "monthly" ? " / month" : " / year"}
            </Text>
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.cardFooterText}>DIASPORA CULTURAL MEMBERSHIP</Text>
            <Feather name="arrow-up-right" size={16} color="#A0A0A0" />
          </View>
        </View>

        {/* Billing Cycle Toggle */}
        <View style={styles.cycleToggleContainer}>
          <Pressable
            style={[styles.cycleBtn, billingCycle === "monthly" && styles.cycleBtnActive]}
            onPress={() => {
              Haptics.selectionAsync();
              setBillingCycle("monthly");
            }}
          >
            <Text
              style={[
                styles.cycleBtnText,
                billingCycle === "monthly" && styles.cycleBtnTextActive,
              ]}
            >
              Monthly Billing
            </Text>
          </Pressable>

          <Pressable
            style={[styles.cycleBtn, billingCycle === "annual" && styles.cycleBtnActive]}
            onPress={() => {
              Haptics.selectionAsync();
              setBillingCycle("annual");
            }}
          >
            <Text
              style={[
                styles.cycleBtnText,
                billingCycle === "annual" && styles.cycleBtnTextActive,
              ]}
            >
              Annual (2 Months Free)
            </Text>
          </Pressable>
        </View>

        {/* Tier Selector Pills */}
        <View style={styles.tierPillRow}>
          {tiers.map((tier) => {
            const isSelected = tier.id === selectedTierId;
            return (
              <Pressable
                key={tier.id}
                style={[
                  styles.tierPill,
                  isSelected && {
                    borderColor: tier.color,
                    backgroundColor: "#1F1F1F",
                  },
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedTierId(tier.id);
                }}
              >
                <Text
                  style={[
                    styles.tierPillText,
                    isSelected && { color: "#FFFFFF", fontWeight: "800" },
                  ]}
                >
                  {tier.name.replace("Kultr ", "")}
                </Text>
                <Text style={[styles.tierPillPrice, isSelected && { color: tier.color }]}>
                  {billingCycle === "monthly" ? tier.monthlyPrice : tier.annualPrice}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Benefits Checklist */}
        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsHeading}>Included with {currentTier.name}:</Text>
          {currentTier.benefits.map((benefit, i) => (
            <View key={i} style={styles.benefitRow}>
              <View style={[styles.checkCircle, { backgroundColor: currentTier.color }]}>
                <Feather name="check" size={14} color="#0A0A0A" />
              </View>
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>

        {/* Payment Methods Supported */}
        <View style={styles.paymentMethodsRow}>
          <Text style={styles.paymentMethodsText}>
            Instant billing via M-Pesa, MTN MoMo, Apple Pay, or Credit Card. Cancel anytime.
          </Text>
        </View>

        {/* Subscribe CTA Button */}
        <View style={styles.ctaContainer}>
          <Pressable
            style={[
              styles.subscribeBtn,
              { backgroundColor: currentTier.color },
              isSubscribing && { opacity: 0.7 },
            ]}
            onPress={handleSubscribe}
            disabled={isSubscribing}
            accessibilityLabel={`Subscribe to ${currentTier.name}`}
            accessibilityRole="button"
          >
            {isSubscribing ? (
              <ActivityIndicator size="small" color="#0A0A0A" />
            ) : (
              <Text style={styles.subscribeBtnText}>
                Unlock {currentTier.name} —{" "}
                {billingCycle === "monthly" ? currentTier.monthlyPrice : currentTier.annualPrice}
              </Text>
            )}
          </Pressable>
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
    letterSpacing: 0.5,
  },
  heroCard: {
    marginHorizontal: 20,
    borderRadius: 24,
    backgroundColor: "#161616",
    borderWidth: 1,
    borderColor: "#2E2E2E",
    padding: 24,
    overflow: "hidden",
    position: "relative",
    marginBottom: 20,
  },
  heroBackgroundPattern: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 160,
    height: 160,
  },
  glowOrb: {
    width: 140,
    height: 140,
    borderRadius: 70,
    opacity: 0.15,
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  heroBadge: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  heroCardTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
  },
  heroCardSub: {
    color: "#A0A0A0",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 20,
    marginBottom: 16,
  },
  priceAmount: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
  },
  pricePeriod: {
    color: "#888888",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 4,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#262626",
    paddingTop: 12,
  },
  cardFooterText: {
    color: "#777777",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  cycleToggleContainer: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
    marginHorizontal: 20,
    padding: 4,
    marginBottom: 20,
  },
  cycleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  cycleBtnActive: {
    backgroundColor: "#2E2E2E",
  },
  cycleBtnText: {
    color: "#888888",
    fontSize: 12,
    fontWeight: "700",
  },
  cycleBtnTextActive: {
    color: "#FFFFFF",
  },
  tierPillRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  tierPill: {
    flex: 1,
    backgroundColor: "#161616",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#262626",
    padding: 12,
    alignItems: "center",
  },
  tierPillText: {
    color: "#999999",
    fontSize: 12,
    fontWeight: "700",
  },
  tierPillPrice: {
    color: "#666666",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
  },
  benefitsContainer: {
    backgroundColor: "#141414",
    marginHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#242424",
    padding: 20,
    marginBottom: 20,
  },
  benefitsHeading: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 14,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  benefitText: {
    color: "#CCCCCC",
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
    lineHeight: 18,
  },
  paymentMethodsRow: {
    marginHorizontal: 24,
    marginBottom: 20,
  },
  paymentMethodsText: {
    color: "#666666",
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
  },
  ctaContainer: {
    marginHorizontal: 20,
  },
  subscribeBtn: {
    height: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  subscribeBtnText: {
    color: "#0A0A0A",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0.3,
  },
});
