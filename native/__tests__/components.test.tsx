import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { AccessibilityInfo, Platform, StyleSheet, Text as RNText } from "react-native";
import {
  Badge,
  Button,
  Card,
  IconButton,
  ListItem,
  MIN_TOUCH_TARGET,
  Stack,
  Text,
  TextField,
  ThemeProvider,
  colors,
} from "../src";

const light = colors.light;
const flat = (el: { props: { style?: unknown } }) => StyleSheet.flatten(el.props.style as never) ?? {};

describe("Text", () => {
  it("marks headings as headers for screen readers", async () => {
    await render(<Text variant="h1">Your build</Text>);
    expect(screen.getByRole("header", { name: "Your build" })).toBeOnTheScreen();
  });

  it("does not mark body text as a header", async () => {
    await render(<Text>Plain</Text>);
    expect(screen.queryByRole("header")).toBeNull();
  });

  it("applies tone colors and uppercases labels", async () => {
    await render(
      <>
        <Text tone="danger">Error</Text>
        <Text variant="label">eyebrow</Text>
      </>
    );
    expect(screen.getByText("Error")).toHaveStyle({ color: light.danger });
    expect(screen.getByText("eyebrow")).toHaveStyle({ textTransform: "uppercase" });
  });

  it("uses dark colors under a dark ThemeProvider", async () => {
    await render(
      <ThemeProvider colorScheme="dark">
        <Text>Night</Text>
      </ThemeProvider>
    );
    expect(screen.getByText("Night")).toHaveStyle({ color: colors.dark.ink });
  });
});

describe("Stack", () => {
  it("turns spacing tokens into gap and padding", async () => {
    await render(
      <Stack testID="stack" direction="row" gap={3} padding={4}>
        <RNText>a</RNText>
      </Stack>
    );
    expect(screen.getByTestId("stack")).toHaveStyle({ flexDirection: "row", gap: 12, padding: 16 });
  });
});

describe("Button", () => {
  it("is a button named by its label and fires onPress", async () => {
    const onPress = jest.fn();
    await render(<Button onPress={onPress}>Generate build</Button>);
    await fireEvent.press(screen.getByRole("button", { name: "Generate build" }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("does not fire and is announced disabled when disabled", async () => {
    const onPress = jest.fn();
    await render(
      <Button disabled onPress={onPress}>
        Save
      </Button>
    );
    const button = screen.getByRole("button", { name: "Save" });
    await fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
  });

  it("shows a spinner, blocks presses, and is announced busy while loading", async () => {
    const onPress = jest.fn();
    await render(
      <Button loading onPress={onPress}>
        Generating
      </Button>
    );
    const button = screen.getByRole("button", { name: "Generating" });
    await fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
    expect(button).toBeBusy();
    expect(screen.getByTestId("button-spinner")).toBeOnTheScreen();
    // the label stays so the width doesn't jump
    expect(screen.getByText("Generating")).toBeOnTheScreen();
  });

  it("extends small buttons to a 44pt touch target with hitSlop", async () => {
    await render(<Button size="sm">Tiny</Button>);
    const button = screen.getByRole("button", { name: "Tiny" });
    expect(32 + 2 * (button.props.hitSlop as number)).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET);
  });

  it("uses the primary token colors", async () => {
    await render(<Button>Go</Button>);
    expect(flat(screen.getByRole("button", { name: "Go" }))).toMatchObject({ backgroundColor: light.primary });
    expect(screen.getByText("Go")).toHaveStyle({ color: light.onPrimary });
  });

  it("grows with large font sizes instead of clipping", async () => {
    await render(<Button>Grow</Button>);
    const style = flat(screen.getByRole("button", { name: "Grow" }));
    expect(style.minHeight).toBe(40);
    expect(style.height).toBeUndefined();
  });
});

describe("IconButton", () => {
  it("requires and exposes an accessibility label", async () => {
    const onPress = jest.fn();
    await render(
      <IconButton accessibilityLabel="Remove part" onPress={onPress}>
        <RNText>x</RNText>
      </IconButton>
    );
    await fireEvent.press(screen.getByRole("button", { name: "Remove part" }));
    expect(onPress).toHaveBeenCalled();
  });
});

describe("Badge", () => {
  it("renders its label with tone colors", async () => {
    await render(<Badge tone="success">Compatible</Badge>);
    expect(screen.getByText("Compatible")).toHaveStyle({ color: light.success });
    expect(screen.getByLabelText("Compatible")).toHaveStyle({ backgroundColor: light.successSoft });
  });
});

describe("Card", () => {
  it("renders title, subtitle, body and footer", async () => {
    await render(
      <Card title="Budget 1440p" subtitle="$1,500" footer={<Button>Open</Button>}>
        <Text>8 parts</Text>
      </Card>
    );
    expect(screen.getByRole("header", { name: "Budget 1440p" })).toBeOnTheScreen();
    expect(screen.getByText("$1,500")).toBeOnTheScreen();
    expect(screen.getByText("8 parts")).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Open" })).toBeOnTheScreen();
  });

  it("becomes one button named by title and subtitle when pressable", async () => {
    const onPress = jest.fn();
    await render(<Card title="Budget 1440p" subtitle="$1,500" onPress={onPress} />);
    await fireEvent.press(screen.getByRole("button", { name: "Budget 1440p, $1,500" }));
    expect(onPress).toHaveBeenCalled();
  });
});

describe("TextField", () => {
  it("is found by its label and passes text changes through", async () => {
    const onChangeText = jest.fn();
    await render(<TextField label="Budget" onChangeText={onChangeText} />);
    await fireEvent.changeText(screen.getByLabelText("Budget"), "1500");
    expect(onChangeText).toHaveBeenCalledWith("1500");
  });

  it("uses the hint as the accessibility hint", async () => {
    await render(<TextField label="Budget" hint="In US dollars" />);
    expect(screen.getByLabelText("Budget").props.accessibilityHint).toBe("In US dollars");
  });

  it("shows the error instead of the hint, marks the input invalid, and sets a live region", async () => {
    await render(<TextField label="Budget" hint="In US dollars" error="Enter at least $500" />);
    const input = screen.getByLabelText("Budget");
    expect(input.props.accessibilityHint).toBe("Enter at least $500");
    expect(input.props["aria-invalid"]).toBe(true);
    expect(screen.queryByText("In US dollars")).toBeNull();
    expect(screen.getByText("Enter at least $500").props.accessibilityLiveRegion).toBe("polite");
  });

  it("announces a new error on iOS", async () => {
    const announce = jest.spyOn(AccessibilityInfo, "announceForAccessibility").mockImplementation(() => {});
    const original = Platform.OS;
    Object.defineProperty(Platform, "OS", { value: "ios", configurable: true });
    try {
      const { rerender } = await render(<TextField label="Budget" />);
      expect(announce).not.toHaveBeenCalled();
      await rerender(<TextField label="Budget" error="Too low" />);
      expect(announce).toHaveBeenCalledWith("Budget: Too low");
      await rerender(<TextField label="Budget" error="Too low" />);
      expect(announce).toHaveBeenCalledTimes(1);
    } finally {
      Object.defineProperty(Platform, "OS", { value: original, configurable: true });
      announce.mockRestore();
    }
  });

  it("is not editable when disabled", async () => {
    await render(<TextField label="Budget" disabled />);
    const input = screen.getByLabelText("Budget");
    expect(input.props.editable).toBe(false);
    expect(input).toBeDisabled();
  });
});

describe("ListItem", () => {
  it("reads as one element and fires onPress", async () => {
    const onPress = jest.fn();
    await render(<ListItem title="RTX 4070" subtitle="12 GB" trailing={<Text>$549</Text>} onPress={onPress} />);
    await fireEvent.press(screen.getByRole("button", { name: "RTX 4070, 12 GB" }));
    expect(onPress).toHaveBeenCalled();
    // the chevron is decorative: visible, hidden from screen readers, never a heading
    expect(screen.getByText("›", { includeHiddenElements: true })).toBeOnTheScreen();
    expect(screen.queryByText("›")).toBeNull();
    expect(screen.queryByRole("header", { includeHiddenElements: true })).toBeNull();
  });

  it("is a single accessible element without a chevron when not pressable", async () => {
    await render(<ListItem title="Ryzen 7 7800X3D" subtitle="AM5" />);
    expect(screen.getByLabelText("Ryzen 7 7800X3D, AM5")).toBeOnTheScreen();
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByText("›", { includeHiddenElements: true })).toBeNull();
  });

  it("does not fire when disabled", async () => {
    const onPress = jest.fn();
    await render(<ListItem title="Out of stock" onPress={onPress} disabled />);
    await fireEvent.press(screen.getByRole("button", { name: "Out of stock" }));
    expect(onPress).not.toHaveBeenCalled();
  });
});

describe("refs (React 19 ref-as-prop)", () => {
  it("reach the underlying Pressable and TextInput", async () => {
    const buttonRef = createRef<any>();
    const inputRef = createRef<any>();
    await render(
      <>
        <Button ref={buttonRef}>Go</Button>
        <TextField ref={inputRef} label="Budget" />
      </>
    );
    expect(buttonRef.current).not.toBeNull();
    expect(typeof inputRef.current?.focus).toBe("function");
  });
});
