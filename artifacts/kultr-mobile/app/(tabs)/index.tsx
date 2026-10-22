import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState, useMemo } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EventCardCompact } from "@/components/EventCardCompact";
import { EventCardHero } from "@/components/EventCardHero";
import { CATEGORIES, EVENT_IMAGES, getDaysUntil } from "@/constants/data";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { useEventCatalog } from "@/hooks/useEventCatalog";
import { useMyNotifications } from "@/hooks/useNotifications";

const { width } = Dimensions.get("window");

const CATEGORY_ICONS: Record<string, string> = {
  "For You": "star",
  Music: "music",
  Art: "aperture",
  Food: "coffee",
  Heritage: "flag",
  Comedy: "smile",
  Sports: "zap",
  Nightlife: "moon",
};

export const DIASPORA_HUBS = [
  { id: "all", name: "Global Diaspora", flag: "🌍", subtitle: "All Cultural Capitals" },
  { id: "London", name: "London", flag: "🇬🇧", subtitle: "United Kingdom" },
  { id: "New York", name: "New York", flag: "🇺🇸", subtitle: "United States" },
  { id: "Toronto", name: "Toronto", flag: "🇨🇦", subtitle: "Canada" },
  { id: "Paris", name: "Paris", flag: "🇫🇷", subtitle: "France" },
  { id: "Lagos", name: "Lagos", flag: "🇳🇬", subtitle: "Nigeria" },
  { id: "Accra", name: "Accra", flag: "🇬🇭", subtitle: "Ghana" },
  { id: "Kingston", name: "Kingston", flag: "🇯🇲", subtitle: "Jamaica" },
  { id: "Portimão", name: "Portugal", flag: "🇵🇹", subtitle: "Afro Nation" },
  { id: "Nairobi", name: "Nairobi", flag: "🇰🇪", subtitle: "Kenya" },
];

const VIBE_TRIBES_PREVIEW = [
  { id: "afrobeats", name: "Afrobeats Nation", emoji: "🎶", count: "12.5K", color: "#FF6B00" },
  { id: "amapiano", name: "Amapiano Movement", emoji: "🎹", count: "8.9K", color: "#7B61FF" },
  { id: "carnival", name: "Soca & Carnival", emoji: "🎭", count: "7.1K", color: "#00C853" },
  { id: "foodies", name: "Jollof & Nyama", emoji: "🍖", count: "6.2K", color: "#FFA726" },
  { id: "fashion", name: "Diaspora Runway", emoji: "👗", count: "5.8K", color: "#4F9DFF" },
  { id: "art", name: "Canvas Collective", emoji: "🎨", count: "4.5K", color: "#E1306C" },
];

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 5) return "Good night";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [selectedHub, setSelectedHub] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("For You");
  const { events, isLoading } = useEventCatalog();
  const { authUser, userCountry } = useApp();
  const { data: notifData } = useMyNotifications();
  const hasUnread = (notifData?.unreadCount ?? 0) > 0;
  const avatarInitial = authUser?.displayName?.trim()?.[0]?.toUpperCase();

  // Filter by diaspora hub if one is selected
  const hubFilteredEvents = useMemo(() => {
    if (selectedHub === "all") return events;
    return events.filter(
      (e) =>
        e.city.toLowerCase() === selectedHub.toLowerCase() ||
        e.country.toLowerCase().includes(selectedHub.toLowerCase()),
    );
  }, [events, selectedHub]);

  const featured = useMemo(() => {
    const list = hubFilteredEvents.filter((e) => e.featured);
    return list.length > 0 ? list : hubFilteredEvents.slice(0, 4);
  }, [hubFilteredEvents]);

  const soonest = useMemo(() => {
    return hubFilteredEvents
      .filter((e) => getDaysUntil(e.date) >= 0)
      .sort((a, b) => getDaysUntil(a.date) - getDaysUntil(b.date));
  }, [hubFilteredEvents]);

  const thisWeekend = soonest.slice(0, 4);

  // Global Diaspora trending events
  const diasporaHighlights = useMemo(() => {
    return events.filter((e) =>
      ["United Kingdom", "United States", "Canada", "Jamaica", "Portugal", "France", "Nigeria", "Ghana"].includes(
        e.country ?? "",
      ),
    ).slice(0, 6);
  }, [events]);

  const displayed = useMemo(() => {
    if (selectedCategory === "For You") return hubFilteredEvents;
    return hubFilteredEvents.filter((e) => e.category === selectedCategory);
  }, [hubFilteredEvents, selectedCategory]);

  const activeHubInfo = DIASPORA_HUBS.find((h) => h.id === selectedHub) ?? DIASPORA_HUBS[0];
  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
    >
      {/* ── HERO HEADER ── */}
      <View style={[styles.heroHeader, { paddingTop: topPad + 8 }]}>
        {/* African & Caribbean pattern strip */}
        <View style={styles.patternStrip}>
          {Array.from({ length: 40 }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.patternCell,
                { backgroundColor: i % 3 === 0 ? "#FF6B00" : i % 3 === 1 ? "#1C1C1C" : "#2A2A2A" },
              ]}
            />
          ))}
        </View>

        {/* Nav row */}
        <View style={styles.navRow}>
          <Image
            source={require("@/assets/images/logo-wordmark.png")}
            style={styles.logoWordmark}
            resizeMode="contain"
          />
          <View style={styles.navActions}>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push("/culture-compass" as any);
              }}
              style={styles.navBtn}
              accessibilityLabel="Culture Compass Map"
              accessibilityRole="button"
            >
              <Feather name="compass" size={17} color="#ccc" />
            </Pressable>
            <Pressable
              onPress={() => router.push("/notifications")}
              style={styles.navBtn}
              accessibilityLabel="Notifications"
              accessibilityRole="button"
            >
              <Feather name="bell" size={17} color="#ccc" />
              {hasUnread && <View style={styles.notifDot} />}
            </Pressable>
            <Pressable
              onPress={() => router.push("/(tabs)/profile")}
              style={styles.avatar}
              accessibilityLabel="Profile"
              accessibilityRole="button"
            >
              {avatarInitial ? (
                <Text style={styles.avatarText}>{avatarInitial}</Text>
              ) : (
                <Feather name="user" size={16} color="#fff" />
              )}
            </Pressable>
          </View>
        </View>

        {/* Big Diaspora Greeting */}
        <View style={styles.greetingBlock}>
          <View style={styles.taglineRow}>
            <Text style={styles.taglinePill}>AFRICA & THE CARIBBEAN TO THE WORLD</Text>
          </View>
          <Text style={styles.greetingSmall}>
            {getTimeGreeting()} · {activeHubInfo.flag} {activeHubInfo.name}
          </Text>
          <Text style={styles.greetingBig} numberOfLines={2}>
            {"The global pulse of\n"}
            <Text style={{ color: "#FF6B00", fontStyle: "italic" }}>diaspora culture</Text>
          </Text>
        </View>

        {/* ── DIASPORA CITY HUB SWITCHER ── */}
        <View style={styles.hubSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hubScroll}
          >
            {DIASPORA_HUBS.map((hub) => {
              const active = selectedHub === hub.id;
              return (
                <Pressable
                  key={hub.id}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setSelectedHub(hub.id);
                  }}
                  style={[
                    styles.hubPill,
                    {
                      backgroundColor: active ? "#FF6B00" : "#1C1C1C",
                      borderColor: active ? "#FF6B00" : "#2A2A2A",
                    },
                  ]}
                  accessibilityLabel={`Filter by ${hub.name}`}
                  accessibilityRole="button"
                >
                  <Text style={styles.hubFlag}>{hub.flag}</Text>
                  <Text style={[styles.hubLabel, { color: active ? "#fff" : "#999" }]}>
                    {hub.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Category pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            const icon = CATEGORY_ICONS[cat] ?? "circle";
            return (
              <Pressable
                key={cat}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedCategory(cat);
                }}
                style={[
                  styles.categoryPill,
                  {
                    backgroundColor: active ? "rgba(255,107,0,0.2)" : "#141414",
                    borderColor: active ? "#FF6B00" : "#222",
                  },
                ]}
                accessibilityLabel={cat}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Feather name={icon as any} size={12} color={active ? "#FF6B00" : "#666"} />
                <Text style={[styles.categoryLabel, { color: active ? "#FF6B00" : "#888" }]}>
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* ── FILTERED CATEGORY VIEW ── */}
      {isLoading && events.length === 0 ? (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color="#FF6B00" />
        </View>
      ) : selectedCategory !== "For You" ? (
        <View style={styles.filteredSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>{selectedCategory.toUpperCase()}</Text>
            <Text style={{ color: "#888", fontSize: 13 }}>
              {displayed.length} event{displayed.length !== 1 ? "s" : ""}
            </Text>
          </View>
          {displayed.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="calendar" size={36} color="#333" />
              <Text style={{ color: "#888", fontSize: 15, marginTop: 8 }}>
                No {selectedCategory} events in {activeHubInfo.name}
              </Text>
              {selectedHub !== "all" && (
                <Pressable
                  onPress={() => setSelectedHub("all")}
                  style={styles.resetHubBtn}
                >
                  <Text style={styles.resetHubBtnText}>Show all global events</Text>
                </Pressable>
              )}
            </View>
          ) : (
            displayed.map((event) => (
              <View key={event.id} style={{ paddingHorizontal: 16 }}>
                <EventCardCompact event={event} horizontal />
              </View>
            ))
          )}
        </View>
      ) : (
        <>
          {/* ── FEATURED ON STAGE ── */}
          <View style={styles.featuredSection}>
            <SectionTitle
              label={selectedHub === "all" ? "GLOBAL HEADLINERS" : `FEATURED IN ${selectedHub.toUpperCase()}`}
              accent="Major Stage"
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={width - 32 + 14}
              decelerationRate="fast"
              contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}
            >
              {featured.map((item) => (
                <EventCardHero key={item.id} event={item} />
              ))}
            </ScrollView>
          </View>

          {/* ── VIBE TRIBES COMMUNITY BAR ── */}
          <View style={styles.section}>
            <SectionTitle
              label="VIBE TRIBES"
              accent="Find Your Crowd"
              onSeeAll={() => router.push("/vibe-tribes" as any)}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
            >
              {VIBE_TRIBES_PREVIEW.map((tribe) => (
                <Pressable
                  key={tribe.id}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push("/vibe-tribes" as any);
                  }}
                  style={[styles.tribeCard, { backgroundColor: "#161616", borderColor: "#262626" }]}
                >
                  <Text style={styles.tribeEmoji}>{tribe.emoji}</Text>
                  <Text style={[styles.tribeName, { color: colors.foreground }]}>{tribe.name}</Text>
                  <View style={styles.tribeMeta}>
                    <Feather name="users" size={10} color="#777" />
                    <Text style={styles.tribeMembers}>{tribe.count} members</Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* ── HAPPENING SOON BENTO GRID ── */}
          {thisWeekend.length > 0 && (
            <View style={styles.section}>
              <SectionTitle label="HAPPENING SOON" accent="Next 60 Days" />
              <View style={styles.bentoGrid}>
                {thisWeekend.map((event, i) => {
                  const daysUntil = getDaysUntil(event.date);
                  const image = EVENT_IMAGES[event.imageKey];
                  const isBig = i === 0;
                  return (
                    <Pressable
                      key={event.id}
                      onPress={() => router.push(`/event/${event.id}`)}
                      style={({ pressed }) => [
                        styles.bentoCard,
                        isBig ? styles.bentoLarge : styles.bentoSmall,
                        { opacity: pressed ? 0.9 : 1 },
                      ]}
                    >
                      <Image
                        source={image as any}
                        style={StyleSheet.absoluteFillObject}
                        resizeMode="cover"
                      />
                      <LinearGradient
                        colors={["transparent", "rgba(0,0,0,0.95)"]}
                        style={StyleSheet.absoluteFillObject}
                      />
                      <View style={styles.dayBadge}>
                        <Text style={styles.dayNum}>
                          {daysUntil === 0 ? "TODAY" : daysUntil === 1 ? "TMRW" : `${daysUntil}d`}
                        </Text>
                      </View>
                      <View style={styles.bentoContent}>
                        <View style={styles.bentoCat}>
                          <Text style={styles.bentoCatText}>{event.category.toUpperCase()}</Text>
                        </View>
                        <Text
                          style={[styles.bentoTitle, isBig ? styles.bentoTitleLg : styles.bentoTitleSm]}
                          numberOfLines={2}
                        >
                          {event.title}
                        </Text>
                        {isBig && (
                          <Text style={styles.bentoMeta}>
                            {event.venue} · {event.city}
                          </Text>
                        )}
                        <Text style={styles.bentoPrice}>
                          {event.currencySymbol} {event.price.toLocaleString()}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* ── GLOBAL DIASPORA TRENDING ── */}
          {diasporaHighlights.length > 0 && (
            <View style={styles.section}>
              <SectionTitle
                label="TRENDING ACROSS THE DIASPORA"
                accent="✈️ Worth Traveling For"
                onSeeAll={() => router.push("/(tabs)/discover" as any)}
              />
              {diasporaHighlights.map((event) => (
                <View key={event.id} style={{ paddingHorizontal: 16 }}>
                  <EventCardCompact event={event} horizontal />
                </View>
              ))}
            </View>
          )}

          {/* ── CULTURAL CAPITALS QUICK BROWSE ── */}
          <View style={styles.section}>
            <SectionTitle label="EXPLORE CULTURAL CAPITALS" accent="12+ Global Hubs" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
            >
              {DIASPORA_HUBS.filter((h) => h.id !== "all").map((hub) => (
                <Pressable
                  key={hub.id}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setSelectedHub(hub.id);
                  }}
                  style={styles.capitalCard}
                >
                  <Text style={styles.capitalFlag}>{hub.flag}</Text>
                  <Text style={styles.capitalCity}>{hub.name}</Text>
                  <Text style={styles.capitalCountry}>{hub.subtitle}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </>
      )}
    </ScrollView>
  );
}

function SectionTitle({
  label,
  accent,
  onSeeAll,
}: {
  label: string;
  accent?: string;
  onSeeAll?: () => void;
}) {
  return (
    <View style={styles.sectionHeaderRow}>
      <View>
        <Text style={styles.sectionLabel}>{label}</Text>
        {accent && <Text style={styles.sectionAccent}>{accent}</Text>}
      </View>
      {onSeeAll && (
        <Pressable onPress={onSeeAll} style={styles.seeAllBtn}>
          <Text style={styles.seeAllText}>See all</Text>
          <Feather name="arrow-right" size={12} color="#FF6B00" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#111" },

  heroHeader: { paddingBottom: 16 },
  patternStrip: { flexDirection: "row", height: 4, marginBottom: 16 },
  patternCell: { flex: 1 },

  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  logoWordmark: { width: 110, height: 36 },
  navActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1E1E1E",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  notifDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#FF6B00",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FF6B00",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontWeight: "900", fontSize: 16 },

  greetingBlock: { paddingHorizontal: 20, marginBottom: 16 },
  taglineRow: { marginBottom: 6 },
  taglinePill: {
    color: "#FF6B00",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.2,
  },
  greetingSmall: { color: "#888", fontSize: 13, marginBottom: 4 },
  greetingBig: { color: "#fff", fontSize: 26, fontWeight: "900", lineHeight: 32 },

  hubSection: { marginBottom: 12 },
  hubScroll: { paddingHorizontal: 20, gap: 8 },
  hubPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  hubFlag: { fontSize: 14 },
  hubLabel: { fontSize: 12, fontWeight: "700" },

  categoryScroll: { paddingHorizontal: 20, gap: 8 },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryLabel: { fontSize: 11, fontWeight: "700" },

  featuredSection: { marginBottom: 24 },
  section: { marginBottom: 28 },

  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionLabel: { color: "#fff", fontSize: 14, fontWeight: "900", letterSpacing: 1 },
  sectionAccent: { color: "#FF6B00", fontSize: 11, fontWeight: "700", marginTop: 2 },
  seeAllBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  seeAllText: { color: "#FF6B00", fontSize: 12, fontWeight: "700" },

  tribeCard: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    minWidth: 130,
    gap: 4,
  },
  tribeEmoji: { fontSize: 22 },
  tribeName: { fontSize: 13, fontWeight: "800", marginTop: 2 },
  tribeMeta: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 2 },
  tribeMembers: { color: "#777", fontSize: 10, fontWeight: "600" },

  bentoGrid: {
    paddingHorizontal: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  bentoCard: {
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    justifyContent: "flex-end",
    padding: 14,
  },
  bentoLarge: { width: "100%", height: 200 },
  bentoSmall: { width: (width - 52) / 2, height: 160 },
  dayBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  dayNum: { color: "#FF6B00", fontSize: 10, fontWeight: "900" },
  bentoContent: { gap: 3 },
  bentoCat: {
    backgroundColor: "rgba(255,107,0,0.2)",
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 2,
  },
  bentoCatText: { color: "#FF6B00", fontSize: 9, fontWeight: "800" },
  bentoTitle: { color: "#fff", fontWeight: "800" },
  bentoTitleLg: { fontSize: 17 },
  bentoTitleSm: { fontSize: 13 },
  bentoMeta: { color: "#bbb", fontSize: 11 },
  bentoPrice: { color: "#FF6B00", fontSize: 12, fontWeight: "800", marginTop: 2 },

  capitalCard: {
    backgroundColor: "#161616",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#262626",
    alignItems: "center",
    minWidth: 110,
  },
  capitalFlag: { fontSize: 26, marginBottom: 6 },
  capitalCity: { color: "#fff", fontSize: 13, fontWeight: "800" },
  capitalCountry: { color: "#777", fontSize: 10, marginTop: 2 },

  filteredSection: { gap: 12, marginBottom: 24 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  emptyState: { alignItems: "center", paddingVertical: 40, paddingHorizontal: 20 },
  resetHubBtn: {
    marginTop: 12,
    backgroundColor: "#1E1E1E",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  resetHubBtnText: { color: "#FF6B00", fontSize: 12, fontWeight: "700" },
});
