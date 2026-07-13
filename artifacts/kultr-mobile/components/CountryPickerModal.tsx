import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EA_COUNTRIES, type EACountry } from "@/constants/currencies";
import { useColors } from "@/hooks/useColors";

interface Props {
  visible: boolean;
  currentCode: string;
  onSelect: (c: EACountry) => void;
  onClose: () => void;
}

export function CountryPickerModal({ visible, currentCode, onSelect, onClose }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <View style={[styles.root, { backgroundColor: "#0E0E0E" }]}>

        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
          <View>
            <Text style={styles.eyebrow}>SELECT REGION</Text>
            <Text style={styles.title}>Where are you?</Text>
            <Text style={styles.sub}>Sets currency and payment methods</Text>
          </View>
          <Pressable onPress={onClose} style={styles.closeBtn} accessibilityLabel="Close" accessibilityRole="button">
            <Feather name="x" size={16} color="#fff" />
          </Pressable>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Country list */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 40 }]}
        >
          {EA_COUNTRIES.map((country) => {
            const isSelected = country.code === currentCode;
            return (
              <Pressable
                key={country.code}
                onPress={() => {
                  Haptics.selectionAsync();
                  onSelect(country);
                }}
                accessibilityLabel={`${country.name}, ${country.currencyCode}`}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                style={({ pressed }) => [
                  styles.card,
                  {
                    backgroundColor: isSelected ? "rgba(255,107,0,0.08)" : "#1A1A1A",
                    borderColor: isSelected ? "#FF6B00" : "#242424",
                    opacity: pressed ? 0.8 : 1,
                    transform: [{ scale: pressed ? 0.985 : 1 }],
                  },
                ]}
              >
                {/* Selected left bar */}
                {isSelected && <View style={styles.selectedBar} />}

                {/* Left: text content */}
                <View style={styles.cardLeft}>
                  {/* Country name + check */}
                  <View style={styles.nameRow}>
                    <Text style={[styles.countryName, { color: isSelected ? "#FF6B00" : "#fff" }]}>
                      {country.name}
                    </Text>
                    {isSelected && (
                      <View style={styles.checkBadge}>
                        <Feather name="check" size={9} color="#fff" />
                      </View>
                    )}
                  </View>

                  {/* Currency badge */}
                  <View style={[styles.currencyBadge, { backgroundColor: isSelected ? "rgba(255,107,0,0.15)" : "#242424" }]}>
                    <Text style={[styles.currencyText, { color: isSelected ? "#FF6B00" : "#888" }]}>
                      {country.currencySymbol} · {country.currencyCode}
                    </Text>
                  </View>

                  {/* Payment operator chips */}
                  <View style={styles.operatorRow}>
                    {country.paymentMethods.slice(0, 4).map((m) => (
                      <View
                        key={m.id}
                        style={[styles.operatorChip, { backgroundColor: m.color + "22", borderColor: m.color + "40" }]}
                      >
                        <View style={[styles.operatorDot, { backgroundColor: m.color }]} />
                        <Text style={[styles.operatorLabel, { color: m.color }]}>
                          {m.label.split(" ")[0]}
                        </Text>
                      </View>
                    ))}
                    {country.paymentMethods.length > 4 && (
                      <Text style={styles.moreText}>+{country.paymentMethods.length - 4}</Text>
                    )}
                  </View>
                </View>

                {/* Right: big ghost flag */}
                <View style={styles.cardRight}>
                  <Text style={[styles.bigFlag, { opacity: isSelected ? 1 : 0.55 }]}>
                    {country.flag}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#FF6B00",
    marginBottom: 6,
  },
  title: { fontSize: 26, fontWeight: "900", color: "#fff", marginBottom: 3 },
  sub: { fontSize: 13, color: "#555" },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1C1C1C",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },

  divider: { height: 1, backgroundColor: "#1E1E1E", marginHorizontal: 24, marginBottom: 20 },

  list: { paddingHorizontal: 16, gap: 10 },

  card: {
    borderRadius: 18,
    borderWidth: 1.5,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingLeft: 20,
    paddingRight: 0,
    position: "relative",
  },
  selectedBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: "#FF6B00",
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },

  cardLeft: { flex: 1, gap: 8 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  countryName: { fontSize: 20, fontWeight: "900", letterSpacing: -0.3 },
  checkBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FF6B00",
    alignItems: "center",
    justifyContent: "center",
  },

  currencyBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  currencyText: { fontSize: 11, fontWeight: "700", letterSpacing: 0.3 },

  operatorRow: { flexDirection: "row", flexWrap: "wrap", gap: 5 },
  operatorChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
  },
  operatorDot: { width: 5, height: 5, borderRadius: 3 },
  operatorLabel: { fontSize: 9, fontWeight: "800", letterSpacing: 0.2 },
  moreText: { fontSize: 10, color: "#555", fontWeight: "600", alignSelf: "center" },

  cardRight: {
    width: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  bigFlag: { fontSize: 56 },
});
