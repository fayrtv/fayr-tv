import type {
    ButtonStylesParams,
    DefaultMantineColor,
    MantineProviderProps,
    MantineThemeOverride,
} from "@mantine/core";
import { Tuple } from "@mantine/core";
import { MantineTheme } from "@mantine/styles/lib/theme/types";
import { CSSObject } from "@mantine/styles/lib/tss";

// theme colors must be a 10-tuple string of colors from light to dark shade
type Shade = [string, string, string, string, string, string, string, string, string, string];

const sameColor = (color: string) => Array(10).fill(color) as Shade;

const primary: Shade = [
    "#CFE4F4",
    "#B4D5EE",
    "#9AC6E8",
    "#83B9E3",
    "#6CADDF",
    "#57A2DB",
    "#4498D8",
    "#328ED3",
    "#2B83C5",
    "#2878B5",
];
const secondary = sameColor("#91E9B2");
const success: Shade = [
    "#E6F6EC",
    "#CBEED8",
    "#AEEAC5",
    "#91E9B2",
    "#7EDDA2",
    "#6FD194",
    "#62C487",
    "#58B77B",
    "#51A872",
    "#4F966A",
];
const danger = sameColor("#FF3333");
const gray: Shade = [
    "#f8f9fa",
    "#f1f3f5",
    "#e9ecef",
    "#dee2e6",
    "#ced4da",
    "#9b9b9b",
    "#616167",
    "#495057",
    "#343a40",
    "#212529",
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
    // | /*builtin, used for dark mode*/ "dark"
    | DefaultMantineColor;
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
        white: sameColor("#ffffff"),
        black: sameColor("#000000"),
    },
    lineHeight: 1.5,
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
        xxxs: 7,
        xxs: 10,
        xs: 12,
        sm: 14,
        md: 15,
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
        xs: 3,
        sm: 10,
        md: 20,
        lg: 40,
        xl: 75,
    },

    breakpoints: {
        xs: 320,
        sm: 481,
        md: 769,
        lg: 1025,
        xl: 1201,
    },

    other: {},
    datesLocale: "de",
};

declare module "@mantine/core" {
    export interface MantineThemeColorsOverride {
        colors: Record<CustomColors, Tuple<string, 10>>;
    }
}

export const spectacleStyles: MantineProviderProps["styles"] = {
    Button: {
        inner: { fontWeight: "lighter" },
    },
    Anchor: (theme) => ({
        root: {
            color:
                theme.colorScheme === "light" ? theme.colors.primary[6] : theme.colors.primary[4],
            ":hover": {
                textDecoration: "underline",
                textDecorationColor: theme.colors.primary[6],
            },
        },
    }),
};

export default spectacleTheme;
