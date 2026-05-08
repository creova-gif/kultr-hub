import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

type NotifType = "ticket" | "reminder" | "promo" | "social";

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
  eventId?: string;
}

const INITIAL_NOTIFS: Notification[] = [
  {
    id: "n1",
    type: "ticket",
    title: "Booking Confirmed",
    body: "Your ticket for Sauti Za Mataifa has been confirmed. Ticket #KTR-98321.",
    time: "2 min ago",
    read: false,
    eventId: "evt-004",
  },
  {
    id: "n2",
    type: "reminder",
    title: "Event Tomorrow",
    body: "Echoes of Identity opens tomorrow at 10:00 AM. Don't forget to bring your ticket!",
    time: "1 hour ago",
    read: false,
    eventId: "evt-002",
  },
  {
    id: "n3",
    type: "promo",
    title: "Early Bird Ends Tonight",
    body: "Only 5 early bird tickets left for Afrobeat Nights. Save 33% before midnight.",
    time: "3 hours ago",
    read: false,
    eventId: "evt-001",
  },
  {
    id: "n4",
    type: "social",
    title: "3 friends are going",
    body: "Amara, Kofi, and Zara are attending Kampala Comedy Night. Join them!",
    time: "Yesterday",
    read: true,
    eventId: "evt-007",
  },
  {
    id: "n5",
    type: "promo",
    title: "New in Nairobi",
    body: "Flavors of Kenya just went on sale. Be the first to grab your spot.",
    time: "2 days ago",
    read: true,
    eventId: "evt-003",
  },
  {
    id: "n6",
    type: "reminder",
    title: "You saved an event",
    body: "Lagos Groove Festival is coming up in 4 weeks. Ready to book?",
    time: "3 days ago",
    read: true,
    eventId: "evt-005",
  },
];

const NOTIF_ICONS: Record<NotifType, { icon: string; color: string; bg: string }> = {
  ticket: { icon: "tag", color: "#00C853", bg: "rgba(0,200,83,0.15)" },
  reminder: { icon: "clock", color: "#FF6B00", bg: "rgba(255,107,0,0.15)" },
  promo: { icon: "zap", color: "#FFD600", bg: "rgba(255,214,0,0.15)" },
  social: { icon: "users", color: "#7C4DFF", bg: "rgba(124,77,255,0.15)" },
};

export default function NotificationsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [notifs, setNotifs] = useState(INITIAL_NOTIFS);

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const bottomPad = Platform.OS === "web" ? Math.max(insets.bottom, 34) : insets.bottom;

  const unreadCount = notifs.filter((n) => !n.read).length;

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  const handlePress = (notif: Notification) => {
    markRead(notif.id);
    if (notif.eventId) router.push(`/event/${notif.eventId}`);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: topPad + 12, paddingBottom: bottomPad + 40 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: colors.muted }]}
          >
            <Feather name="arrow-left" size={20} color={colors.foreground} />
          </Pressable>
          <View>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>Notifications</Text>
            {unreadCount > 0 && (
              <Text style={[styles.headerSub, { color: "#FF6B00" }]}>{unreadCount} unread</Text>
            )}
          </View>
          {unreadCount > 0 ? (
            <Pressable onPress={markAllRead} style={[styles.markAllBtn, { backgroundColor: colors.muted }]}>
              <Text style={[styles.markAllText, { color: colors.foreground }]}>Mark all read</Text>
            </Pressable>
          ) : (
            <View style={{ width: 90 }} />
          )}
        </View>

        {/* Notification groups */}
        <View style={{ marginTop: 8 }}>
          {/* Unread */}
          {notifs.filter((n) => !n.read).length > 0 && (
            <View style={styles.group}>
              <Text style={[styles.groupLabel, { color: colors.mutedForeground }]}>New</Text>
              <View style={styles.groupList}>
                {notifs.filter((n) => !n.read).map((notif) => (
                  <NotifItem key={notif.id} notif={notif} colors={colors} onPress={handlePress} />
                ))}
              </View>
            </View>
          )}

          {/* Read */}
          {notifs.filter((n) => n.read).length > 0 && (
            <View style={styles.group}>
              <Text style={[styles.groupLabel, { color: colors.mutedForeground }]}>Earlier</Text>
              <View style={styles.groupList}>
                {notifs.filter((n) => n.read).map((notif) => (
                  <NotifItem key={notif.id} notif={notif} colors={colors} onPress={handlePress} />
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Settings hint */}
        <View style={[styles.settingsHint, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="settings" size={14} color={colors.mutedForeground} />
          <Text style={[styles.settingsText, { color: colors.mutedForeground }]}>
            Manage notification preferences in Settings
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function NotifItem({
  notif,
  colors,
  onPress,
}: {
  notif: Notification;
  colors: any;
  onPress: (n: Notification) => void;
}) {
  const cfg = NOTIF_ICONS[notif.type];
  return (
    <Pressable
      onPress={() => onPress(notif)}
      style={({ pressed }) => [
        styles.notifItem,
        {
          backgroundColor: notif.read ? colors.card : `${colors.card}`,
          borderColor: notif.read ? colors.border : "#FF6B00" + "40",
          borderLeftWidth: notif.read ? 0 : 3,
          borderLeftColor: notif.read ? "transparent" : "#FF6B00",
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={[styles.notifIcon, { backgroundColor: cfg.bg }]}>
        <Feather name={cfg.icon as any} size={18} color={cfg.color} />
      </View>
      <View style={styles.notifContent}>
        <View style={styles.notifTitleRow}>
          <Text style={[styles.notifTitle, { color: colors.foreground, fontWeight: notif.read ? "600" : "800" }]}>
            {notif.title}
          </Text>
          {!notif.read && <View style={styles.unreadDot} />}
        </View>
        <Text style={[styles.notifBody, { color: colors.mutedForeground }]} numberOfLines={2}>
          {notif.body}
        </Text>
        <Text style={[styles.notifTime, { color: colors.mutedForeground }]}>{notif.time}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  headerSub: { fontSize: 12, fontWeight: "600", marginTop: 1 },
  markAllBtn: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8 },
  markAllText: { fontSize: 12, fontWeight: "600" },
  group: { marginBottom: 8 },
  groupLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    marginBottom: 8,
    marginTop: 12,
  },
  groupList: { paddingHorizontal: 16, gap: 8 },
  notifItem: {
    flexDirection: "row",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "flex-start",
  },
  notifIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  notifContent: { flex: 1 },
  notifTitleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 3 },
  notifTitle: { fontSize: 14, flex: 1, marginRight: 6 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#FF6B00" },
  notifBody: { fontSize: 13, lineHeight: 18, marginBottom: 6 },
  notifTime: { fontSize: 11 },
  settingsHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 20,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  settingsText: { fontSize: 12 },
});
