import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Alert } from "@/lib/alert";
import { useTranslation } from "@/hooks/useTranslation";
import type { Translations } from "@/constants/translations";

const BENEFIT_ICONS = ["star", "users", "trending-up", "award", "zap"] as const;

const STEP_NUMBERS = ["01", "02", "03", "04"] as const;

function getBenefits(t: Translations) {
  return [
    { icon: BENEFIT_ICONS[0], title: t.tribeLeaders.benefit1Title, body: t.tribeLeaders.benefit1Body },
    { icon: BENEFIT_ICONS[1], title: t.tribeLeaders.benefit2Title, body: t.tribeLeaders.benefit2Body },
    { icon: BENEFIT_ICONS[2], title: t.tribeLeaders.benefit3Title, body: t.tribeLeaders.benefit3Body },
    { icon: BENEFIT_ICONS[3], title: t.tribeLeaders.benefit4Title, body: t.tribeLeaders.benefit4Body },
    { icon: BENEFIT_ICONS[4], title: t.tribeLeaders.benefit5Title, body: t.tribeLeaders.benefit5Body },
  ];
}

function getSteps(t: Translations) {
  return [
    { number: STEP_NUMBERS[0], title: t.tribeLeaders.step1Title, body: t.tribeLeaders.step1Body },
    { number: STEP_NUMBERS[1], title: t.tribeLeaders.step2Title, body: t.tribeLeaders.step2Body },
    { number: STEP_NUMBERS[2], title: t.tribeLeaders.step3Title, body: t.tribeLeaders.step3Body },
    { number: STEP_NUMBERS[3], title: t.tribeLeaders.step4Title, body: t.tribeLeaders.step4Body },
  ];
}

export default function TribeLeadersScreen() {
  const insets = useSafeAreaInsets();
  const t = useTranslation();
  const [applying, setApplying] = useState(false);
  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const BENEFITS = getBenefits(t);
  const STEPS = getSteps(t);

  const handleApply = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setApplying(true);
    try {
      Alert.alert(
        t.tribeLeaders.applyAlertTitle,
        t.tribeLeaders.applyAlertMsg,
        [
          { text: t.actions.cancel, style: "cancel" },
          {
            text: t.tribeLeaders.openForm,
            onPress: () => {
              Linking.openURL("https://kultr.com/tribe-leaders");
            },
          },
        ],
      );
    } finally {
      setApplying(false);
    }
  };

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingTop: topPad, paddingBottom: insets.bottom + 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Back button overlay */}
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
          style={[styles.backBtn, { top: topPad + 8 }]}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Feather name="arrow-left" size={20} color="#fff" />
        </Pressable>

        {/* Hero gradient banner */}
        <LinearGradient
          colors={["#FF6B00", "#E55000", "#1A0500"]}
          locations={[0, 0.4, 1]}
          style={styles.heroBanner}
        >
          <View style={styles.heroContent}>
            <View style={styles.programBadge}>
              <Text style={styles.programBadgeText}>{t.tribeLeaders.badge.toUpperCase()}</Text>
            </View>
            <Text style={styles.heroTitle}>{t.tribeLeaders.heroTitleLine1.toUpperCase()}{"\n"}{t.tribeLeaders.heroTitleLine2.toUpperCase()}</Text>
            <View style={styles.heroDivider} />
            <Text style={styles.heroTagline}>{t.tribeLeaders.heroTagline.toUpperCase()}</Text>
            <Text style={styles.heroSub}>
              {t.tribeLeaders.heroSubLine1.toUpperCase()}{"\n"}{t.tribeLeaders.heroSubLine2.toUpperCase()}
            </Text>
          </View>

          {/* African pattern decoration */}
          <View style={styles.patternRow}>
            {Array.from({ length: 24 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.patternDiamond,
                  { opacity: i % 3 === 0 ? 0.6 : 0.2 },
                ]}
              />
            ))}
          </View>
        </LinearGradient>

        {/* Benefits */}
        <View style={styles.benefitsSection}>
          <Text style={styles.sectionLabel}>{t.tribeLeaders.whatYouGet.toUpperCase()}</Text>
          {BENEFITS.map((b) => (
            <View key={b.title} style={styles.benefitCard}>
              <View style={styles.benefitIconWrap}>
                <Feather name={b.icon} size={22} color="#FF6B00" />
              </View>
              <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>{b.title}</Text>
                <Text style={styles.benefitBody}>{b.body}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Movement section */}
        <LinearGradient
          colors={["#0D0D0D", "#1A0800"]}
          style={styles.movementSection}
        >
          <Text style={styles.movementTitle}>
            {t.tribeLeaders.movementTitleLine1.toUpperCase()}{"\n"}{t.tribeLeaders.movementTitleLine2.toUpperCase()}
          </Text>
          <Text style={styles.movementSub}>
            {t.tribeLeaders.movementSub}
          </Text>
        </LinearGradient>

        {/* How it works */}
        <View style={styles.stepsSection}>
          <Text style={styles.sectionLabel}>{t.tribeLeaders.howItWorks.toUpperCase()}</Text>
          {STEPS.map((step, i) => (
            <View key={step.number} style={styles.stepRow}>
              <View style={styles.stepNumberWrap}>
                <Text style={styles.stepNumber}>{step.number}</Text>
                {i < STEPS.length - 1 && <View style={styles.stepConnector} />}
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepBody}>{step.body}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* CTA */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaHeadline}>{t.tribeLeaders.ctaHeadlineLine1.toUpperCase()}{"\n"}{t.tribeLeaders.ctaHeadlineLine2.toUpperCase()}</Text>
          <Pressable
            style={({ pressed }) => [styles.applyBtn, { opacity: pressed || applying ? 0.85 : 1 }]}
            onPress={handleApply}
            disabled={applying}
            accessibilityLabel={t.tribeLeaders.applyNow}
            accessibilityRole="button"
          >
            <Text style={styles.applyBtnText}>{t.tribeLeaders.applyNow}</Text>
            <Feather name="arrow-right" size={18} color="#fff" />
          </Pressable>
          <Text style={styles.kultrUrl}>KULTR.COM/TRIBE-LEADERS</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0D0D0D" },
  scroll: { flex: 1 },

  backBtn: {
    position: "absolute",
    left: 16,
    zIndex: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },

  heroBanner: {
    paddingTop: 80,
    paddingBottom: 32,
    paddingHorizontal: 24,
    overflow: "hidden",
  },
  heroContent: { gap: 8 },
  programBadge: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  programBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 42,
    fontWeight: "900",
    lineHeight: 46,
    letterSpacing: -0.5,
    marginTop: 4,
  },
  heroDivider: {
    height: 3,
    width: 48,
    backgroundColor: "#fff",
    borderRadius: 2,
    marginVertical: 8,
  },
  heroTagline: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 3,
  },
  heroSub: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
    lineHeight: 20,
    marginTop: 4,
  },
  patternRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 24,
  },
  patternDiamond: {
    width: 8,
    height: 8,
    backgroundColor: "#fff",
    transform: [{ rotate: "45deg" }],
  },

  benefitsSection: {
    padding: 24,
    gap: 14,
  },
  sectionLabel: {
    color: "#FF6B00",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 4,
  },
  benefitCard: {
    flexDirection: "row",
    gap: 14,
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    alignItems: "flex-start",
  },
  benefitIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255,107,0,0.12)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    borderWidth: 1,
    borderColor: "rgba(255,107,0,0.25)",
  },
  benefitText: { flex: 1, gap: 4 },
  benefitTitle: { color: "#fff", fontSize: 15, fontWeight: "800" },
  benefitBody: { color: "#888", fontSize: 13, lineHeight: 19 },

  movementSection: {
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 24,
    gap: 14,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    marginBottom: 28,
  },
  movementTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 26,
    letterSpacing: 0.3,
  },
  movementSub: {
    color: "#888",
    fontSize: 13,
    lineHeight: 21,
  },

  stepsSection: {
    paddingHorizontal: 24,
    marginBottom: 28,
    gap: 0,
  },
  stepRow: {
    flexDirection: "row",
    gap: 16,
    paddingBottom: 8,
  },
  stepNumberWrap: {
    alignItems: "center",
    width: 36,
  },
  stepNumber: {
    color: "#FF6B00",
    fontSize: 14,
    fontWeight: "900",
    width: 36,
    height: 36,
    textAlign: "center",
    lineHeight: 36,
    backgroundColor: "rgba(255,107,0,0.12)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,107,0,0.3)",
  },
  stepConnector: {
    width: 1,
    flex: 1,
    backgroundColor: "#2A2A2A",
    marginVertical: 4,
  },
  stepContent: { flex: 1, paddingTop: 6, paddingBottom: 20 },
  stepTitle: { color: "#fff", fontSize: 15, fontWeight: "800", marginBottom: 4 },
  stepBody: { color: "#888", fontSize: 13, lineHeight: 19 },

  ctaSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: "center",
    gap: 16,
  },
  ctaHeadline: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
    lineHeight: 26,
    letterSpacing: 0.5,
  },
  applyBtn: {
    backgroundColor: "#FF6B00",
    borderRadius: 30,
    paddingHorizontal: 36,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "100%",
    justifyContent: "center",
  },
  applyBtnText: { color: "#fff", fontSize: 17, fontWeight: "900", letterSpacing: 0.3 },
  kultrUrl: {
    color: "#444",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
});
