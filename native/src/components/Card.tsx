import type { ReactNode } from "react";
import { Pressable, View, type StyleProp, type ViewProps, type ViewStyle } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import { Text } from "./Text";

export type CardProps = Omit<ViewProps, "style"> & {
  title?: string;
  subtitle?: string;
  /** Top-right slot next to the title, e.g. a Badge or IconButton. */
  action?: ReactNode;
  /** Bottom row, right-aligned, e.g. Buttons. */
  footer?: ReactNode;
  /** "outlined" drops the shadow. */
  variant?: "elevated" | "outlined";
  /** Makes the whole card one button. Give it an accessibilityLabel if the title isn't enough. */
  onPress?: () => void;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Card({ title, subtitle, action, footer, variant = "elevated", onPress, children, style, accessibilityLabel, ...props }: CardProps) {
  const theme = useTheme();
  const base: ViewStyle = {
    gap: theme.spacing[3],
    padding: theme.spacing[6],
    backgroundColor: theme.colors.surfaceRaised,
    borderWidth: 1,
    borderColor: theme.colors.line,
    borderRadius: theme.radius.lg,
    boxShadow: variant === "elevated" ? theme.shadows.card : undefined,
  };

  const content = (
    <>
      {(title || subtitle || action) && (
        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: theme.spacing[3] }}>
          <View style={{ flex: 1, gap: 2 }}>
            {title ? <Text variant="h3">{title}</Text> : null}
            {subtitle ? <Text variant="small">{subtitle}</Text> : null}
          </View>
          {action}
        </View>
      )}
      {children}
      {footer ? (
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-end", gap: theme.spacing[2], marginTop: theme.spacing[2] }}>
          {footer}
        </View>
      ) : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? ([title, subtitle].filter(Boolean).join(", ") || undefined)}
        onPress={onPress}
        style={({ pressed }) => [base, pressed && { backgroundColor: theme.colors.surfaceSunken }, style]}
        {...props}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View style={[base, style]} accessibilityLabel={accessibilityLabel} {...props}>
      {content}
    </View>
  );
}
