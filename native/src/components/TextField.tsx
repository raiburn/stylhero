import { useEffect, useRef, useState, type ComponentRef, type ReactElement, type ReactNode, type Ref } from "react";
import {
  AccessibilityInfo,
  Platform,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import { Text } from "./Text";

export type TextFieldProps = Omit<TextInputProps, "style" | "editable"> & {
  ref?: Ref<ComponentRef<typeof TextInput>>;
  /** Visible label, also read by screen readers. */
  label: string;
  /** Help text under the field. Replaced by `error` when there is one. */
  hint?: string;
  /** Error message. Turns the border red and is announced when it appears. */
  error?: string;
  disabled?: boolean;
  /** Icon or text before / after the input, e.g. a search icon or "$". */
  leading?: ReactNode;
  trailing?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function TextField({
  ref,
  label,
  hint,
  error,
  disabled,
  leading,
  trailing,
  style,
  onFocus,
  onBlur,
  accessibilityHint,
  ...props
}: TextFieldProps): ReactElement {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const message = error ?? hint;

  // iOS has no live regions, so announce a new error explicitly.
  const lastError = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (error && error !== lastError.current && Platform.OS === "ios") {
      AccessibilityInfo.announceForAccessibility(`${label}: ${error}`);
    }
    lastError.current = error;
  }, [error, label]);

  const borderColor = error ? theme.colors.danger : focused ? theme.colors.primary : theme.colors.line;

  return (
    <View style={[{ gap: theme.spacing[2] }, style]}>
      <Text style={[theme.text("small", "600"), { color: theme.colors.ink }]} importantForAccessibility="no" accessibilityElementsHidden>
        {label}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          minHeight: 44,
          paddingHorizontal: theme.spacing[3],
          gap: theme.spacing[2],
          backgroundColor: theme.colors.surfaceRaised,
          borderWidth: focused || error ? 2 : 1,
          // keep the text from shifting when the border thickens
          margin: focused || error ? 0 : 1,
          borderColor,
          borderRadius: theme.radius.md,
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {leading}
        <TextInput
          ref={ref}
          accessibilityLabel={label}
          accessibilityHint={accessibilityHint ?? message}
          accessibilityState={{ disabled: Boolean(disabled) }}
          aria-invalid={error ? true : undefined}
          editable={!disabled}
          placeholderTextColor={theme.colors.inkMuted}
          selectionColor={theme.colors.primary}
          maxFontSizeMultiplier={2}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[theme.text("body"), { flex: 1, color: theme.colors.ink, paddingVertical: theme.spacing[2] }]}
          {...props}
        />
        {trailing}
      </View>
      {message ? (
        <Text
          variant="small"
          tone={error ? "danger" : "muted"}
          accessibilityLiveRegion={error ? "polite" : "none"}
          importantForAccessibility={error ? "yes" : "no"}
        >
          {message}
        </Text>
      ) : null}
    </View>
  );
}
