import { View, type ViewProps, type ViewStyle } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import type { SpacingToken } from "../theme/tokens";

export type StackProps = ViewProps & {
  direction?: "column" | "row";
  /** Spacing token between children. */
  gap?: SpacingToken;
  align?: ViewStyle["alignItems"];
  justify?: ViewStyle["justifyContent"];
  wrap?: boolean;
  /** Spacing token around the content. */
  padding?: SpacingToken;
};

/** Flex layout with token-based gaps. */
export function Stack({ direction = "column", gap, align, justify, wrap, padding, style, ...props }: StackProps) {
  const { spacing } = useTheme();
  return (
    <View
      style={[
        {
          flexDirection: direction,
          gap: gap ? spacing[gap] : undefined,
          alignItems: align,
          justifyContent: justify,
          flexWrap: wrap ? "wrap" : undefined,
          padding: padding ? spacing[padding] : undefined,
        },
        style,
      ]}
      {...props}
    />
  );
}
