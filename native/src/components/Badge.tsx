import type { ReactNode } from "react";
import { View, type StyleProp, type ViewProps, type ViewStyle } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import type { ColorToken } from "../theme/tokens";
import { Text } from "./Text";

export type BadgeTone = "neutral" | "primary" | "info" | "accent" | "success" | "danger";

export type BadgeProps = Omit<ViewProps, "children" | "style"> & {
  children: string;
  tone?: BadgeTone;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

const tones: Record<BadgeTone, [bg: ColorToken, fg: ColorToken]> = {
  neutral: ["surfaceSunken", "inkMuted"],
  primary: ["primarySoft", "primary"],
  info: ["skySoft", "primary"],
  accent: ["accentSoft", "accentInk"],
  success: ["successSoft", "success"],
  danger: ["dangerSoft", "danger"],
};

/** Small status label, e.g. "Compatible" or "Out of stock". */
export function Badge({ children, tone = "neutral", icon, style, ...props }: BadgeProps) {
  const theme = useTheme();
  const [bg, fg] = tones[tone];
  return (
    <View
      accessible
      accessibilityLabel={children}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "flex-start",
          gap: theme.spacing[1],
          paddingVertical: 2,
          paddingHorizontal: theme.spacing[2],
          borderRadius: theme.radius.sm,
          backgroundColor: theme.colors[bg],
        },
        style,
      ]}
      {...props}
    >
      {icon}
      <Text variant="label" style={{ color: theme.colors[fg], letterSpacing: 0 }} maxFontSizeMultiplier={1.5}>
        {children}
      </Text>
    </View>
  );
}
