import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Svg, {
  Circle,
  G,
  Line,
  Path,
  Rect,
  Text as SvgText,
} from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EventCardCompact } from "@/components/EventCardCompact";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { useEventCatalog } from "@/hooks/useEventCatalog";
import { EA_COUNTRIES } from "@/constants/currencies";
import type { Event } from "@/constants/data";

const { width } = Dimensions.get("window");
const MAP_W = width - 32;
const MAP_H = 260;

// ── Map pins, computed from real events ─────────────────────────────────────
//
// Map pins used to come from CITY_PINS, a hardcoded per-country lookup with
// invented labels ("Live Music Tonight") that never matched any real event
// and never moved when the category filter changed — confirmed live during
// the UX audit. Pins are now derived from whatever `useEventCatalog()`
// actually returned for the currently-filtered set, so the label on a pin is
// always a real event title and the pins respond to every filter on this
// screen exactly like the event list underneath them.

interface EventPin {
  x: number;
  y: number;
  label: string;
  icon: string;
  eventId: string;
}

const CATEGORY_ICON: Record<string, string> = {
  Music: "music",
  Art: "image",
  Food: "coffee",
  Heritage: "globe",
  Comedy: "smile",
  Sports: "activity",
  Nightlife: "moon",
};

// Deterministic hash so a given event's pin sits in the same spot on every
// render/refresh instead of jittering around — there's no real lat/long for
// map placement, so position is a stable pseudo-random layout derived from
// the event's own id rather than anything invented on the spot.
function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  return h;
}

function truncateLabel(label: string, max = 22): string {
  return label.length > max ? `${label.slice(0, max - 1)}…` : label;
}

function eventsToPins(events: Event[], max = 6): EventPin[] {
  return events.slice(0, max).map((e) => {
    const hash = hashId(e.id);
    // Keep pins away from the very edge (0.12–0.88) so labels don't clip.
    const x = 0.12 + ((hash % 1000) / 1000) * 0.76;
    const y = 0.12 + (((hash >>> 10) % 1000) / 1000) * 0.76;
    return {
      x,
      y,
      label: truncateLabel(e.title),
      icon: CATEGORY_ICON[e.category] ?? "map-pin",
      eventId: e.id,
    };
  });
}

// ── Stylised city SVG map ────────────────────────────────────────────────────

interface CityMapProps {
  pins: EventPin[];
  cityName: string;
  onPressPin: (eventId: string) => void;
}

function CityMap({ pins, cityName, onPressPin }: CityMapProps) {
  const cx = MAP_W / 2;
  const cy = MAP_H / 2;

  return (
    <Svg width={MAP_W} height={MAP_H}>
      {/* Background */}
      <Rect x={0} y={0} width={MAP_W} height={MAP_H} fill="#0D0D0D" />

      {/* Outer ring glow */}
      <Circle cx={cx} cy={cy} r={115} stroke="#FF6B00" strokeWidth={0.5} strokeOpacity={0.15} fill="none" />
      <Circle cx={cx} cy={cy} r={85} stroke="#FF6B00" strokeWidth={0.3} strokeOpacity={0.1} fill="none" />
      <Circle cx={cx} cy={cy} r={55} stroke="#FF6B00" strokeWidth={0.2} strokeOpacity={0.08} fill="none" />

      {/* Street grid — horizontal lines */}
      {Array.from({ length: 8 }).map((_, i) => {
        const y = (MAP_H / 9) * (i + 1);
        return <Line key={`h${i}`} x1={0} y1={y} x2={MAP_W} y2={y} stroke="#1C1C1C" strokeWidth={0.8} />;
      })}
      {/* Street grid — vertical lines */}
      {Array.from({ length: 7 }).map((_, i) => {
        const x = (MAP_W / 8) * (i + 1);
        return <Line key={`v${i}`} x1={x} y1={0} x2={x} y2={MAP_H} stroke="#1C1C1C" strokeWidth={0.8} />;
      })}

      {/* Radial roads */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x2 = cx + Math.cos(rad) * 160;
        const y2 = cy + Math.sin(rad) * 160;
        return (
          <Line
            key={`r${deg}`}
            x1={cx}
            y1={cy}
            x2={x2}
            y2={y2}
            stroke="#222"
            strokeWidth={1.5}
          />
        );
      })}

      {/* CBD centre area */}
      <Circle cx={cx} cy={cy} r={20} fill="#161606" stroke="#FF6B0020" strokeWidth={1} />

      {/* City name */}
      <SvgText x={cx} y={cy + 5} fontSize={7} fill="#FF6B0055" textAnchor="middle" fontWeight="bold">
        {cityName.toUpperCase()}
      </SvgText>

      {/* Event pins */}
      {pins.map((pin, i) => {
        const px = pin.x * MAP_W;
        const py = pin.y * MAP_H;
        const isPrimary = i === 0;

        return (
          <G key={pin.eventId} onPress={() => onPressPin(pin.eventId)}>
            {/* Outer glow */}
            <Circle cx={px} cy={py} r={isPrimary ? 22 : 18} fill="#FF6B00" fillOpacity={isPrimary ? 0.08 : 0.05} />
            {/* Pin circle */}
            <Circle cx={px} cy={py} r={isPrimary ? 14 : 11} fill="#FF6B00" fillOpacity={isPrimary ? 0.25 : 0.15} stroke="#FF6B00" strokeWidth={1} strokeOpacity={0.6} />
            <Circle cx={px} cy={py} r={isPrimary ? 6 : 5} fill="#FF6B00" />
            {/* Label bg */}
            <Rect
              x={px + 16}
              y={py - 10}
              width={pin.label.length * 5.2 + 8}
              height={20}
              rx={4}
              fill="#1A1A1A"
              stroke="#2A2A2A"
              strokeWidth={0.5}
            />
            <SvgText x={px + 20} y={py + 3} fontSize={8} fill="#E0E0E0" fontWeight="600">
              {pin.label}
            </SvgText>
          </G>
        );
      })}
    </Svg>
  );
}

// ── Main Screen ──────────────────────────────────────────────────────────────

const CATEGORY_FILTERS = ["For You", "Music", "Art", "Food", "Heritage", "More"] as const;
type CategoryFilter = (typeof CATEGORY_FILTERS)[number];

type DatePreset = "any" | "today" | "week" | "month";

const DATE_PRESETS: { id: DatePreset; label: string }[] = [
  { id: "any", label: "Any date" },
  { id: "today", label: "Today" },
  { id: "week", label: "This week" },
  { id: "month", label: "This month" },
];

function toLocalISODate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function withinDatePreset(dateStr: string, preset: DatePreset): boolean {
  if (preset === "any") return true;
  const now = new Date();
  const today = toLocalISODate(now);
  if (preset === "today") return dateStr === today;
  const end = new Date(now);
  if (preset === "week") end.setDate(end.getDate() + 7);
  if (preset === "month") end.setMonth(end.getMonth() + 1);
  return dateStr >= today && dateStr <= toLocalISODate(end);
}

export default function CultureCompassScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { userCountry, setUserCountry } = useApp();
  const [selectedCat, setSelectedCat] = useState<CategoryFilter>("For You");
  const [showCityPicker, setShowCityPicker] = useState(false);
  // Filters button used to have no onPress handler at all — confirmed dead
  // on live audit. It now toggles this panel, which reuses the exact same
  // category-chip filter state above (selectedCat) plus date/price, all
  // feeding the one `filtered` list that drives both the map pins and the
  // event list below — the same filtering pattern the rest of this screen
  // already uses, not a new one bolted on for this panel.
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [datePreset, setDatePreset] = useState<DatePreset>("any");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const { events } = useEventCatalog();

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 44) : insets.top;

  const cityName = userCountry.name.split(" ")[0]; // "Nairobi" from "Nairobi CBD"

  const priceMinNum = priceMin.trim() !== "" && !Number.isNaN(Number(priceMin)) ? Number(priceMin) : undefined;
  const priceMaxNum = priceMax.trim() !== "" && !Number.isNaN(Number(priceMax)) ? Number(priceMax) : undefined;
  const activeFilterCount =
    (datePreset !== "any" ? 1 : 0) + (priceMinNum !== undefined || priceMaxNum !== undefined ? 1 : 0);

  const filtered = useMemo(() => {
    return events.filter((e) => {
      const matchesCat = selectedCat === "For You" || selectedCat === "More" || e.category === selectedCat;
      const matchesDate = withinDatePreset(e.date, datePreset);
      const matchesPrice =
        (priceMinNum === undefined || e.price >= priceMinNum) &&
        (priceMaxNum === undefined || e.price <= priceMaxNum);
      return matchesCat && matchesDate && matchesPrice;
    });
  }, [events, selectedCat, datePreset, priceMinNum, priceMaxNum]);

  // Real pins, derived from whatever `filtered` actually contains — no
  // fabricated labels, and they shrink/grow with every filter above exactly
  // like the event cards below do.
  const pins = useMemo(() => eventsToPins(filtered), [filtered]);

  const clearFilters = () => {
    setDatePreset("any");
    setPriceMin("");
    setPriceMax("");
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
        {/* ── Header ── */}
        <View style={[styles.header, { paddingTop: topPad + 8 }]}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={20} color={colors.foreground} />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>
              Culture{" "}
              <Text style={{ color: "#FF6B00" }}>Compass</Text>
            </Text>
            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                setShowCityPicker((v) => !v);
              }}
              style={styles.citySelector}
            >
              <Feather name="map-pin" size={12} color={colors.mutedForeground} />
              <Text style={[styles.citySelectorText, { color: colors.mutedForeground }]}>
                {userCountry.name}
              </Text>
              <Feather name="chevron-down" size={12} color={colors.mutedForeground} />
            </Pressable>
          </View>
          <Pressable
            onPress={() => {
              Haptics.selectionAsync();
              setShowFilterPanel((v) => !v);
            }}
            style={[
              styles.filterBtn,
              {
                backgroundColor: activeFilterCount > 0 ? "rgba(255,107,0,0.1)" : colors.muted,
                borderColor: activeFilterCount > 0 ? "#FF6B00" : colors.border,
              },
            ]}
            accessibilityLabel="Toggle date and price filters"
            accessibilityRole="button"
          >
            <Feather name="sliders" size={14} color={activeFilterCount > 0 ? "#FF6B00" : colors.mutedForeground} />
            <Text style={[styles.filterBtnText, { color: activeFilterCount > 0 ? "#FF6B00" : colors.mutedForeground }]}>
              Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
            </Text>
          </Pressable>
        </View>

        {/* ── Filter Panel ── */}
        {showFilterPanel && (
          <View style={[styles.filterPanel, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.filterLabel, { color: colors.mutedForeground }]}>Date</Text>
            <View style={styles.filterChipRow}>
              {DATE_PRESETS.map((preset) => {
                const active = datePreset === preset.id;
                return (
                  <Pressable
                    key={preset.id}
                    onPress={() => { Haptics.selectionAsync(); setDatePreset(preset.id); }}
                    style={[
                      styles.dateChip,
                      {
                        backgroundColor: active ? "#FF6B00" : colors.muted,
                        borderColor: active ? "#FF6B00" : colors.border,
                      },
                    ]}
                    accessibilityLabel={preset.label}
                    accessibilityRole="button"
                  >
                    <Text style={[styles.dateChipText, { color: active ? "#fff" : colors.mutedForeground }]}>
                      {preset.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.filterLabel, { color: colors.mutedForeground, marginTop: 14 }]}>
              Price ({userCountry.currencyCode})
            </Text>
            <View style={styles.priceRow}>
              <TextInput
                value={priceMin}
                onChangeText={setPriceMin}
                placeholder="Min"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="numeric"
                style={[styles.priceInput, { backgroundColor: colors.muted, borderColor: colors.border, color: colors.foreground }]}
              />
              <Text style={{ color: colors.mutedForeground }}>–</Text>
              <TextInput
                value={priceMax}
                onChangeText={setPriceMax}
                placeholder="Max"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="numeric"
                style={[styles.priceInput, { backgroundColor: colors.muted, borderColor: colors.border, color: colors.foreground }]}
              />
            </View>

            {activeFilterCount > 0 && (
              <Pressable
                onPress={() => { Haptics.selectionAsync(); clearFilters(); }}
                style={styles.clearFiltersBtn}
                accessibilityLabel="Clear date and price filters"
                accessibilityRole="button"
              >
                <Feather name="x-circle" size={12} color="#FF6B00" />
                <Text style={styles.clearFiltersText}>Clear filters</Text>
              </Pressable>
            )}
          </View>
        )}

        {/* ── City Picker Dropdown ── */}
        {showCityPicker && (
          <ScrollView
            style={[styles.cityDropdown, { backgroundColor: colors.card, borderColor: colors.border }]}
            nestedScrollEnabled
          >
            {EA_COUNTRIES.map((c) => (
              <Pressable
                key={c.code}
                onPress={() => {
                  Haptics.selectionAsync();
                  setUserCountry(c);
                  setShowCityPicker(false);
                }}
                style={[
                  styles.cityOption,
                  {
                    backgroundColor: c.code === userCountry.code ? "rgba(255,107,0,0.1)" : "transparent",
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <Text style={{ fontSize: 20 }}>{c.flag}</Text>
                <Text style={[styles.cityOptionName, { color: colors.foreground }]}>{c.name}</Text>
                {c.code === userCountry.code && (
                  <Feather name="check" size={14} color="#FF6B00" />
                )}
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* ── City Map ── */}
        <View style={[styles.mapContainer, { borderColor: colors.border }]}>
          <CityMap
            pins={pins}
            cityName={cityName}
            onPressPin={(eventId) => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push(`/event/${eventId}`);
            }}
          />
          {/* No events matching the current filters — an empty map beats one
              with fabricated pins standing in for events that don't exist. */}
          {pins.length === 0 && (
            <View style={styles.mapEmptyOverlay} pointerEvents="none">
              <Feather name="map-pin" size={22} color="#555" />
              <Text style={styles.mapEmptyText}>No events match your filters</Text>
            </View>
          )}
        </View>

        {/* ── Category Filters ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catScrollContent}
          style={styles.catScroll}
        >
          {CATEGORY_FILTERS.map((cat) => {
            const active = selectedCat === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedCat(cat);
                }}
                style={[
                  styles.catChip,
                  {
                    backgroundColor: active ? "#FF6B00" : colors.muted,
                    borderColor: active ? "#FF6B00" : colors.border,
                  },
                ]}
              >
                {cat === "For You" && (
                  <Feather name="zap" size={12} color={active ? "#fff" : colors.mutedForeground} />
                )}
                <Text style={[styles.catChipText, { color: active ? "#fff" : colors.mutedForeground }]}>
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* ── Event Cards ── */}
        <View style={styles.eventsSection}>
          <View style={styles.eventsHeader}>
            <Text style={[styles.eventsTitle, { color: colors.foreground }]}>
              {filtered.length} events near you
            </Text>
          </View>

          {/* Horizontal scroll row */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsScroll}
          >
            {filtered.slice(0, 8).map((event) => (
              <View key={event.id} style={styles.cardWrapper}>
                <EventCardCompact event={event} />
              </View>
            ))}
          </ScrollView>

          {/* Vertical list below */}
          <View style={styles.verticalList}>
            {filtered.slice(8).map((event) => (
              <EventCardCompact key={event.id} event={event} horizontal />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 10,
  },
  backBtn: { padding: 4, marginTop: 2 },
  headerCenter: { flex: 1, gap: 4 },
  headerTitle: { fontSize: 22, fontWeight: "900" },
  citySelector: { flexDirection: "row", alignItems: "center", gap: 4 },
  citySelectorText: { fontSize: 13 },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    flexShrink: 0,
    marginTop: 4,
  },
  filterBtnText: { fontSize: 12, fontWeight: "600" },

  filterPanel: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  filterLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 8 },
  filterChipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  dateChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
  },
  dateChipText: { fontSize: 12, fontWeight: "600" },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  priceInput: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
  },
  clearFiltersBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 14,
    alignSelf: "flex-start",
  },
  clearFiltersText: { color: "#FF6B00", fontSize: 12, fontWeight: "700" },

  cityDropdown: {
    maxHeight: 200,
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
  cityOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
  },
  cityOptionName: { flex: 1, fontSize: 14, fontWeight: "600" },

  mapContainer: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    position: "relative",
    marginBottom: 16,
  },
  mapEmptyOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(13,13,13,0.55)",
  },
  mapEmptyText: { color: "#999", fontSize: 12, fontWeight: "600" },
  locateBtn: {
    position: "absolute",
    bottom: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },

  catScroll: { marginBottom: 16 },
  catScrollContent: { paddingHorizontal: 16, gap: 8, flexDirection: "row" },
  catChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  catChipText: { fontSize: 13, fontWeight: "700" },

  eventsSection: { paddingHorizontal: 16 },
  eventsHeader: { marginBottom: 12 },
  eventsTitle: { fontSize: 15, fontWeight: "700" },
  cardsScroll: { gap: 12, paddingRight: 16 },
  cardWrapper: { width: 200 },
  verticalList: { gap: 10, marginTop: 12 },
});
