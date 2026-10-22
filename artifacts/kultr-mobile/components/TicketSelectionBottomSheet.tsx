import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Event, EVENT_IMAGES, formatDate, formatTime } from "@/constants/data";
import { useColors } from "@/hooks/useColors";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface Props {
  visible: boolean;
  onClose: () => void;
  event: Event;
  selectedTicketType: number;
  onSelectTicketType: (index: number) => void;
  onProceedToCheckout: (
    ticketTypeIndex: number,
    quantity: number,
    bundleSelected: boolean
  ) => void;
}

export function TicketSelectionBottomSheet({
  visible,
  onClose,
  event,
  selectedTicketType,
  onSelectTicketType,
  onProceedToCheckout,
}: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [quantity, setQuantity] = useState(1);
  const [bundleSelected, setBundleSelected] = useState(false);
  const [bundleData, setBundleData] = useState<{
    title: string;
    bundlePrice: number;
    currency: string;
    flavor: string;
  }>({
    title: "Kultr Canned Drinks & Express Bar Pass",
    bundlePrice: 800,
    currency: event.currency || "KES",
    flavor: "Zobo Splash & Cold Brew 4-Pack",
  });

  const apiBase = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001";

  // Fetch event specific beverage bundle if available
  useEffect(() => {
    if (!event.id || !visible) return;
    fetch(`${apiBase}/api/beverages/events/${event.id}/bundles`)
      .then((res) => (res.ok ? res.json() : { bundles: [] }))
      .then((data) => {
        if (data?.bundles?.length) {
          const b = data.bundles[0];
          setBundleData({
            title: b.title || "Kultr Canned Drinks & Express Bar Pass",
            bundlePrice: Number(b.bundlePrice) || 800,
            currency: b.currency || event.currency || "KES",
            flavor: b.product?.name ? `${b.product.name} (${b.product.flavor})` : "Zobo Splash 4-Pack",
          });
        }
      })
      .catch(() => {});
  }, [event.id, visible, apiBase, event.currency]);

  // Slide & Fade Animation
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          friction: 8,
          tension: 70,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, backdropOpacity, translateY]);

  // Gesture handling for drag-down dismissal
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 120 || gestureState.vy > 0.8) {
          handleClose();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            friction: 7,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const currentTier = event.ticketTypes[selectedTicketType] ?? event.ticketTypes[0];
  const ticketBasePrice = currentTier?.price ?? event.price;
  const isSoldOut = (currentTier?.available ?? 1) === 0;

  const ticketsSubtotal = ticketBasePrice * quantity;
  const bundleAddon = bundleSelected ? bundleData.bundlePrice : 0;
  const grandTotal = ticketsSubtotal + bundleAddon;

  const handleProceed = () => {
    if (isSoldOut) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    handleClose();
    onProceedToCheckout(selectedTicketType, quantity, bundleSelected);
  };

  if (!visible) return null;

  const bottomPad = Platform.OS === "web" ? Math.max(insets.bottom, 24) : insets.bottom;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      accessibilityViewIsModal
    >
      <View style={styles.overlay}>
        {/* Backdrop */}
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.65],
              }),
            },
          ]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        </Animated.View>

        {/* Animated Sheet Container */}
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: "#161616",
              paddingBottom: bottomPad + 12,
              transform: [{ translateY }],
            },
          ]}
        >
          {/* Drag Handle Bar */}
          <View {...panResponder.panHandlers} style={styles.handleArea}>
            <View style={styles.dragHandle} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Image
              source={EVENT_IMAGES[event.imageKey]}
              style={styles.eventThumb}
              resizeMode="cover"
            />
            <View style={styles.headerInfo}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{event.category}</Text>
              </View>
              <Text style={styles.eventTitle} numberOfLines={1}>
                {event.title}
              </Text>
              <Text style={styles.eventMeta}>
                {formatDate(event.date)} · {formatTime(event.time)}
              </Text>
            </View>
            <Pressable
              onPress={handleClose}
              style={styles.closeBtn}
              accessibilityLabel="Close ticket selection"
              accessibilityRole="button"
            >
              <Feather name="x" size={16} color="#A0A0A0" />
            </Pressable>
          </View>

          <View style={styles.divider} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
          >
            {/* ── SECTION 1: TICKET TIER SELECTION ── */}
            <View style={styles.sectionHeader}>
              <Feather name="tag" size={14} color="#FF6B00" />
              <Text style={styles.sectionTitle}>SELECT TICKET TIER</Text>
            </View>

            <View style={styles.tiersContainer}>
              {event.ticketTypes.map((tier, idx) => {
                const selected = selectedTicketType === idx;
                const tierSoldOut = tier.available === 0;

                return (
                  <Pressable
                    key={tier.id || idx}
                    disabled={tierSoldOut}
                    onPress={() => {
                      Haptics.selectionAsync();
                      onSelectTicketType(idx);
                    }}
                    style={({ pressed }) => [
                      styles.tierCard,
                      selected && styles.tierCardSelected,
                      tierSoldOut && styles.tierCardSoldOut,
                      pressed && !tierSoldOut && styles.tierCardPressed,
                    ]}
                    accessibilityRole="radio"
                    accessibilityState={{ selected, disabled: tierSoldOut }}
                    accessibilityLabel={`${tier.name}, ${event.currencySymbol} ${tier.price.toLocaleString()}${
                      tierSoldOut ? ", sold out" : ""
                    }`}
                  >
                    <View style={styles.tierRadio}>
                      {selected ? (
                        <View style={styles.radioSelectedDot}>
                          <Feather name="check" size={12} color="#111111" />
                        </View>
                      ) : (
                        <View style={styles.radioUnselected} />
                      )}
                    </View>

                    <View style={styles.tierContent}>
                      <View style={styles.tierTopRow}>
                        <Text
                          style={[
                            styles.tierName,
                            selected && { color: "#FF6B00" },
                            tierSoldOut && { color: "#666" },
                          ]}
                        >
                          {tier.name}
                        </Text>
                        <Text
                          style={[
                            styles.tierPrice,
                            selected && { color: "#FF6B00" },
                            tierSoldOut && { color: "#666" },
                          ]}
                        >
                          {event.currencySymbol} {tier.price.toLocaleString()}
                        </Text>
                      </View>

                      {tier.description ? (
                        <Text style={styles.tierDescription}>{tier.description}</Text>
                      ) : (
                        <Text style={styles.tierDescription}>
                          {tier.name.toLowerCase().includes("vip")
                            ? "Front-stage access · VIP lounge & priority express entry"
                            : tier.name.toLowerCase().includes("early")
                            ? "Limited allocation · Early entry before 8:00 PM"
                            : "General admission festival entry with full venue access"}
                        </Text>
                      )}

                      {tierSoldOut ? (
                        <View style={styles.statusBadgeSoldOut}>
                          <Text style={styles.statusBadgeTextSoldOut}>SOLD OUT</Text>
                        </View>
                      ) : tier.available < 30 ? (
                        <View style={styles.statusBadgeFast}>
                          <Feather name="zap" size={10} color="#FFA726" />
                          <Text style={styles.statusBadgeTextFast}>
                            Only {tier.available} tickets left
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </Pressable>
                );
              })}
            </View>

            {/* ── SECTION 2: QUANTITY STEPPER ── */}
            <View style={styles.stepperCard}>
              <View>
                <Text style={styles.stepperLabel}>Number of Tickets</Text>
                <Text style={styles.stepperSub}>Max 6 tickets per order</Text>
              </View>
              <View style={styles.stepperControls}>
                <Pressable
                  disabled={quantity <= 1}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setQuantity((q) => Math.max(1, q - 1));
                  }}
                  style={[styles.stepperBtn, quantity <= 1 && styles.stepperBtnDisabled]}
                  accessibilityLabel="Decrease ticket quantity"
                  accessibilityRole="button"
                >
                  <Feather
                    name="minus"
                    size={16}
                    color={quantity <= 1 ? "#555" : "#fff"}
                  />
                </Pressable>
                <Text style={styles.stepperValue}>{quantity}</Text>
                <Pressable
                  disabled={quantity >= 6}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setQuantity((q) => Math.min(6, q + 1));
                  }}
                  style={[styles.stepperBtn, quantity >= 6 && styles.stepperBtnDisabled]}
                  accessibilityLabel="Increase ticket quantity"
                  accessibilityRole="button"
                >
                  <Feather
                    name="plus"
                    size={16}
                    color={quantity >= 6 ? "#555" : "#fff"}
                  />
                </Pressable>
              </View>
            </View>

            {/* ── SECTION 3: KULTR CANNED DRINKS & EXPRESS BAR PASS ── */}
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setBundleSelected((b) => !b);
              }}
              style={({ pressed }) => [
                styles.bundleCard,
                bundleSelected && styles.bundleCardActive,
                pressed && { opacity: 0.92 },
              ]}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: bundleSelected }}
              accessibilityLabel="Add Kultr Canned Drinks & Express Bar Pass"
            >
              <View style={styles.bundleTopRow}>
                <View style={styles.bundleBadge}>
                  <Feather name="coffee" size={11} color="#FF6B00" />
                  <Text style={styles.bundleBadgeText}>SIGNATURE FESTIVAL PERK</Text>
                </View>
                <View
                  style={[
                    styles.checkboxBox,
                    bundleSelected && styles.checkboxBoxActive,
                  ]}
                >
                  {bundleSelected && <Feather name="check" size={12} color="#111111" />}
                </View>
              </View>

              <View style={styles.bundleContent}>
                <Text style={styles.bundleTitle}>{bundleData.title}</Text>
                <Text style={styles.bundleSubtitle}>
                  Skip venue lines with fast-track express bar pickup. Includes{" "}
                  <Text style={{ color: "#fff", fontWeight: "700" }}>
                    {bundleData.flavor}
                  </Text>
                  .
                </Text>

                <View style={styles.bundleFooter}>
                  <Text style={styles.bundlePrice}>
                    +{bundleData.currency} {bundleData.bundlePrice.toLocaleString()}
                  </Text>
                  <View style={styles.bundleSavingsPill}>
                    <Text style={styles.bundleSavingsText}>Save 30% vs Bar</Text>
                  </View>
                </View>
              </View>
            </Pressable>

            {/* ── PRICE BREAKDOWN SUMMARY ── */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryText}>
                  {currentTier?.name} × {quantity}
                </Text>
                <Text style={styles.summaryValue}>
                  {event.currencySymbol} {ticketsSubtotal.toLocaleString()}
                </Text>
              </View>
              {bundleSelected && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryText}>Express Bar Pass & 4-Pack</Text>
                  <Text style={styles.summaryValue}>
                    +{bundleData.currency} {bundleData.bundlePrice.toLocaleString()}
                  </Text>
                </View>
              )}
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>
                  {event.currencySymbol} {grandTotal.toLocaleString()}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* ── PROCEED ACTION CTA ── */}
          <View style={styles.ctaFooter}>
            <Pressable
              disabled={isSoldOut}
              onPress={handleProceed}
              style={({ pressed }) => [
                styles.primaryBtn,
                isSoldOut && styles.primaryBtnDisabled,
                pressed && !isSoldOut && styles.primaryBtnPressed,
              ]}
              accessibilityLabel={`Proceed to checkout, total ${event.currencySymbol} ${grandTotal.toLocaleString()}`}
              accessibilityRole="button"
            >
              <Text style={styles.primaryBtnText}>
                {isSoldOut
                  ? "Selected Tier Sold Out"
                  : `Proceed to Checkout · ${event.currencySymbol} ${grandTotal.toLocaleString()}`}
              </Text>
              {!isSoldOut && <Feather name="arrow-right" size={18} color="#111111" />}
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: "#262626",
    maxHeight: SCREEN_HEIGHT * 0.88,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 20,
  },
  handleArea: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  dragHandle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#3A3A3A",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 12,
  },
  eventThumb: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#222",
  },
  headerInfo: {
    flex: 1,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,107,0,0.14)",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 3,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FF6B00",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  eventMeta: {
    fontSize: 12,
    color: "#A0A0A0",
    marginTop: 1,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#222222",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#222222",
    marginBottom: 8,
  },
  scrollArea: {
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 16,
    gap: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FF6B00",
    letterSpacing: 1.2,
  },
  tiersContainer: {
    gap: 10,
  },
  tierCard: {
    flexDirection: "row",
    backgroundColor: "#1D1D1D",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#282828",
    padding: 14,
    gap: 12,
    alignItems: "flex-start",
  },
  tierCardSelected: {
    borderColor: "#FF6B00",
    backgroundColor: "rgba(255,107,0,0.06)",
  },
  tierCardSoldOut: {
    opacity: 0.5,
    backgroundColor: "#161616",
    borderColor: "#222222",
  },
  tierCardPressed: {
    transform: [{ scale: 0.98 }],
  },
  tierRadio: {
    marginTop: 2,
  },
  radioUnselected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#444",
  },
  radioSelectedDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FF6B00",
    alignItems: "center",
    justifyContent: "center",
  },
  tierContent: {
    flex: 1,
  },
  tierTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
  },
  tierName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  tierPrice: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  tierDescription: {
    fontSize: 12,
    color: "#A0A0A0",
    lineHeight: 16,
  },
  statusBadgeSoldOut: {
    alignSelf: "flex-start",
    backgroundColor: "#331818",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 6,
  },
  statusBadgeTextSoldOut: {
    fontSize: 9,
    fontWeight: "800",
    color: "#EF4444",
  },
  statusBadgeFast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
  statusBadgeTextFast: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFA726",
  },
  stepperCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1D1D1D",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#282828",
    padding: 14,
  },
  stepperLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  stepperSub: {
    fontSize: 11,
    color: "#888",
    marginTop: 2,
  },
  stepperControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#121212",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    padding: 3,
    gap: 12,
  },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
  },
  stepperBtnDisabled: {
    opacity: 0.35,
  },
  stepperValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    minWidth: 18,
    textAlign: "center",
  },
  bundleCard: {
    backgroundColor: "#1C1C1C",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#2C2C2C",
    padding: 14,
  },
  bundleCardActive: {
    borderColor: "#FF6B00",
    backgroundColor: "rgba(255,107,0,0.06)",
  },
  bundleTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  bundleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,107,0,0.12)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  bundleBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FF6B00",
    letterSpacing: 0.6,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#444",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxBoxActive: {
    backgroundColor: "#FF6B00",
    borderColor: "#FF6B00",
  },
  bundleContent: {
    gap: 4,
  },
  bundleTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  bundleSubtitle: {
    fontSize: 12,
    color: "#A0A0A0",
    lineHeight: 17,
  },
  bundleFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  bundlePrice: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FF6B00",
  },
  bundleSavingsPill: {
    backgroundColor: "rgba(16,185,129,0.12)",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  bundleSavingsText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#10B981",
  },
  summaryCard: {
    backgroundColor: "#181818",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#262626",
    padding: 12,
    gap: 6,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryText: {
    fontSize: 12,
    color: "#A0A0A0",
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#262626",
    marginVertical: 4,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FF6B00",
  },
  ctaFooter: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  primaryBtn: {
    backgroundColor: "#FF6B00",
    borderRadius: 30,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#FF6B00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  primaryBtnDisabled: {
    opacity: 0.45,
    shadowOpacity: 0,
  },
  primaryBtnPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  primaryBtnText: {
    color: "#111111",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
});
