import type { MantineThemeOverride } from "@mantine/core";
import { Tuple, DefaultMantineColor } from "@mantine/core";

// NOTE:
// Color palettes are generated using
// https://omatsuri.app/color-shades-generator
// settings that produce exactly 10 colors, e.g. 16% / -20%.

// theme colors must be a 10-tuple string of colors
type ThemeColor = [string, string, string, string, string, string, string, string, string, string];

const sameColor = (color: string) => Array(10).fill(color) as ThemeColor;

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
    dir: "ltr",
    focusRing: "auto",
    loader: "oval",
    dateFormat: "MMMM D, YYYY",
    colorScheme: "light",
    white: "#fff",
    black: "#000",
    defaultRadius: "sm",
    transitionTimingFunction: "ease",
    // see https://mantine.dev/theming/extend-theme/#adding-custom-colors
    colors: {
        primary: sameColor("#4498D8"),
        secondary,
        success,
        danger,
    },
    lineHeight: 1.55,
    fontFamily:
        "SFPro, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
    fontFamilyMonospace: "Courier New, Courier, monospace",
    primaryColor: "primary",

    shadows: {
        xs: "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)",
        sm: "0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 10px 15px -5px, rgba(0, 0, 0, 0.04) 0px 7px 7px -5px",
        md: "0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px",
        lg: "0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 28px 23px -7px, rgba(0, 0, 0, 0.04) 0px 12px 12px -7px",
        xl: "0 1px 3px rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 0px 36px 28px -7px, rgba(0, 0, 0, 0.04) 0px 17px 17px -7px",
    },

    fontSizes: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
    },

    radius: {
        xs: 2,
        sm: 4,
        md: 8,
        lg: 16,
        xl: 32,
    },

    spacing: {
        xs: 4,
        sm: 10,
        md: 20,
        lg: 45,
        xl: 75,
    },

    breakpoints: {
        xs: 576,
        sm: 768,
        md: 992,
        lg: 1200,
        xl: 1400,
    },

    headings: {
        fontFamily:
            "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji",
        fontWeight: 700,
        sizes: {
            h1: { fontSize: 34, lineHeight: 1.3 },
            h2: { fontSize: 26, lineHeight: 1.35 },
            h3: { fontSize: 22, lineHeight: 1.4 },
            h4: { fontSize: 18, lineHeight: 1.45 },
            h5: { fontSize: 16, lineHeight: 1.5 },
            h6: { fontSize: 14, lineHeight: 1.5 },
        },
    },

    other: {},
    datesLocale: "en",
};

declare module "@mantine/core" {
    export interface MantineThemeColorsOverride {
        colors: Record<ExtendedCustomColors, Tuple<string, 10>>;
    }
}

export default spectacleTheme;
