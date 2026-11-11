import type { ComponentRef, ReactElement, ReactNode, Ref } from "react";
import { Pressable, View, type PressableProps, type StyleProp, type ViewStyle } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import { MIN_TOUCH_TARGET } from "./Button";

export type IconButtonProps = Omit<PressableProps, "children" | "style" | "accessibilityLabel"> & {
  ref?: Ref<ComponentRef<typeof View>>;
  /** Required: an icon has no visible text, so screen readers need this. */
  accessibilityLabel: string;
  children: ReactNode;
  size?: "sm" | "md";
  variant?: "ghost" | "secondary";
  style?: StyleProp<ViewStyle>;
};

/** Square button holding only an icon. Always at least 44pt to touch. */
export function IconButton({
  ref,
  children,
  size = "md",
  variant = "ghost",
  disabled,
  style,
  hitSlop,
  ...props
}: IconButtonProps): ReactElement {
  const theme = useTheme();
  const dim = size === "sm" ? 32 : 40;
  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(disabled) }}
      disabled={disabled}
      hitSlop={hitSlop ?? Math.ceil((MIN_TOUCH_TARGET - dim) / 2)}
      style={({ pressed }) => [
        {
          width: dim,
          height: dim,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: theme.radius.md,
          borderWidth: 1,
          borderColor: variant === "secondary" ? theme.colors.line : "transparent",
          backgroundColor: pressed
            ? theme.colors.surfaceSunken
            : variant === "secondary"
              ? theme.colors.surfaceRaised
              : "transparent",
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Pressable>
  );
}
