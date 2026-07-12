import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
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
import {
  useMyNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  type NotificationView,
} from "@/hooks/useNotifications";

type NotifIcon = "check-circle" | "bell" | "dollar-sign" | "map-pin" | "users" | "star" | "x-circle" | "award";

const TYPE_ICON: Record<string, { icon: NotifIcon; color: string }> = {
  ticket_confirmed: { icon: "check-circle", color: "#00C853" },
  event_approved: { icon: "check-circle", color: "#00C853" },
  event_rejected: { icon: "x-circle", color: "#D32F2F" },
  event_cancelled: { icon: "x-circle", color: "#D32F2F" },
  payout_resolved: { icon: "dollar-sign", color: "#4F9DFF" },
  kultroin_earned: { icon: "star", color: "#FFD600" },
};

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function NotificationsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { authToken } = useApp();
  const { data, isLoading, isError, refetch, isRefetching } = useMyNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const bottomPad = Platform.OS === "web" ? Math.max(insets.bottom, 34) : insets.bottom;

  const notifs = data?.notifications ?? [];
  const unreadCount = data?.unreadCount ?? 0;
  const allRead = unreadCount === 0;

  const unreadNotifs = notifs.filter((n) => !n.read);
  const readNotifs = notifs.filter((n) => n.read);

  const handlePress = (notif: NotificationView) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!notif.read) markRead.mutate(notif.id);
    const eventId = (notif.data as { eventId?: string } | null | undefined)?.eventId;
    if (eventId) router.push(`/event/${eventId}` as any);
  };

  const handleMarkAllRead = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    markAllRead.mutate();
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: topPad + 12,
          paddingBottom: bottomPad + 40,
        }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: colors.card }]}
            accessibilityLabel="Go back"
          >
            <Feather name="arrow-left" size={20} color={colors.foreground} />
          </Pressable>

          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>
              Notifications
            </Text>
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>

          {!allRead ? (
            <Pressable
              onPress={handleMarkAllRead}
              disabled={markAllRead.isPending}
              style={[styles.markAllBtn, { backgroundColor: colors.card, opacity: markAllRead.isPending ? 0.6 : 1 }]}
              accessibilityLabel="Mark all notifications as read"
            >
              <Text style={[styles.markAllText, { color: "#FF6B00" }]}>
                Mark all read
              </Text>
            </Pressable>
          ) : (
            <View style={{ width: 90 }} />
          )}
        </View>

        {!authToken ? (
          <View style={styles.emptyState}>
            <Feather name="bell" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Sign in for notifications</Text>
            <Text style={[styles.emptySubtitle, { color: colors.mutedForeground }]}>
              Real updates about your tickets, events and payouts show up here.
            </Text>
            <Pressable style={styles.cta} onPress={() => router.push("/login")}>
              <Text style={styles.ctaText}>Sign In</Text>
            </Pressable>
          </View>
        ) : isLoading ? (
          <View style={{ paddingVertical: 60, alignItems: "center" }}>
            <ActivityIndicator size="large" color="#FF6B00" />
          </View>
        ) : isError ? (
          <View style={styles.emptyState}>
            <Feather name="wifi-off" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Couldn't load notifications</Text>
            <Pressable
              onPress={() => refetch()}
              style={[styles.markAllBtn, { backgroundColor: colors.card, marginTop: 8 }]}
            >
              <Text style={[styles.markAllText, { color: "#FF6B00" }]}>
                {isRefetching ? "Retrying…" : "Retry"}
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            {/* All caught up banner when all read but items still visible */}
            {allRead && readNotifs.length > 0 && (
              <View
                style={[
                  styles.caughtUpBanner,
                  {
                    backgroundColor: "rgba(0,200,83,0.08)",
                    borderColor: "#00C853",
                  },
                ]}
              >
                <Feather name="check-circle" size={14} color="#00C853" />
                <Text style={[styles.caughtUpText, { color: "#00C853" }]}>
                  You're all caught up!
                </Text>
              </View>
            )}

            {/* Empty state: no notifs at all */}
            {notifs.length === 0 && (
              <View style={styles.emptyState}>
                <Feather name="check-circle" size={48} color="#00C853" />
                <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
                  You're all caught up!
                </Text>
                <Text
                  style={[styles.emptySubtitle, { color: colors.mutedForeground }]}
                >
                  Real activity — ticket confirmations, event approvals, payout updates — will show up here.
                </Text>
              </View>
            )}

            {/* Unread section */}
            {unreadNotifs.length > 0 && (
              <View style={styles.group}>
                <Text
                  style={[styles.groupLabel, { color: colors.mutedForeground }]}
                >
                  NEW
                </Text>
                <View style={styles.groupList}>
                  {unreadNotifs.map((notif) => (
                    <NotifItem
                      key={notif.id}
                      notif={notif}
                      colors={colors}
                      onPress={handlePress}
                    />
                  ))}
                </View>
              </View>
            )}

            {/* Read section */}
            {readNotifs.length > 0 && (
              <View style={styles.group}>
                <Text
                  style={[styles.groupLabel, { color: colors.mutedForeground }]}
                >
                  EARLIER
                </Text>
                <View style={styles.groupList}>
                  {readNotifs.map((notif) => (
                    <NotifItem
                      key={notif.id}
                      notif={notif}
                      colors={colors}
                      onPress={handlePress}
                    />
                  ))}
                </View>
              </View>
            )}
          </>
        )}

        {/* Settings hint */}
        <View
          style={[
            styles.settingsHint,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Feather name="settings" size={14} color={colors.mutedForeground} />
          <Text
            style={[styles.settingsText, { color: colors.mutedForeground }]}
          >
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
  notif: NotificationView;
  colors: any;
  onPress: (n: NotificationView) => void;
}) {
  const meta = TYPE_ICON[notif.type] ?? { icon: "bell" as const, color: "#FF6B00" };
  const iconBg = meta.color + "22";

  return (
    <Pressable
      onPress={() => onPress(notif)}
      accessibilityLabel={`${notif.title}: ${notif.body}. ${timeAgo(notif.createdAt)}. ${notif.read ? "Read" : "Unread"}`}
      style={({ pressed }) => [
        styles.notifItem,
        {
          backgroundColor: colors.card,
          borderColor: notif.read ? colors.border : "#FF6B00" + "50",
          borderLeftWidth: notif.read ? StyleSheet.hairlineWidth : 3,
          borderLeftColor: notif.read ? colors.border : "#FF6B00",
          opacity: pressed ? 0.82 : 1,
        },
      ]}
    >
      {/* Icon circle — 44pt minimum */}
      <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
        <Feather name={meta.icon} size={20} color={meta.color} />
      </View>

      {/* Content */}
      <View style={styles.notifContent}>
        <View style={styles.notifTitleRow}>
          <Text
            style={[
              styles.notifTitle,
              {
                color: colors.foreground,
                fontWeight: notif.read ? "600" : "800",
              },
            ]}
            numberOfLines={1}
          >
            {notif.title}
          </Text>
          {!notif.read && <View style={styles.unreadDot} />}
        </View>
        <Text
          style={[styles.notifBody, { color: colors.mutedForeground }]}
          numberOfLines={2}
        >
          {notif.body}
        </Text>
        <Text style={[styles.notifTime, { color: colors.mutedForeground }]}>
          {timeAgo(notif.createdAt)}
        </Text>
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
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  badge: {
    backgroundColor: "#FF6B00",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "800" },
  markAllBtn: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  markAllText: { fontSize: 12, fontWeight: "700" },
  caughtUpBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  caughtUpText: { fontSize: 13, fontWeight: "600" },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyTitle: { fontSize: 20, fontWeight: "800", textAlign: "center" },
  emptySubtitle: { fontSize: 14, textAlign: "center" },
  cta: { backgroundColor: "#FF6B00", borderRadius: 25, paddingHorizontal: 28, paddingVertical: 12, marginTop: 8 },
  ctaText: { color: "#fff", fontWeight: "700", fontSize: 15 },
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
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  notifContent: { flex: 1 },
  notifTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  notifTitle: { fontSize: 14, flex: 1, marginRight: 6 },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF6B00",
    flexShrink: 0,
  },
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
