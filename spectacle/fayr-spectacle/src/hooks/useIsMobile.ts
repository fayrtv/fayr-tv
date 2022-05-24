import { useMediaQuery } from "@mantine/hooks";
import { MobileWidthThreshold } from "~/constants/mediaqueries";

export default function useIsMobile() {
    return useMediaQuery(`(max-width: ${MobileWidthThreshold}px)`, true);
}
