import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Image,
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

export default function PublicUserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { events } = useEventCatalog();

  const [isFollowing, setIsFollowing] = useState(false);

  // Profile data
  const profile = {
    id: id || "curator-1",
    displayName: "Dami Adeyemi",
    handle: "@dami_culture",
    bio: "Sound curator & creative director. Connecting the sounds of Lagos, London, and Accra. Catch me at the front left speaker.",
    homeCity: "London / Lagos 🇬🇧🇳🇬",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    isVerifiedTastemaker: true,
    stats: {
      attended: 34,
      tribes: 6,
      streakMonths: 8,
      cloutPoints: 4850,
    },
    badges: [
      { id: "b1", title: "Afrobeats Pioneer", color: "#FF6B00", icon: "music" },
      { id: "b2", title: "Carnival Veteran", color: "#FFD700", icon: "sun" },
      { id: "b3", title: "VIP Pass Holder", color: "#7C4DFF", icon: "shield" },
      { id: "b4", title: "Lagos Hub Legend", color: "#00E676", icon: "award" },
    ],
  };

  const attendingEvents = events.slice(0, 3);

  const toggleFollow = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsFollowing(!isFollowing);
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
          <Text style={styles.headerTitle}>Diaspora Tastemaker</Text>
          <Pressable
            onPress={() => {
              Haptics.selectionAsync();
            }}
            style={styles.shareBtn}
            accessibilityLabel="Share profile"
            accessibilityRole="button"
          >
            <Feather name="share-2" size={18} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Profile Card Header */}
        <View style={styles.profileHero}>
          <View style={styles.avatarRow}>
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
            <View style={styles.followActionCol}>
              <Pressable
                style={[styles.followBtn, isFollowing && styles.followingBtn]}
                onPress={toggleFollow}
                accessibilityLabel={isFollowing ? "Unfollow user" : "Follow user"}
                accessibilityRole="button"
              >
                <Text style={[styles.followBtnText, isFollowing && styles.followingBtnText]}>
                  {isFollowing ? "Following" : "Follow"}
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.nameBlock}>
            <View style={styles.nameRow}>
              <Text style={styles.displayName}>{profile.displayName}</Text>
              {profile.isVerifiedTastemaker && (
                <Feather name="check-circle" size={18} color="#00E676" style={{ marginLeft: 6 }} />
              )}
            </View>
            <Text style={styles.handleText}>{profile.handle} • {profile.homeCity}</Text>
            <Text style={styles.bioText}>{profile.bio}</Text>
          </View>

          {/* Stats Bar */}
          <View style={styles.statsBar}>
            <View style={styles.statCol}>
              <Text style={styles.statVal}>{profile.stats.attended}</Text>
              <Text style={styles.statLbl}>Events</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statVal}>{profile.stats.tribes}</Text>
              <Text style={styles.statLbl}>Tribes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={[styles.statVal, { color: "#FF6B00" }]}>{profile.stats.streakMonths} mo</Text>
              <Text style={styles.statLbl}>Streak</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={[styles.statVal, { color: "#FFD700" }]}>{profile.stats.cloutPoints}</Text>
              <Text style={styles.statLbl}>KULTROINS</Text>
            </View>
          </View>
        </View>

        {/* Cultural Badges & Accolades */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionTitle}>Cultural Badges</Text>
          <View style={styles.badgeGrid}>
            {profile.badges.map((b) => (
              <View key={b.id} style={styles.badgeCard}>
                <View style={[styles.badgeIconWrap, { backgroundColor: b.color }]}>
                  <Feather name={b.icon as any} size={16} color="#0A0A0A" />
                </View>
                <Text style={styles.badgeTitle}>{b.title}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Attending Events Feed */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Events Attending</Text>
            <Text style={styles.subCount}>{attendingEvents.length} upcoming</Text>
          </View>

          {attendingEvents.map((evt) => (
            <EventCardHero
              key={evt.id}
              event={evt}
            />
          ))}
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
    fontSize: 16,
    fontWeight: "800",
  },
  shareBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1C1C1C",
    alignItems: "center",
    justifyContent: "center",
  },
  profileHero: {
    marginHorizontal: 20,
    backgroundColor: "#141414",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#222222",
    padding: 20,
    marginBottom: 16,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#FF6B00",
  },
  followActionCol: {},
  followBtn: {
    backgroundColor: "#FF6B00",
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 12,
  },
  followingBtn: {
    backgroundColor: "#242424",
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  followBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
  followingBtnText: {
    color: "#AAAAAA",
  },
  nameBlock: {
    marginBottom: 16,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  displayName: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },
  handleText: {
    color: "#FF6B00",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
  },
  bioText: {
    color: "#A0A0A0",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
  },
  statsBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#1C1C1C",
    borderRadius: 14,
    paddingVertical: 12,
  },
  statCol: {
    alignItems: "center",
  },
  statVal: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
  statLbl: {
    color: "#777777",
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: "#2A2A2A",
  },
  sectionWrap: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  subCount: {
    color: "#FF6B00",
    fontSize: 12,
    fontWeight: "700",
  },
  badgeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  badgeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#161616",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#262626",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  badgeIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeTitle: {
    color: "#EEEEEE",
    fontSize: 12,
    fontWeight: "700",
  },
});
