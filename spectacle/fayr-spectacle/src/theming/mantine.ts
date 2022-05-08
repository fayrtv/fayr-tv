import type { MantineThemeOverride } from "@mantine/core";
import { Tuple } from "@mantine/core";

// theme colors must be a 10-tuple string of colors from light to dark shade
type ThemeColor = [string, string, string, string, string, string, string, string, string, string];

const sameColor = (color: string) => Array(10).fill(color) as ThemeColor;

const primary: ThemeColor = [
    "#EBF5FB",
    "#EBF5FB",
    "#EBF5FB",
    "#EBF5FB",
    "#EBF5FB",
    "#4498D8",
    "#4498D8",
    "#4498D8",
    "#4498D8",
    "#4498D8",
];
const secondary = sameColor("#91E9B2");
const success: ThemeColor = sameColor("#91E9B2");
const danger: ThemeColor = sameColor("#FF0000");
const gray: ThemeColor = [
    "#A8A8A8",
    "#A8A8A8",
    "#A8A8A8",
    "#A8A8A8",
    "#A8A8A8",
    // TODO: oh oh, what a crap...
    "#6C6C6C",
    "#6C6C6C",
    "#6C6C6C",
    "#6C6C6C",
    "#6C6C6C",
];

type MantineSizeOverride = "xxxs" | "xxs" | "xs" | "sm" | "md" | "lg" | "xl";

declare module "@mantine/styles" {
    export type MantineSize = MantineSizeOverride;
}

type CustomColors =
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "gray"
    | /*builtin, used for dark mode*/ "dark";
// | DefaultMantineColor;
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
        primary,
        secondary,
        success,
        danger,
        gray,
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
        xxxs: 8.5,
        xxs: 10,
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
    } as Record<MantineSizeOverride, number>,

    headings: {
        fontFamily:
            "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji",
        fontWeight: 700,
        sizes: {
            h1: { fontSize: 32, lineHeight: 1.3 },
            h2: { fontSize: 20, lineHeight: 1.3 },
            h3: { fontSize: 18, lineHeight: 1.4 },
            h4: { fontSize: 16, lineHeight: 1.45 },
            h5: { fontSize: 16, lineHeight: 1.5 },
            h6: { fontSize: 14, lineHeight: 1.5 },
        },
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

    other: {},
    datesLocale: "de",
};

declare module "@mantine/core" {
    export interface MantineThemeColorsOverride {
        colors: Record<CustomColors, Tuple<string, 10>>;
    }
}

export default spectacleTheme;
