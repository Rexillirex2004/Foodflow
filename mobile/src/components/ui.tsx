import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Identidad visual: restaurante moderno y acogedor.
// Madera cálida (marrones) para texto/acentos, crema/blanco para fondos y
// tarjetas, verde oliva-salvia para estados positivos, naranja terracota
// para las acciones principales.
export const colors = {
  bg: "#FAF5EC",
  surface: "#FFFFFF",
  surfaceAlt: "#F3E9DB",
  border: "#E8DCC7",
  primary: "#DB7B3F",
  primaryText: "#FFFFFF",
  success: "#6E8A52",
  text: "#3B2C22",
  subtext: "#8B7A69",
  danger: "#B14A34",
  warning: "#C08A2E",
  wood: "#5C4433",
  woodDark: "#3E2E22",
};

const shadow = {
  shadowColor: colors.woodDark,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 10,
  elevation: 2,
};

export function Screen({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.screenOuter}>
      <View style={styles.screen}>{children}</View>
    </View>
  );
}

export function StatusTag({ label, color }: { label: string; color: string }) {
  return (
    <View style={styles.statusTag}>
      <View style={[styles.statusDot, { backgroundColor: color }]} />
      <Text style={[styles.statusTagText, { color }]}>{label}</Text>
    </View>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: object }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Button({
  title,
  onPress,
  loading,
  variant = "primary",
  disabled,
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
}) {
  const bg = variant === "primary" ? colors.primary : variant === "danger" ? colors.danger : colors.surfaceAlt;
  const color = variant === "primary" || variant === "danger" ? colors.primaryText : colors.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        variant === "primary" ? shadow : null,
        { backgroundColor: bg, opacity: disabled || loading ? 0.6 : pressed ? 0.85 : 1 },
      ]}
    >
      {loading ? <ActivityIndicator color={color} /> : <Text style={[styles.buttonText, { color }]}>{title}</Text>}
    </Pressable>
  );
}

export function Input(props: TextInputProps) {
  return <TextInput placeholderTextColor={colors.subtext} style={[styles.input, props.style]} {...props} />;
}

export function Badge({ text, color = colors.success }: { text: string; color?: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );
}

export function Title({ children }: { children: React.ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

export function Subtitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.subtitle}>{children}</Text>;
}

export function EmptyState({ text, icon = "restaurant-outline" }: { text: string; icon?: keyof typeof Ionicons.glyphMap }) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIconWrap}>
        <Ionicons name={icon} size={28} color={colors.wood} />
      </View>
      <Text style={styles.subtitle}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screenOuter: { flex: 1, backgroundColor: colors.bg, alignItems: "center" },
  screen: { flex: 1, width: "100%", maxWidth: 680, backgroundColor: colors.bg, padding: 18 },
  statusTag: { flexDirection: "row", alignItems: "center", gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusTagText: { fontSize: 13, fontWeight: "700", fontFamily: "Poppins_600SemiBold" },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },
  button: { paddingVertical: 15, borderRadius: 14, alignItems: "center", marginTop: 10 },
  buttonText: { fontSize: 16, fontWeight: "700", fontFamily: "Poppins_600SemiBold" },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    color: colors.text,
    marginBottom: 12,
  },
  badge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999, alignSelf: "flex-start" },
  badgeText: { color: "#FFFFFF", fontWeight: "700", fontSize: 12, fontFamily: "Poppins_600SemiBold" },
  title: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Poppins_700Bold",
    color: colors.text,
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  subtitle: { fontSize: 14, color: colors.subtext },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32 },
  emptyIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
});
