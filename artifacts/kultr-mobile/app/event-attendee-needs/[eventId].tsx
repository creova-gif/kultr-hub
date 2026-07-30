import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { useEventCatalog } from "@/hooks/useEventCatalog";
import {
  useGetEventAttendeeNeeds,
  getGetEventAttendeeNeedsQueryKey,
} from "@workspace/api-client-react";

/**
 * Creator-only view of attendee dietary/accessibility submissions — POPIA
 * §26 special-category data. Only ever shows the subset of attendees who
 * explicitly opted in (see ticket/[id].tsx); this is never a full roster.
 */
export default function EventAttendeeNeedsScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { authToken } = useApp();
  const { getEventById } = useEventCatalog();
  const event = getEventById(eventId ?? "");

  const { data, isLoading, isError } = useGetEventAttendeeNeeds(eventId ?? "", {
    query: { queryKey: getGetEventAttendeeNeedsQueryKey(eventId ?? ""), enabled: !!eventId && !!authToken },
  });

  const topPad = insets.top + 12;

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: topPad }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace("/creator-studio" as any))}
          style={[styles.backBtn, { backgroundColor: colors.muted }]}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]} numberOfLines={1}>
          {event?.title ?? "Attendee Needs"}
        </Text>
        <View style={styles.backBtn} />
      </View>

      <Text style={[styles.subhead, { color: colors.mutedForeground }]}>
        Dietary restrictions and accessibility needs attendees chose to share with you — for catering and venue
        accommodation planning. Only attendees who explicitly opted in appear here.
      </Text>

      {isLoading && (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#FF6B00" />
        </View>
      )}

      {isError && !isLoading && (
        <View style={styles.centerState}>
          <Text style={{ color: colors.mutedForeground }}>Couldn't load attendee needs. Please try again.</Text>
        </View>
      )}

      {!isLoading && !isError && (data?.attendeeNeeds.length ?? 0) === 0 && (
        <View style={styles.centerState}>
          <Feather name="inbox" size={28} color={colors.mutedForeground} />
          <Text style={{ color: colors.mutedForeground, marginTop: 8, textAlign: "center", paddingHorizontal: 24 }}>
            No attendees have shared dietary or accessibility needs yet.
          </Text>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        {data?.attendeeNeeds.map((need) => (
          <View
            key={need.ticketId}
            style={[styles.needCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={styles.needHeaderRow}>
              <Text style={[styles.needName, { color: colors.foreground }]}>{need.buyerName}</Text>
              <Text style={[styles.needTicketNum, { color: colors.mutedForeground }]}>#{need.ticketNumber}</Text>
            </View>
            <Text style={[styles.needInfo, { color: colors.foreground }]}>{need.accessibilityInfo}</Text>
          </View>
        ))}
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
    marginBottom: 12,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 17, fontWeight: "700", flex: 1, textAlign: "center", marginHorizontal: 8 },
  subhead: { fontSize: 12, lineHeight: 17, marginBottom: 16 },
  centerState: { alignItems: "center", justifyContent: "center", paddingVertical: 60 },
  needCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
    gap: 6,
  },
  needHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  needName: { fontSize: 15, fontWeight: "700" },
  needTicketNum: { fontSize: 11, fontWeight: "600" },
  needInfo: { fontSize: 13, lineHeight: 18 },
});
