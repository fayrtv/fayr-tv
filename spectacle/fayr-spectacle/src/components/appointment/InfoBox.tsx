import React, { PropsWithChildren } from "react";
import { Paper, useMantineColorScheme } from "@mantine/core";
import { Text } from "@mantine/core";

export const InfoBox = ({ children }: PropsWithChildren<{}>) => {
    const { colorScheme } = useMantineColorScheme();

    return (
        <Paper
            sx={(theme) => ({
                backgroundColor:
                    colorScheme === "light" ? theme.colors.primary[3] : theme.colors.dark[5],
                userSelect: "all",
            })}
            py={7}
            px="sm"
        >
            <Text size="sm" color="primary">
                {children}
            </Text>
        </Paper>
    );
};
