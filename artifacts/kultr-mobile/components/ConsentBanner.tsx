import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";

/**
 * One-time, opt-in tracking consent prompt (GDPR / Quebec Law 25 bar — see
 * the global-expansion roadmap doc's Phase 2). Shows only when
 * authUser.trackingConsent is null (never asked yet) — once the user
 * accepts or declines it never reappears, since both are recorded choices.
 * Marketing SMS consent is deliberately not asked here: it's a distinct,
 * lower-urgency choice surfaced in Settings instead (see settings.tsx).
 */
export function ConsentBanner() {
  const colors = useColors();
  const { authUser, isHydrated, updateConsent } = useApp();
  const [busy, setBusy] = React.useState<"accept" | "decline" | null>(null);
  const [dismissedLocally, setDismissedLocally] = React.useState(false);

  const visible = isHydrated && !!authUser && authUser.trackingConsent === null && !dismissedLocally;
  if (!visible) return null;

  const respond = async (value: boolean) => {
    setBusy(value ? "accept" : "decline");
    try {
      await updateConsent({ trackingConsent: value });
    } catch {
      // Network hiccup — don't trap the user behind a banner that won't
      // dismiss; they can still change this later in Settings.
      setDismissedLocally(true);
    } finally {
      setBusy(null);
    }
  };

  return (
    <Modal transparent animationType="fade" visible onRequestClose={() => {}} accessibilityViewIsModal>
      <View style={styles.backdrop}>
        <View
          style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
          accessibilityRole="alert"
          accessibilityLabel="Analytics and tracking consent"
        >
          <Text style={[styles.title, { color: colors.cardForeground }]}>Help us improve Kultr Hub?</Text>
          <Text style={[styles.message, { color: colors.mutedForeground }]}>
            We'd like to use anonymized analytics to understand how the app is used. This is optional, off by
            default, and never sold or shared for advertising. You can change this anytime in Settings.
          </Text>
          <View style={styles.buttonRow}>
            <Pressable
              onPress={() => respond(true)}
              disabled={busy !== null}
              style={[styles.button, { backgroundColor: colors.primary }]}
              accessibilityLabel="Allow analytics and tracking"
              accessibilityRole="button"
            >
              <Text style={[styles.buttonText, { color: colors.primaryForeground }]}>
                {busy === "accept" ? "Saving..." : "Allow"}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => respond(false)}
              disabled={busy !== null}
              style={[styles.button, { borderColor: colors.border, borderWidth: 1 }]}
              accessibilityLabel="Decline analytics and tracking"
              accessibilityRole="button"
            >
              <Text style={[styles.buttonText, { color: colors.mutedForeground }]}>
                {busy === "decline" ? "Saving..." : "Not now"}
              </Text>
            </Pressable>
          </View>
          <Pressable onPress={() => router.push("/legal/privacy")} accessibilityRole="link">
            <Text style={[styles.privacyLink, { color: colors.mutedForeground }]}>Read our Privacy Policy</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 10,
    marginBottom: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
  },
  message: {
    fontSize: 13,
    lineHeight: 19,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  button: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "700",
  },
  privacyLink: {
    fontSize: 12,
    textAlign: "center",
    textDecorationLine: "underline",
    marginTop: 2,
  },
});
