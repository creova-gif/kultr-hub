import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { Alert } from "@/lib/alert";
import type { Language } from "@/constants/translations";

const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "fr", label: "French", native: "Français" },
  { code: "sw", label: "Swahili", native: "Kiswahili" },
  { code: "ar", label: "Arabic", native: "العربية" },
];

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { language, setLanguage, lowBandwidth, setLowBandwidth, authUser, updateConsent } = useApp();
  const [consentBusy, setConsentBusy] = React.useState<"tracking" | "marketing" | null>(null);

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const handleTrackingConsentChange = async (value: boolean) => {
    setConsentBusy("tracking");
    try {
      await updateConsent({ trackingConsent: value });
    } catch {
      Alert.alert("Couldn't save", "Your choice couldn't be saved. Please try again.");
    } finally {
      setConsentBusy(null);
    }
  };

  const handleMarketingConsentChange = async (value: boolean) => {
    setConsentBusy("marketing");
    try {
      await updateConsent({ marketingSmsConsent: value });
    } catch {
      Alert.alert("Couldn't save", "Your choice couldn't be saved. Please try again.");
    } finally {
      setConsentBusy(null);
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: topPad + 12 }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
          style={[styles.backBtn, { backgroundColor: colors.muted }]}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Settings</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>LANGUAGE</Text>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {LANGUAGES.map((lang, i) => (
          <Pressable
            key={lang.code}
            onPress={() => setLanguage(lang.code)}
            accessibilityRole="radio"
            accessibilityState={{ checked: language === lang.code }}
            accessibilityLabel={`${lang.label} — ${lang.native}`}
            style={({ pressed }) => [
              styles.row,
              {
                borderBottomWidth: i < LANGUAGES.length - 1 ? 1 : 0,
                borderBottomColor: colors.border,
                backgroundColor: pressed ? colors.muted : "transparent",
              },
            ]}
          >
            <View style={styles.rowText}>
              <Text style={[styles.rowLabel, { color: colors.foreground }]}>{lang.native}</Text>
              <Text style={[styles.rowSub, { color: colors.mutedForeground }]}>{lang.label}</Text>
            </View>
            {language === lang.code && (
              <Feather name="check" size={18} color="#FF6B00" />
            )}
          </Pressable>
        ))}
      </View>

      <Text style={[styles.footnote, { color: colors.mutedForeground }]}>
        Arabic uses a right-to-left layout. Changing the language requires restarting the app for the layout to fully apply.
      </Text>

      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>PROGRAMS</Text>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Pressable
          onPress={() => router.push("/tribe-leaders")}
          accessibilityRole="button"
          accessibilityLabel="Kultr Tribe Leaders ambassador program"
          style={({ pressed }) => [
            styles.row,
            { backgroundColor: pressed ? colors.muted : "transparent" },
          ]}
        >
          <View style={[styles.programIcon, { backgroundColor: "rgba(255,107,0,0.12)" }]}>
            <Feather name="flag" size={16} color="#FF6B00" />
          </View>
          <View style={styles.rowText}>
            <Text style={[styles.rowLabel, { color: colors.foreground }]}>Kultr Tribe Leaders</Text>
            <Text style={[styles.rowSub, { color: colors.mutedForeground }]}>
              Ambassador program — lead & earn
            </Text>
          </View>
          <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
        </Pressable>
      </View>

      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>CONNECTIVITY</Text>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.row, { justifyContent: "space-between" }]}>
          <View style={styles.rowText}>
            <Text style={[styles.rowLabel, { color: colors.foreground }]}>Data Saver Mode</Text>
            <Text style={[styles.rowSub, { color: colors.mutedForeground }]}>
              Loads fewer events for slow connections
            </Text>
          </View>
          <Switch
            value={lowBandwidth}
            onValueChange={setLowBandwidth}
            trackColor={{ false: "#333", true: "#FF6B00" }}
            thumbColor="#fff"
          />
        </View>
      </View>

      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>PRIVACY</Text>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.row, { justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: colors.border }]}>
          <View style={styles.rowText}>
            <Text style={[styles.rowLabel, { color: colors.foreground }]}>Analytics &amp; Tracking</Text>
            <Text style={[styles.rowSub, { color: colors.mutedForeground }]}>
              Off by default. Helps us understand how the app is used — never sold or shared for advertising.
            </Text>
          </View>
          {consentBusy === "tracking" ? (
            <ActivityIndicator size="small" color="#FF6B00" />
          ) : (
            <Switch
              value={authUser?.trackingConsent === true}
              onValueChange={handleTrackingConsentChange}
              disabled={!authUser}
              accessibilityLabel="Allow analytics and tracking"
              trackColor={{ false: "#333", true: "#FF6B00" }}
              thumbColor="#fff"
            />
          )}
        </View>
        <View style={[styles.row, { justifyContent: "space-between" }]}>
          <View style={styles.rowText}>
            <Text style={[styles.rowLabel, { color: colors.foreground }]}>Marketing Messages</Text>
            <Text style={[styles.rowSub, { color: colors.mutedForeground }]}>
              Off by default. Separate from your login code texts, which always send regardless of this setting.
            </Text>
          </View>
          {consentBusy === "marketing" ? (
            <ActivityIndicator size="small" color="#FF6B00" />
          ) : (
            <Switch
              value={authUser?.marketingSmsConsent === true}
              onValueChange={handleMarketingConsentChange}
              disabled={!authUser}
              accessibilityLabel="Allow marketing SMS messages"
              trackColor={{ false: "#333", true: "#FF6B00" }}
              thumbColor="#fff"
            />
          )}
        </View>
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontWeight: "800", flex: 1, textAlign: "center", marginHorizontal: 8 },
  sectionLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 1, marginBottom: 8, marginLeft: 4 },
  card: { borderRadius: 16, borderWidth: 1, overflow: "hidden", marginBottom: 20 },
  row: { flexDirection: "row", alignItems: "center", padding: 16, gap: 12 },
  programIcon: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  rowText: { flex: 1 },
  rowLabel: { fontSize: 16, fontWeight: "600" },
  rowSub: { fontSize: 12, marginTop: 2 },
  footnote: { fontSize: 11, lineHeight: 17, textAlign: "center", marginBottom: 16 },
});
