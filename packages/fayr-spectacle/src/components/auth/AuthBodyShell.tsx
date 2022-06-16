import { useMantineColorScheme, Center, Overlay, Paper, Box, Text, Anchor } from "@mantine/core";
import React, { PropsWithChildren } from "react";
import ZeissLogo from "~/components/ZeissLogo";
import Link from "next/link";

type Props = {
    notification?: string | React.ReactNode;
    header?: string | React.ReactNode;
    subHeader?: string | React.ReactNode;
    largeTextBox?: boolean;
};

export const AuthBodyShell = ({
    children,
    notification,
    header,
    subHeader,
    largeTextBox = true,
}: PropsWithChildren<Props>) => {
    const { colorScheme } = useMantineColorScheme();

    return (
        <Center
            style={{
                backgroundImage: "url(/assets/zeiss_vision_center_osnabrueck.png)",
                backgroundSize: "cover",
                height: "100%",
                width: "100%",
            }}
        >
            {colorScheme === "dark" && <Overlay opacity={0.6} color="black" zIndex={1} blur={2} />}
            <Paper
                sx={(theme) => ({
                    zIndex: 1,
                    background: "transparent",
                    position: "relative",
                    "&:before": {
                        content: '""',
                        backgroundColor:
                            colorScheme === "light" ? theme.white : theme.colors.dark[7],
                        position: "absolute",
                        zIndex: -1,
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        opacity: 0.96,
                    },
                })}
                px="xl"
                py="lg"
            >
                <Center>
                    <ZeissLogo />
                </Center>
                <Box mt={largeTextBox ? "xl" : "md"}>
                    {notification}
                    <Text transform="uppercase" color="primary" weight="bold" size="lg">
                        {header}
                    </Text>
                    {subHeader && (
                        <Text
                            color={colorScheme === "light" ? "black" : "white"}
                            size="lg"
                            weight="bold"
                            mt="xs"
                        >
                            {subHeader}
                        </Text>
                    )}
                    {children}

                    <Box sx={{ textAlign: "center", maxWidth: 250 }} mx="auto" mt="lg">
                        <Text size="sm">
                            Noch kein Benutzerkonto?{" "}
                            <Link href="~/pages/auth/signup" passHref>
                                <Anchor href="signup" size="sm">
                                    Hier kostenlos registrieren{" "}
                                </Anchor>
                            </Link>
                            für den{" "}
                            <Link href="/src/pages/AboutDigitalSpectaclePassportPage" passHref>
                                <Anchor
                                    sx={(theme) => ({
                                        color: colorScheme === "dark" ? theme.white : theme.black,
                                        textDecoration: "underline",
                                        ":hover": { color: theme.colors.primary },
                                    })}
                                    target="__blank"
                                    size="sm"
                                >
                                    Digitalen Brillenpass
                                </Anchor>
                            </Link>
                            .
                        </Text>
                    </Box>
                </Box>
            </Paper>
        </Center>
    );
};
