import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useEventCatalog } from "@/hooks/useEventCatalog";
import { EventCardHero } from "@/components/EventCardHero";

export default function CategoryBrowseScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { events } = useEventCatalog();

  const [activeCity, setActiveCity] = useState("all");
  const [activePrice, setActivePrice] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const resolvedCategory = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : "Music";

  const hubs = [
    { id: "all", label: "🌍 Global" },
    { id: "Lagos", label: "🇳🇬 Lagos" },
    { id: "London", label: "🇬🇧 London" },
    { id: "Nairobi", label: "🇰🇪 Nairobi" },
    { id: "Toronto", label: "🇨🇦 Toronto" },
    { id: "New York", label: "🇺🇸 NYC" },
    { id: "Accra", label: "🇬🇭 Accra" },
  ];

  const filteredEvents = events.filter((e) => {
    const matchesCat =
      resolvedCategory === "All" ||
      e.category.toLowerCase() === resolvedCategory.toLowerCase() ||
      (resolvedCategory === "Music" && (e.category === "Nightlife"));

    const matchesCity = activeCity === "all" || e.city.toLowerCase() === activeCity.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.venue.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPrice =
      activePrice === "all" ||
      (activePrice === "free" && e.price === 0) ||
      (activePrice === "paid" && e.price > 0);

    return matchesCat && matchesCity && matchesSearch && matchesPrice;
  });

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
          <View style={styles.titleCol}>
            <Text style={styles.headerTitle}>{resolvedCategory} Events</Text>
            <Text style={styles.headerSubtitle}>{filteredEvents.length} happenings found</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* In-category Search Bar */}
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color="#888888" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.searchInput}
            placeholder={`Search ${resolvedCategory.toLowerCase()} events, DJs, venues...`}
            placeholderTextColor="#666666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {!!searchQuery && (
            <Pressable onPress={() => setSearchQuery("")}>
              <Feather name="x" size={16} color="#888888" />
            </Pressable>
          )}
        </View>

        {/* Global Diaspora Hub Filter Bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hubScroll}
        >
          {hubs.map((hub) => (
            <Pressable
              key={hub.id}
              style={[
                styles.hubPill,
                activeCity === hub.id && styles.hubPillActive,
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                setActiveCity(hub.id);
              }}
            >
              <Text
                style={[
                  styles.hubPillText,
                  activeCity === hub.id && styles.hubPillTextActive,
                ]}
              >
                {hub.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Quick Price Filters */}
        <View style={styles.filterRow}>
          <Pressable
            style={[styles.filterChip, activePrice === "all" && styles.filterChipActive]}
            onPress={() => {
              Haptics.selectionAsync();
              setActivePrice("all");
            }}
          >
            <Text style={[styles.filterChipText, activePrice === "all" && styles.filterChipTextActive]}>
              All Prices
            </Text>
          </Pressable>
          <Pressable
            style={[styles.filterChip, activePrice === "free" && styles.filterChipActive]}
            onPress={() => {
              Haptics.selectionAsync();
              setActivePrice("free");
            }}
          >
            <Text style={[styles.filterChipText, activePrice === "free" && styles.filterChipTextActive]}>
              Free RSVP
            </Text>
          </Pressable>
          <Pressable
            style={[styles.filterChip, activePrice === "paid" && styles.filterChipActive]}
            onPress={() => {
              Haptics.selectionAsync();
              setActivePrice("paid");
            }}
          >
            <Text style={[styles.filterChipText, activePrice === "paid" && styles.filterChipTextActive]}>
              Ticketed
            </Text>
          </Pressable>
        </View>

        {/* Events Feed */}
        <View style={styles.eventsGrid}>
          {filteredEvents.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Feather name="calendar" size={40} color="#333333" />
              <Text style={styles.emptyTitle}>No events match your filter</Text>
              <Text style={styles.emptySub}>
                Try selecting "Global" hub or reset price filters to see more events.
              </Text>
              <Pressable
                style={styles.resetBtn}
                onPress={() => {
                  setActiveCity("all");
                  setActivePrice("all");
                  setSearchQuery("");
                }}
              >
                <Text style={styles.resetBtnText}>Reset Filters</Text>
              </Pressable>
            </View>
          ) : (
            filteredEvents.map((evt) => (
              <EventCardHero
                key={evt.id}
                event={evt}
              />
            ))
          )}
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
  titleCol: {
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },
  headerSubtitle: {
    color: "#FF6B00",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 2,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    backgroundColor: "#161616",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#262626",
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  hubScroll: {
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 12,
  },
  hubPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#181818",
    borderWidth: 1,
    borderColor: "#262626",
  },
  hubPillActive: {
    backgroundColor: "#FF6B00",
    borderColor: "#FF6B00",
  },
  hubPillText: {
    color: "#888888",
    fontSize: 12,
    fontWeight: "700",
  },
  hubPillTextActive: {
    color: "#FFFFFF",
  },
  filterRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#161616",
    borderWidth: 1,
    borderColor: "#282828",
  },
  filterChipActive: {
    borderColor: "#FF6B00",
    backgroundColor: "rgba(255,107,0,0.15)",
  },
  filterChipText: {
    color: "#777777",
    fontSize: 11,
    fontWeight: "700",
  },
  filterChipTextActive: {
    color: "#FF6B00",
  },
  eventsGrid: {
    marginHorizontal: 20,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 12,
  },
  emptySub: {
    color: "#777777",
    fontSize: 12,
    textAlign: "center",
    marginTop: 6,
    paddingHorizontal: 30,
    lineHeight: 18,
  },
  resetBtn: {
    backgroundColor: "#222222",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#333333",
  },
  resetBtnText: {
    color: "#FF6B00",
    fontSize: 13,
    fontWeight: "800",
  },
});
