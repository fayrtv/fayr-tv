import { useMediaQuery } from "@mantine/hooks";
import { MobileWidthThreshold } from "~/constants/mediaqueries";
import { useMantineTheme } from "@mantine/core";

export default function useIsMobile() {
    const theme = useMantineTheme();
    return useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`, true);
}
