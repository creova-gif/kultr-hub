import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
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

const MENU_ITEMS = [
  { icon: "heart", label: "Saved Events", route: "/saved" },
  { icon: "tag", label: "My Tickets", route: "/(tabs)/tickets" },
  { icon: "star", label: "My Reviews", route: null },
  { icon: "users", label: "Following", route: null },
  { icon: "map-pin", label: "My Cities", route: null },
  { icon: "bell", label: "Notifications", route: "/notifications" },
  { icon: "settings", label: "Settings", route: null },
  { icon: "shield", label: "Privacy & Security", route: null },
  { icon: "help-circle", label: "Help & Support", route: null },
] as const;

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { tickets, savedEvents } = useApp();

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPad + 16, paddingBottom: insets.bottom + 80 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Profile</Text>
        <Pressable
          onPress={() => router.push("/notifications")}
          style={[styles.iconBtn, { backgroundColor: colors.muted }]}
        >
          <Feather name="bell" size={18} color={colors.foreground} />
          <View style={styles.notifDot} />
        </Pressable>
      </View>

      {/* User Card */}
      <View style={[styles.userCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.userCardTop}>
          <View style={styles.avatarWrapper}>
            <View style={[styles.avatar, { backgroundColor: "#FF6B00" }]}>
              <Text style={styles.avatarText}>AK</Text>
            </View>
            <View style={[styles.verifiedBadge, { backgroundColor: "#00C853" }]}>
              <Feather name="check" size={8} color="#fff" />
            </View>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.foreground }]}>Alex Kamau</Text>
            <Text style={[styles.userHandle, { color: colors.mutedForeground }]}>@alexkamau</Text>
            <View style={styles.memberRow}>
              <Feather name="award" size={11} color="#FF6B00" />
              <Text style={[styles.memberText, { color: "#FF6B00" }]}>Kultr Member</Text>
            </View>
          </View>
          <Pressable style={[styles.editBtn, { borderColor: "#FF6B00" }]}>
            <Text style={[styles.editBtnText, { color: "#FF6B00" }]}>Edit</Text>
          </Pressable>
        </View>

        {/* Stats */}
        <View style={[styles.statsRow, { borderTopColor: colors.border }]}>
          {[
            { label: "Tickets", value: tickets.length.toString(), onPress: () => router.push("/(tabs)/tickets") },
            { label: "Saved", value: savedEvents.length.toString(), onPress: () => router.push("/saved") },
            { label: "Cities", value: "3", onPress: null },
          ].map((stat, i) => (
            <React.Fragment key={stat.label}>
              <Pressable
                style={styles.statItem}
                onPress={stat.onPress ?? undefined}
              >
                <Text style={[styles.statValue, { color: colors.foreground }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: stat.onPress ? "#FF6B00" : colors.mutedForeground }]}>
                  {stat.label}
                </Text>
              </Pressable>
              {i < 2 && <View style={[styles.statDivider, { backgroundColor: colors.border }]} />}
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* Creator CTA */}
      <View style={[styles.creatorCard, { backgroundColor: "#1A0A00", borderColor: "#FF6B00" }]}>
        <View style={styles.creatorLeft}>
          <Feather name="zap" size={20} color="#FF6B00" />
          <View>
            <Text style={[styles.creatorTitle, { color: colors.foreground }]}>Become a Creator</Text>
            <Text style={[styles.creatorSub, { color: colors.mutedForeground }]}>
              List your events and reach thousands
            </Text>
          </View>
        </View>
        <Pressable style={styles.creatorBtn}>
          <Text style={styles.creatorBtnText}>Apply</Text>
        </Pressable>
      </View>

      {/* Menu */}
      <View style={[styles.menuSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {MENU_ITEMS.map((item, index) => (
          <Pressable
            key={item.label}
            onPress={() => item.route && router.push(item.route as any)}
            style={({ pressed }) => [
              styles.menuItem,
              {
                borderBottomWidth: index < MENU_ITEMS.length - 1 ? 1 : 0,
                borderBottomColor: colors.border,
                backgroundColor: pressed ? colors.muted : "transparent",
              },
            ]}
          >
            <View style={[styles.menuIconWrapper, { backgroundColor: colors.muted }]}>
              <Feather name={item.icon as any} size={16} color={item.route ? "#FF6B00" : colors.foreground} />
            </View>
            <Text style={[styles.menuLabel, { color: colors.foreground }]}>{item.label}</Text>
            <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          </Pressable>
        ))}
      </View>

      {/* Sign out */}
      <Pressable style={[styles.signOutBtn, { borderColor: colors.border }]}>
        <Feather name="log-out" size={16} color="#D32F2F" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>

      <Text style={[styles.version, { color: colors.mutedForeground }]}>
        Kultr v1.0 · Bold Culture. Timeless Impact.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { gap: 0 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  headerTitle: { fontSize: 28, fontWeight: "800" },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  notifDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF6B00",
    borderWidth: 1.5,
    borderColor: "#111111",
  },
  userCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 16,
  },
  userCardTop: { flexDirection: "row", alignItems: "center", padding: 16, gap: 12 },
  avatarWrapper: { position: "relative" },
  avatar: { width: 60, height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#fff", fontWeight: "800", fontSize: 20 },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#1C1C1C",
  },
  userInfo: { flex: 1 },
  userName: { fontSize: 18, fontWeight: "700", marginBottom: 2 },
  userHandle: { fontSize: 13, marginBottom: 4 },
  memberRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  memberText: { fontSize: 11, fontWeight: "600" },
  editBtn: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  editBtnText: { fontSize: 13, fontWeight: "600" },
  statsRow: { flexDirection: "row", borderTopWidth: 1, paddingVertical: 12 },
  statItem: { flex: 1, alignItems: "center", paddingVertical: 4 },
  statValue: { fontSize: 20, fontWeight: "800" },
  statLabel: { fontSize: 11, marginTop: 2, fontWeight: "600" },
  statDivider: { width: 1, marginVertical: 4 },
  creatorCard: {
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  creatorLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  creatorTitle: { fontSize: 14, fontWeight: "700" },
  creatorSub: { fontSize: 12, marginTop: 1 },
  creatorBtn: {
    backgroundColor: "#FF6B00",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  creatorBtnText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  menuSection: {
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  menuIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: { flex: 1, fontSize: 15 },
  signOutBtn: {
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    marginBottom: 16,
  },
  signOutText: { color: "#D32F2F", fontSize: 15, fontWeight: "600" },
  version: { fontSize: 11, textAlign: "center", marginBottom: 8 },
});
