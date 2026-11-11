import type { ReactNode } from "react";
import { Pressable, View, type StyleProp, type ViewStyle } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import { Text } from "./Text";

export type ListItemProps = {
  title: string;
  subtitle?: string;
  /** Left slot: icon, Avatar, or product image. */
  leading?: ReactNode;
  /** Right slot: price, Badge, Switch... */
  trailing?: ReactNode;
  /** Shows a ">" hint that the row opens something. Defaults to true when pressable. */
  chevron?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  /** Overrides the spoken label (defaults to "title, subtitle"). */
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * One row of a list. Read by screen readers as a single element, so a row
 * like "RTX 4070, 12 GB, $549" is one swipe instead of three.
 */
export function ListItem({
  title,
  subtitle,
  leading,
  trailing,
  chevron,
  onPress,
  disabled,
  accessibilityLabel,
  accessibilityHint,
  testID,
  style,
}: ListItemProps) {
  const theme = useTheme();
  const showChevron = chevron ?? Boolean(onPress);
  const label = accessibilityLabel ?? [title, subtitle].filter(Boolean).join(", ");

  const row = (pressed: boolean): StyleProp<ViewStyle> => [
    {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing[3],
      minHeight: 56,
      paddingVertical: theme.spacing[2],
      paddingHorizontal: theme.spacing[4],
      backgroundColor: pressed ? theme.colors.surfaceSunken : "transparent",
      opacity: disabled ? 0.5 : 1,
    },
    style,
  ];

  const content = (
    <>
      {leading}
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="body" numberOfLines={2}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="small" numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing}
      {showChevron ? (
        // h3 size, but variant "body" so the chevron never gets the "header" role
        <Text variant="body" tone="muted" style={theme.text("h3")} importantForAccessibility="no" accessibilityElementsHidden>
          {"›"}
        </Text>
      ) : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: Boolean(disabled) }}
        disabled={disabled}
        onPress={onPress}
        testID={testID}
        style={({ pressed }) => row(pressed && !disabled)}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View accessible accessibilityLabel={label} accessibilityHint={accessibilityHint} testID={testID} style={row(false)}>
      {content}
    </View>
  );
}
