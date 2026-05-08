import { useColorScheme } from "react-native";

import colors from "@/constants/colors";

type ColorPalette = typeof colors.light;

/**
 * Returns the design tokens for the current color scheme.
 * Falls back to the light palette when no dark key is defined.
 */
export function useColors(): ColorPalette & { radius: number } {
  const scheme = useColorScheme();
  const hasDark = "dark" in colors;
  const palette: ColorPalette =
    scheme === "dark" && hasLight(colors)
      ? (colors as unknown as { dark: ColorPalette }).dark
      : colors.light;
  return { ...palette, radius: colors.radius };
}

function hasLight(c: object): boolean {
  return "dark" in c;
}
