import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Tabs } from "expo-router";
import React from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const { width } = Dimensions.get("window");

const TABS = [
  { name: "foryou", label: "For You", icon: "star" },
  { name: "discover", label: "Discover", icon: "compass" },
  { name: "social", label: "Social", icon: "users" },
  { name: "tickets", label: "Tickets", icon: "tag" },
  { name: "profile", label: "Profile", icon: "user" },
] as const;

type FloatingTabBarProps = Parameters<NonNullable<React.ComponentProps<typeof Tabs>["tabBar"]>>[0];

function FloatingTabBar({ state, navigation }: FloatingTabBarProps) {
  const insets = useSafeAreaInsets();
  useColors(); // ensure hook runs in right context

  const bottomOffset = Platform.OS === "web"
    ? Math.max(insets.bottom, 20) + 8
    : insets.bottom + 8;

  return (
    <View style={[styles.wrapper, { bottom: bottomOffset }]} pointerEvents="box-none">
      <View style={styles.glow} />
      <View style={styles.pill}>
        {state.routes.map((route: { key: string; name: string }, index: number) => {
          const focused = state.index === index;
          const tab = TABS[index];
          if (!tab) return null;

          const tint = focused ? "#FF6B00" : "#8A8A8A";

          return (
            <Pressable
              key={route.key}
              onPress={() => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) {
                  Haptics.selectionAsync();
                  navigation.navigate(route.name, {});
                }
              }}
              style={styles.tabItem}
              accessibilityLabel={tab.label}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
            >
              <View style={styles.tabContent}>
                <Feather name={tab.icon} size={22} color={tint} />
                <Text style={[styles.tabLabel, { color: tint }]} numberOfLines={1}>
                  {tab.label}
                </Text>
                {focused && <View style={styles.activeDot} />}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", href: null }} />
      <Tabs.Screen name="foryou" options={{ title: "For You" }} />
      <Tabs.Screen name="discover" options={{ title: "Discover" }} />
      <Tabs.Screen name="social" options={{ title: "Social" }} />
      <Tabs.Screen name="tickets" options={{ title: "Tickets" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

const PILL_WIDTH = Math.min(width - 40, 360);

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 100,
  },
  glow: {
    position: "absolute",
    width: PILL_WIDTH,
    height: 64,
    borderRadius: 28,
    backgroundColor: "#FF6B00",
    opacity: 0.1,
    top: 4,
    shadowColor: "#FF6B00",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 24,
    elevation: 0,
  },
  pill: {
    width: PILL_WIDTH,
    height: 68,
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    backgroundColor: "#161616",
    borderWidth: 1,
    borderColor: "#262626",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 20,
  },
  tabItem: {
    flex: 1,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  tabLabel: {
    fontSize: 10.5,
    fontWeight: "600",
    letterSpacing: 0.1,
  },
  activeDot: {
    position: "absolute",
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#FF6B00",
  },
});
