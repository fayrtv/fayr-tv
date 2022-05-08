import { Box, Center } from "~/components/common";
import { ChevronRight } from "tabler-icons-react";

export default function ChevronRightCircle({ size = 25 }: { size?: number }) {
    return (
        <Center
            pl={2}
            sx={(theme) => ({
                borderRadius: "100%",
                background: theme.white,
                color: theme.colors.from "~/components/common"[0],
                width: size,
                height: size,
            })}
        >
            <ChevronRight />
        </Center>
    );
}
