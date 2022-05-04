import type { MantineThemeOverride } from "@mantine/core";
import { Tuple, DefaultMantineColor } from "@mantine/core";

// NOTE:
// Color palettes are generated using
// https://omatsuri.app/color-shades-generator
// settings that produce exactly 10 colors, e.g. 16% / -20%.

// theme colors must be a 10-tuple string of colors
type ThemeColor = [string, string, string, string, string, string, string, string, string, string];

const sameColor = (color: string) => Array(10).fill(color) as ThemeColor;

const primary = sameColor("#4498D8");

const secondary: ThemeColor = [
    "#F9FDFA",
    "#D5F4E0",
    "#B2EDC8",
    "#91E8B2",
    "#75DE9D",
    "#5ED48A",
    "#4AC97A",
    "#3DBB6C",
    "#3AA562",
    "#379159",
];
const success: ThemeColor = [
    "#C9EDD6",
    "#8BDEAB",
    "#53D885",
    "#24D366",
    "#249F52",
    "#227842",
    "#1E5B35",
    "#1B452B",
    "#173522",
    "#13291B",
];
const danger: ThemeColor = [
    "#F9C0C0",
    "#F77979",
    "#F93939",
    "#FF0000",
    "#C60606",
    "#9A0909",
    "#780B0B",
    "#5D0B0B",
    "#480B0B",
    "#380A0A",
];

type ExtendedCustomColors = "primary" | "secondary" | "success" | "danger" | DefaultMantineColor;
const spectacleTheme: MantineThemeOverride = {
    // see https://mantine.dev/theming/extend-theme/#adding-custom-colors
    colors: {
        primary,
        secondary,
        success,
        danger,
    },
    fontFamily:
        "SFPro, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
    fontFamilyMonospace: "Courier New, Courier, monospace",
    primaryColor: "primary",
    defaultRadius: "sm",
};

declare module "@mantine/core" {
    export interface MantineThemeColorsOverride {
        colors: Record<ExtendedCustomColors, Tuple<string, 10>>;
    }
}

export default spectacleTheme;
