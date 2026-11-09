import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useColorScheme, type TextStyle } from "react-native";
import {
  colors,
  radius,
  shadows,
  spacing,
  typography,
  type ColorScheme,
  type Colors,
  type FontFamilyToken,
  type TypographyToken,
} from "./tokens";

type FontWeight = "400" | "500" | "600" | "700" | "800";

/**
 * Maps a token font family + weight to a loaded font name, e.g. with
 * `@expo-google-fonts/plus-jakarta-sans`:
 *   (family, weight) => family === "mono" ? undefined : `PlusJakartaSans_${names[weight]}`
 * Custom fonts bake the weight into the family name, so when this returns a
 * name the style drops `fontWeight` (Android would otherwise fake-bold it).
 * Returning undefined keeps the platform system font with `fontWeight`.
 */
export type FontResolver = (family: FontFamilyToken, weight: FontWeight) => string | undefined;

export type Theme = {
  scheme: ColorScheme;
  colors: Colors;
  spacing: typeof spacing;
  radius: typeof radius;
  shadows: Record<keyof (typeof shadows)["light"], string>;
  /** Text style for a type token, with the font resolver applied. */
  text: (variant: TypographyToken, weight?: FontWeight) => TextStyle;
};

export function createTheme(scheme: ColorScheme, resolveFont?: FontResolver): Theme {
  const cache = new Map<string, TextStyle>();
  return {
    scheme,
    colors: colors[scheme],
    spacing,
    radius,
    shadows: shadows[scheme],
    text(variant, weight) {
      const key = `${variant}:${weight ?? ""}`;
      const cached = cache.get(key);
      if (cached) return cached;
      const t = typography[variant];
      const fontWeight = (weight ?? t.fontWeight) as FontWeight;
      const fontFamily = resolveFont?.(t.family, fontWeight);
      const style: TextStyle = {
        fontSize: t.fontSize,
        lineHeight: t.lineHeight,
        ...("letterSpacing" in t ? { letterSpacing: t.letterSpacing } : null),
        ...(fontFamily ? { fontFamily } : { fontWeight }),
        ...(t.family === "mono" && !fontFamily ? { fontVariant: ["tabular-nums"] } : null),
      };
      cache.set(key, style);
      return style;
    },
  };
}

const ThemeContext = createContext<Theme | null>(null);

export type ThemeProviderProps = {
  /** "system" (default) follows the device setting and updates live. */
  colorScheme?: ColorScheme | "system";
  fonts?: FontResolver;
  children: ReactNode;
};

export function ThemeProvider({ colorScheme = "system", fonts, children }: ThemeProviderProps) {
  const system = useColorScheme();
  const scheme: ColorScheme =
    colorScheme === "system" ? (system === "dark" ? "dark" : "light") : colorScheme;
  const theme = useMemo(() => createTheme(scheme, fonts), [scheme, fonts]);
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

const fallback = createTheme("light");

/** The current theme. Outside a ThemeProvider it returns the light theme with system fonts. */
export function useTheme(): Theme {
  return useContext(ThemeContext) ?? fallback;
}
