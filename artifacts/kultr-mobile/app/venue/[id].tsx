import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useEventCatalog } from "@/hooks/useEventCatalog";
import { EventCardHero } from "@/components/EventCardHero";

export default function VenueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { events } = useEventCatalog();

  const venueId = id || "alchemist";

  // Mock venue database matching diaspora cultural hotspots
  const venueProfiles: Record<
    string,
    {
      name: string;
      city: string;
      country: string;
      flag: string;
      address: string;
      capacity: number;
      type: string;
      image: string;
      description: string;
      amenities: string[];
      transit: string;
      parking: string;
    }
  > = {
    alchemist: {
      name: "The Alchemist Bar & Stage",
      city: "Nairobi",
      country: "Kenya",
      flag: "🇰🇪",
      address: "Parklands Rd, Westlands, Nairobi",
      capacity: 1200,
      type: "Open-Air Cultural Compound & Nightspot",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
      description:
        "The heartbeat of Nairobi's alternative music, art, and creative diaspora culture. Features two main stages, curated food trucks, and an express Kultr cocktail bar.",
      amenities: ["Outdoor Soundstage", "Kultr Express Bar Lane", "Artisan Food Hall", "Wheelchair Accessible", "Coat Check"],
      transit: "Accessible via Matatu Route 106 or Uber drop-off zone at main gate.",
      parking: "Dedicated secure valet parking available for VIP and KULTR PASS holders.",
    },
    eko: {
      name: "Eko Atlantic Grand Arena",
      city: "Lagos",
      country: "Nigeria",
      flag: "🇳🇬",
      address: "Ahmadu Bello Way, Victoria Island, Lagos",
      capacity: 8500,
      type: "Flagship Oceanside Festival Arena",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80",
      description:
        "West Africa's premier mega-concert venue on the Atlantic coastline. Host to international Afrobeats festivals and headline arena performances.",
      amenities: ["State-of-the-Art Line Array Audio", "VVIP Skyboxes", "Air-Conditioned Lounges", "Dedicated Ride-Share Lane"],
      transit: "Accessible from Ozumba Mbadiwe Ave with dedicated traffic marshals.",
      parking: "Over 2,000 multi-level secure parking spaces on site.",
    },
    roundhouse: {
      name: "Roundhouse Camden",
      city: "London",
      country: "United Kingdom",
      flag: "🇬🇧",
      address: "Chalk Farm Rd, Chalk Farm, London NW1 8EH",
      capacity: 3300,
      type: "Historic Circular Performing Arts Venue",
      image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&auto=format&fit=crop&q=80",
      description:
        "Iconic circular arts venue in North London hosting premier diaspora music festivals, dance showcases, and live concerts.",
      amenities: ["360-Degree Acoustics", "Level Access Across All Floors", "Three Bars", "Cloakroom"],
      transit: "Chalk Farm Underground Station (Northern line) is 2 minutes walk.",
      parking: "Public transport strongly recommended. Limited blue badge parking.",
    },
  };

  const venue = venueProfiles[venueId] || venueProfiles.alchemist;

  const venueEvents = events.filter(
    (e) =>
      e.venue.toLowerCase().includes(venue.name.toLowerCase().split(" ")[0]) ||
      e.city.toLowerCase() === venue.city.toLowerCase(),
  ).slice(0, 4);

  const handleOpenMaps = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const query = encodeURIComponent(`${venue.name}, ${venue.address}`);
    const url = Platform.select({
      ios: `maps:0,0?q=${query}`,
      android: `geo:0,0?q=${query}`,
      default: `https://www.google.com/maps/search/?api=1&query=${query}`,
    });
    Linking.openURL(url);
  };

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 60) : insets.top;
  const bottomPad = Platform.OS === "web" ? Math.max(insets.bottom, 34) : insets.bottom;

  return (
    <View style={[styles.root, { backgroundColor: "#0A0A0A" }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: bottomPad + 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Photo Header */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: venue.image }} style={styles.heroImage} />
          <View style={styles.gradientOverlay} />

          {/* Floating Back Button */}
          <Pressable
            onPress={() => router.back()}
            style={[styles.floatingBackBtn, { top: topPad + 12 }]}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Feather name="arrow-left" size={22} color="#FFFFFF" />
          </Pressable>

          {/* Floating Map Action */}
          <Pressable
            onPress={handleOpenMaps}
            style={[styles.floatingMapBtn, { top: topPad + 12 }]}
            accessibilityLabel="Open venue location in maps"
            accessibilityRole="button"
          >
            <Feather name="map-pin" size={18} color="#FF6B00" />
            <Text style={styles.floatingMapText}>Open Maps</Text>
          </Pressable>

          {/* Venue Hero Identity */}
          <View style={styles.venueIdentityBox}>
            <View style={styles.venueBadgeRow}>
              <View style={styles.verifiedBadge}>
                <Feather name="check-circle" size={12} color="#00E676" />
                <Text style={styles.verifiedText}>VERIFIED VENUE</Text>
              </View>
              <Text style={styles.countryFlagText}>
                {venue.flag} {venue.city}, {venue.country}
              </Text>
            </View>
            <Text style={styles.venueName}>{venue.name}</Text>
            <Text style={styles.venueType}>{venue.type}</Text>
          </View>
        </View>

        {/* Quick Venue Meta Stats */}
        <View style={styles.metaRow}>
          <View style={styles.metaBox}>
            <Feather name="users" size={18} color="#FF6B00" />
            <Text style={styles.metaValue}>{venue.capacity.toLocaleString()}</Text>
            <Text style={styles.metaLabel}>Max Capacity</Text>
          </View>
          <View style={styles.metaBox}>
            <Feather name="coffee" size={18} color="#FFD700" />
            <Text style={styles.metaValue}>Express</Text>
            <Text style={styles.metaLabel}>Bar Lane Active</Text>
          </View>
          <View style={styles.metaBox}>
            <Feather name="shield" size={18} color="#00E676" />
            <Text style={styles.metaValue}>Security</Text>
            <Text style={styles.metaLabel}>Trained Gate Team</Text>
          </View>
        </View>

        {/* About Venue */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>About the Space</Text>
          <Text style={styles.sectionBody}>{venue.description}</Text>

          <Text style={[styles.sectionSubtitle, { marginTop: 16 }]}>Amenities & Features</Text>
          <View style={styles.amenitiesWrap}>
            {venue.amenities.map((item, idx) => (
              <View key={idx} style={styles.amenityChip}>
                <Feather name="check" size={12} color="#FF6B00" />
                <Text style={styles.amenityText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Directions & Logistics */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Getting There</Text>

          <View style={styles.logisticsRow}>
            <Feather name="navigation" size={16} color="#A0A0A0" style={styles.logisticsIcon} />
            <View style={styles.logisticsCol}>
              <Text style={styles.logisticsLabel}>Address</Text>
              <Text style={styles.logisticsValue}>{venue.address}</Text>
            </View>
          </View>

          <View style={styles.logisticsRow}>
            <Feather name="compass" size={16} color="#A0A0A0" style={styles.logisticsIcon} />
            <View style={styles.logisticsCol}>
              <Text style={styles.logisticsLabel}>Public Transit</Text>
              <Text style={styles.logisticsValue}>{venue.transit}</Text>
            </View>
          </View>

          <View style={styles.logisticsRow}>
            <Feather name="truck" size={16} color="#A0A0A0" style={styles.logisticsIcon} />
            <View style={styles.logisticsCol}>
              <Text style={styles.logisticsLabel}>Parking & Ride Share</Text>
              <Text style={styles.logisticsValue}>{venue.parking}</Text>
            </View>
          </View>
        </View>

        {/* Upcoming Events at this Venue */}
        <View style={styles.eventsSection}>
          <View style={styles.eventsSectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            <Text style={styles.eventsCount}>{venueEvents.length} listings</Text>
          </View>

          {venueEvents.length === 0 ? (
            <Text style={styles.noEventsText}>No scheduled events at this venue right now.</Text>
          ) : (
            venueEvents.map((evt) => (
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
  imageContainer: {
    height: 320,
    width: "100%",
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10,10,10,0.55)",
  },
  floatingBackBtn: {
    position: "absolute",
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  floatingMapBtn: {
    position: "absolute",
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: "#333333",
  },
  floatingMapText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  venueIdentityBox: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  venueBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,230,118,0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  verifiedText: {
    color: "#00E676",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  countryFlagText: {
    color: "#CCCCCC",
    fontSize: 12,
    fontWeight: "700",
  },
  venueName: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
  },
  venueType: {
    color: "#A0A0A0",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
  },
  metaRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    gap: 10,
    marginTop: 16,
    marginBottom: 16,
  },
  metaBox: {
    flex: 1,
    backgroundColor: "#161616",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#262626",
    padding: 12,
    alignItems: "center",
  },
  metaValue: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 6,
  },
  metaLabel: {
    color: "#777777",
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
    textAlign: "center",
  },
  sectionCard: {
    marginHorizontal: 20,
    backgroundColor: "#141414",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#222222",
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
  },
  sectionSubtitle: {
    color: "#CCCCCC",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 10,
  },
  sectionBody: {
    color: "#A0A0A0",
    fontSize: 13,
    lineHeight: 20,
  },
  amenitiesWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  amenityChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  amenityText: {
    color: "#DDDDDD",
    fontSize: 12,
    fontWeight: "600",
  },
  logisticsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  logisticsIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  logisticsCol: {
    flex: 1,
  },
  logisticsLabel: {
    color: "#777777",
    fontSize: 11,
    fontWeight: "700",
  },
  logisticsValue: {
    color: "#E0E0E0",
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },
  eventsSection: {
    marginHorizontal: 20,
  },
  eventsSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  eventsCount: {
    color: "#FF6B00",
    fontSize: 12,
    fontWeight: "700",
  },
  noEventsText: {
    color: "#666666",
    fontSize: 13,
    paddingVertical: 12,
  },
});
