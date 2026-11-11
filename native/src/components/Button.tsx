import type { ComponentRef, ReactElement, ReactNode, Ref } from "react";
import {
  ActivityIndicator,
  Pressable,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useTheme, type Theme } from "../theme/ThemeProvider";
import { Text } from "./Text";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = Omit<PressableProps, "children" | "style"> & {
  ref?: Ref<ComponentRef<typeof View>>;
  children: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner, keeps the width, and blocks presses. Announced as busy. */
  loading?: boolean;
  fullWidth?: boolean;
  /** Icon shown before the label (e.g. a lucide-react-native icon). */
  icon?: ReactNode;
  /**
   * Caps the label's lines. Unset by default so long labels wrap instead of
   * being cut off when the user picks a large text size.
   */
  numberOfLines?: number;
  style?: StyleProp<ViewStyle>;
};

const heights: Record<ButtonSize, number> = { sm: 32, md: 40, lg: 48 };
/** Minimum touch target (WCAG 2.5.5 / Apple HIG 44pt). */
export const MIN_TOUCH_TARGET = 44;

function palette(theme: Theme, variant: ButtonVariant, pressed: boolean) {
  const c = theme.colors;
  switch (variant) {
    case "primary":
      return { bg: pressed ? c.primaryHover : c.primary, fg: c.onPrimary, border: "transparent" };
    case "secondary":
      return { bg: pressed ? c.surfaceSunken : c.surfaceRaised, fg: c.ink, border: c.line };
    case "ghost":
      return { bg: pressed ? c.primarySoft : "transparent", fg: c.primary, border: "transparent" };
    case "danger":
      return { bg: c.danger, fg: c.surfaceRaised, border: "transparent", opacity: pressed ? 0.9 : 1 };
  }
}

export function Button({
  ref,
  children,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth,
  icon,
  numberOfLines,
  disabled,
  style,
  hitSlop,
  accessibilityLabel,
  ...props
}: ButtonProps): ReactElement {
  const theme = useTheme();
  const height = heights[size];
  const inactive = Boolean(disabled) || loading;
  // Small buttons keep their look but get an invisible touch area of at least 44pt.
  const slop = hitSlop ?? Math.max(0, Math.ceil((MIN_TOUCH_TARGET - height) / 2));

  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? children}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      hitSlop={slop}
      style={({ pressed }) => {
        const p = palette(theme, variant, pressed && !inactive);
        return [
          {
            // minHeight, not height: the label grows with the user's font size setting
            minHeight: height,
            minWidth: height,
            maxWidth: "100%",
            paddingVertical: theme.spacing[1],
            paddingHorizontal: size === "sm" ? theme.spacing[3] : size === "lg" ? theme.spacing[6] : theme.spacing[4],
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: theme.spacing[2],
            backgroundColor: p.bg,
            borderColor: p.border,
            borderWidth: 1,
            borderRadius: theme.radius.md,
            opacity: disabled ? 0.5 : loading ? 0.8 : p.opacity ?? 1,
            alignSelf: fullWidth ? "stretch" : "flex-start",
          },
          style,
        ];
      }}
      {...props}
    >
      {({ pressed }) => {
        const p = palette(theme, variant, pressed && !inactive);
        return (
          <>
            {loading ? <ActivityIndicator size="small" color={p.fg} testID="button-spinner" /> : icon}
            <Text
              variant="body"
              numberOfLines={numberOfLines}
              style={[
                theme.text("body", "700"),
                // flexShrink lets the label wrap inside the button instead of overflowing it
                { color: p.fg, fontSize: size === "sm" ? 13 : size === "lg" ? 16 : 15, flexShrink: 1, textAlign: "center" },
              ]}
            >
              {children}
            </Text>
          </>
        );
      }}
    </Pressable>
  );
}
