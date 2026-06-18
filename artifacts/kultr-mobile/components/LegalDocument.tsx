import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

export interface LegalSection {
  heading: string;
  body: string;
}

/**
 * Shared, scrollable reader for a legal document (Privacy Policy, Terms).
 * Content is passed in as plain sections so the same chrome serves every doc.
 */
export function LegalDocument({
  title,
  effectiveDate,
  intro,
  sections,
}: {
  title: string;
  effectiveDate: string;
  intro: string;
  sections: LegalSection[];
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const bottomPad = Platform.OS === "web" ? Math.max(insets.bottom, 34) : insets.bottom;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: topPad + 12, paddingBottom: bottomPad + 40 }}
      >
        <View style={styles.header}>
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
            style={[styles.backBtn, { backgroundColor: colors.muted }]}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Feather name="arrow-left" size={20} color={colors.foreground} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.foreground }]} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.backBtn} />
        </View>

        <View style={styles.body}>
          <Text style={[styles.effective, { color: colors.mutedForeground }]}>
            Effective {effectiveDate}
          </Text>
          <Text style={[styles.intro, { color: colors.foreground }]}>{intro}</Text>

          {sections.map((s) => (
            <View key={s.heading} style={styles.section}>
              <Text style={[styles.heading, { color: colors.foreground }]}>{s.heading}</Text>
              <Text style={[styles.paragraph, { color: colors.mutedForeground }]}>{s.body}</Text>
            </View>
          ))}
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
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontWeight: "800", flex: 1, textAlign: "center", marginHorizontal: 8 },
  body: { paddingHorizontal: 20 },
  effective: { fontSize: 12, marginBottom: 14 },
  intro: { fontSize: 15, lineHeight: 23, marginBottom: 22 },
  section: { marginBottom: 22 },
  heading: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
  paragraph: { fontSize: 14, lineHeight: 22 },
});
