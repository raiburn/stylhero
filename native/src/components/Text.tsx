import { Text as RNText, type TextProps as RNTextProps } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import type { ColorToken, TypographyToken } from "../theme/tokens";

export type TextVariant = TypographyToken | "strong";
export type TextTone = "ink" | "muted" | "primary" | "success" | "danger";

export type TextProps = RNTextProps & {
  /** Type style from tokens.json. "strong" is body in bold ink. */
  variant?: TextVariant;
  tone?: TextTone;
};

const toneColor: Record<TextTone, ColorToken> = {
  ink: "ink",
  muted: "inkMuted",
  primary: "primary",
  success: "success",
  danger: "danger",
};

const headings = new Set<TextVariant>(["display", "h1", "h2", "h3"]);

/**
 * Themed text. Headings get the "header" role so screen readers can jump
 * between them, and cap font scaling at 1.5x so big titles don't overflow;
 * body text scales up to 2x with the user's font size setting.
 */
export function Text({ variant = "body", tone, style, ...props }: TextProps) {
  const theme = useTheme();
  const isHeading = headings.has(variant);
  const base = variant === "strong" ? theme.text("body", "700") : theme.text(variant);
  return (
    <RNText
      accessibilityRole={isHeading ? "header" : undefined}
      maxFontSizeMultiplier={isHeading ? 1.5 : 2}
      style={[
        base,
        { color: theme.colors[toneColor[tone ?? (variant === "small" ? "muted" : "ink")]] },
        variant === "label" && { textTransform: "uppercase" },
        style,
      ]}
      {...props}
    />
  );
}
