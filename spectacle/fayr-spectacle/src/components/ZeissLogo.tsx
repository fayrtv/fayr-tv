import { Box, Center, Image, Stack, Text, useMantineColorScheme } from "@mantine/core";
import React from "react";

type Props = Omit<React.ComponentProps<typeof Image>, "size" | "alt"> & {
    size?: number;
};

export default function ZeissLogo({ size = 80, ...props }: Props) {
    const { colorScheme } = useMantineColorScheme();
    return (
        <Stack align="center" spacing={14} style={{ userSelect: "none" }}>
            <Image src={"/assets/zeiss-logo.svg"} alt="ZEISS Logo" width={size} {...props} />
            <Text
                color={colorScheme === "light" ? "black" : "white"}
                sx={{
                    fontSize: 14,
                    fontFamily: "Frutiger Next",
                    fontWeight: 500,
                    letterSpacing: 0.4,
                }}
            >
                Seeing beyond
            </Text>
        </Stack>
    );
}
