const colors = {
  light: {
    text: "#E0E0E0",
    tint: "#FF6B00",
    background: "#111111",
    foreground: "#E0E0E0",
    card: "#1C1C1C",
    cardForeground: "#E0E0E0",
    primary: "#FF6B00",
    // White-on-orange measured 2.86:1 — fails WCAG AA's 4.5:1 for normal
    // text (and the 3:1 floor for large/bold). Near-black — the app's own
    // background color, so this stays on-brand — measures 6.61:1.
    primaryForeground: "#111111",
    secondary: "#00C853",
    // Same failure for white-on-green (2.24:1); near-black measures 8.44:1.
    secondaryForeground: "#111111",
    muted: "#252525",
    mutedForeground: "#A0A0A0",
    accent: "#FF6B00",
    // Same orange as primary — same 2.86:1 failure, same fix.
    accentForeground: "#111111",
    destructive: "#D32F2F",
    destructiveForeground: "#ffffff",
    border: "#2A2A2A",
    input: "#2A2A2A",
    surface: "#1A1A1A",
    surfaceElevated: "#222222",
    success: "#00C853",
    warning: "#FFA726",
  },
  dark: {
    text: "#E0E0E0",
    tint: "#FF6B00",
    background: "#111111",
    foreground: "#E0E0E0",
    card: "#1C1C1C",
    cardForeground: "#E0E0E0",
    primary: "#FF6B00",
    // White-on-orange measured 2.86:1 — fails WCAG AA's 4.5:1 for normal
    // text (and the 3:1 floor for large/bold). Near-black — the app's own
    // background color, so this stays on-brand — measures 6.61:1.
    primaryForeground: "#111111",
    secondary: "#00C853",
    // Same failure for white-on-green (2.24:1); near-black measures 8.44:1.
    secondaryForeground: "#111111",
    muted: "#252525",
    mutedForeground: "#A0A0A0",
    accent: "#FF6B00",
    // Same orange as primary — same 2.86:1 failure, same fix.
    accentForeground: "#111111",
    destructive: "#D32F2F",
    destructiveForeground: "#ffffff",
    border: "#2A2A2A",
    input: "#2A2A2A",
    surface: "#1A1A1A",
    surfaceElevated: "#222222",
    success: "#00C853",
    warning: "#FFA726",
  },
  radius: 12,
};

export default colors;
