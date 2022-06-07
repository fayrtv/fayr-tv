import { useMediaQuery as useMantineMediaQuery } from "@mantine/hooks";
import { useMantineTheme } from "@mantine/core";

export default function useMediaQuery() {
    const theme = useMantineTheme();
    return {
        isMobile: useMantineMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`, true),
        isTablet: useMantineMediaQuery(`(max-width: ${theme.breakpoints.md}px)`, true),
        isDesktop: useMantineMediaQuery(`(max-width: ${theme.breakpoints.lg}px)`, true),
    };
}
