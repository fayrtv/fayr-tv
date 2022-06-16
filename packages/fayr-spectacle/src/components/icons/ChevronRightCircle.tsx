import { Box, Center } from "@mantine/core";
import { ChevronRight } from "tabler-icons-react";

export default function ChevronRightCircle({ size = 25 }: { size?: number }) {
    return (
        <Center
            pl={2}
            sx={(theme) => ({
                borderRadius: "100%",
                background: theme.white,
                color: theme.colors.primary[6],
                width: size,
                height: size,
            })}
        >
            <ChevronRight />
        </Center>
    );
}
