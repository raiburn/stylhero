import { render, screen } from "@testing-library/react-native";
import * as RN from "react-native";
import { Text as RNText } from "react-native";
import { ThemeProvider, colors, createTheme, spacing, typography, useTheme } from "../src";

const source = require("../../tokens.json");

function SchemeProbe() {
  const theme = useTheme();
  return <RNText testID="probe">{`${theme.scheme} ${theme.colors.surface}`}</RNText>;
}

describe("generated tokens", () => {
  it("match tokens.json for every color in every theme", async () => {
    for (const t of source.color.tokens) {
      const key = t.name.replace(/-([a-z0-9])/g, (_: string, c: string) => c.toUpperCase());
      for (const scheme of ["light", "dark"] as const) {
        const expected = typeof t.value === "string" ? t.value : t.value[scheme];
        expect((colors[scheme] as Record<string, string>)[key]).toBe(expected);
      }
    }
  });

  it("convert px and em to React Native numbers", async () => {
    expect(spacing[4]).toBe(16);
    expect(typography.h1).toMatchObject({ fontSize: 32, lineHeight: 38, fontWeight: "800" });
    // -0.02em at 32px
    expect(typography.h1.letterSpacing).toBeCloseTo(-0.64);
  });
});

describe("createTheme", () => {
  it("uses fontWeight with system fonts", async () => {
    expect(createTheme("light").text("h2")).toMatchObject({ fontSize: 24, fontWeight: "700" });
  });

  it("uses the resolved font family and drops fontWeight with custom fonts", async () => {
    const theme = createTheme("light", (family, weight) => (family === "mono" ? undefined : `Jakarta_${weight}`));
    const h1 = theme.text("h1");
    expect(h1.fontFamily).toBe("Jakarta_800");
    expect(h1.fontWeight).toBeUndefined();
    // mono falls back to the system font
    expect(theme.text("mono")).toMatchObject({ fontWeight: "400", fontVariant: ["tabular-nums"] });
  });

  it("allows a weight override", async () => {
    expect(createTheme("dark").text("body", "700").fontWeight).toBe("700");
  });
});

describe("ThemeProvider", () => {
  afterEach(() => jest.restoreAllMocks());

  it("defaults to light outside a provider", async () => {
    await render(<SchemeProbe />);
    expect(screen.getByTestId("probe")).toHaveTextContent(`light ${colors.light.surface}`);
  });

  it("follows the device color scheme", async () => {
    jest.spyOn(RN, "useColorScheme").mockReturnValue("dark");
    await render(
      <ThemeProvider>
        <SchemeProbe />
      </ThemeProvider>
    );
    expect(screen.getByTestId("probe")).toHaveTextContent(`dark ${colors.dark.surface}`);
  });

  it("lets the app force a scheme", async () => {
    jest.spyOn(RN, "useColorScheme").mockReturnValue("dark");
    await render(
      <ThemeProvider colorScheme="light">
        <SchemeProbe />
      </ThemeProvider>
    );
    expect(screen.getByTestId("probe")).toHaveTextContent(/^light/);
  });
});
