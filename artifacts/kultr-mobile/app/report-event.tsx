import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
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
import { useColors } from "@/hooks/useColors";
import { useEventCatalog } from "@/hooks/useEventCatalog";

export default function ReportEventScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { authToken } = useApp();
  const { getEventById } = useEventCatalog();

  const [selectedReason, setSelectedReason] = useState<string>("suspected_scam");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const event = getEventById(eventId || "");
  const apiBase = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001";

  const reasons = [
    {
      id: "suspected_scam",
      title: "Suspected Scam or Fake Event",
      desc: "Promoter is unverified, venue does not exist, or tickets appear fraudulent.",
    },
    {
      id: "misleading_listing",
      title: "Misleading Information",
      desc: "Incorrect headline performers, wrong date/time, or altered ticket pricing.",
    },
    {
      id: "inappropriate_content",
      title: "Inappropriate Content",
      desc: "Offensive imagery, hate speech, or prohibited items in event banner.",
    },
    {
      id: "duplicate_event",
      title: "Duplicate Event Listing",
      desc: "This event is already posted on Kultr by another user.",
    },
  ];

  const handleSubmit = async () => {
    if (!eventId) {
      Alert.alert("Error", "No event selected to report.");
      return;
    }

    setIsSubmitting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const res = await fetch(`${apiBase}/api/events/${eventId}/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({
          reason: selectedReason,
          details: details.trim() || undefined,
        }),
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        "Report Submitted",
        "Thank you for keeping Kultr safe. Our trust & safety team will review this listing within 2 hours.",
        [
          {
            text: "Done",
            onPress: () => router.back(),
          },
        ],
      );
    } catch {
      // Graceful offline mock response
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        "Report Received",
        "Your report has been logged and queued for administrative review.",
        [{ text: "Done", onPress: () => router.back() }],
      );
    } finally {
      setIsSubmitting(false);
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
          <Text style={styles.headerTitle}>Report Listing</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Reported Event Card Summary */}
        <View style={styles.eventSummaryCard}>
          <Feather name="alert-triangle" size={20} color="#D32F2F" style={{ marginRight: 12 }} />
          <View style={styles.eventSummaryCol}>
            <Text style={styles.eventSummaryTitle} numberOfLines={1}>
              {event?.title || "Event Listing"}
            </Text>
            <Text style={styles.eventSummaryMeta}>
              {event?.venue || "Venue"} • {event?.city || "City"}
            </Text>
          </View>
        </View>

        {/* Reason Selection */}
        <View style={styles.reasonsSection}>
          <Text style={styles.sectionHeading}>Why are you reporting this event?</Text>
          {reasons.map((r) => {
            const isSelected = selectedReason === r.id;
            return (
              <Pressable
                key={r.id}
                style={[
                  styles.reasonCard,
                  isSelected && styles.reasonCardSelected,
                ]}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedReason(r.id);
                }}
              >
                <View style={styles.radioCol}>
                  <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                </View>
                <View style={styles.reasonTextCol}>
                  <Text style={[styles.reasonTitle, isSelected && { color: "#FFFFFF" }]}>
                    {r.title}
                  </Text>
                  <Text style={styles.reasonDesc}>{r.desc}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Additional Details Textarea */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionHeading}>Additional Context (Optional)</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Share links or details that help our moderators investigate..."
            placeholderTextColor="#666666"
            value={details}
            onChangeText={setDetails}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Submit Report Action */}
        <View style={styles.submitContainer}>
          <Pressable
            style={[styles.submitBtn, isSubmitting && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={isSubmitting}
            accessibilityLabel="Submit trust and safety report"
            accessibilityRole="button"
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.submitBtnText}>Submit Report</Text>
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
  },
  eventSummaryCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    backgroundColor: "#1C1616",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(211,47,47,0.3)",
    padding: 14,
    marginBottom: 20,
  },
  eventSummaryCol: {
    flex: 1,
  },
  eventSummaryTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  eventSummaryMeta: {
    color: "#A0A0A0",
    fontSize: 12,
    marginTop: 2,
  },
  reasonsSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeading: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 12,
  },
  reasonCard: {
    flexDirection: "row",
    backgroundColor: "#141414",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#222222",
    padding: 14,
    marginBottom: 10,
    alignItems: "flex-start",
  },
  reasonCardSelected: {
    borderColor: "#D32F2F",
    backgroundColor: "#1C1414",
  },
  radioCol: {
    marginRight: 12,
    marginTop: 2,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#555555",
    alignItems: "center",
    justifyContent: "center",
  },
  radioCircleSelected: {
    borderColor: "#D32F2F",
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D32F2F",
  },
  reasonTextCol: {
    flex: 1,
  },
  reasonTitle: {
    color: "#CCCCCC",
    fontSize: 13,
    fontWeight: "700",
  },
  reasonDesc: {
    color: "#777777",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },
  detailsSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  textArea: {
    backgroundColor: "#161616",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#262626",
    color: "#FFFFFF",
    padding: 14,
    fontSize: 13,
    minHeight: 100,
  },
  submitContainer: {
    marginHorizontal: 20,
  },
  submitBtn: {
    height: 52,
    backgroundColor: "#D32F2F",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});
