import { Anchor, Aside, Center, List, Overlay, Text } from "@mantine/core";
import React, { PropsWithChildren } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import ThemeToggleButton from "~/components/layout/ThemeToggleButton";
import { useSession } from "~/hooks/useSession";
import useIsMobile from "~/hooks/useIsMobile";

const MenuItem = ({ href, children }: PropsWithChildren<{ href: string }>) => {
    const isActive = useRouter().asPath === href;

    return (
        <Link href={href} passHref>
            <Anchor
                sx={(theme) => ({
                    fontSize: theme.fontSizes.xl,
                    color: isActive
                        ? theme.colors.primary[9]
                        : theme.colorScheme === "light"
                        ? theme.black
                        : theme.white,
                })}
            >
                {children}
            </Anchor>
        </Link>
    );
};

type Props = {
    open: boolean;
};

export const Sidebar = ({ open }: Props) => {
    const { isAuthenticated, isAdmin } = useSession();
    const isMobile = useIsMobile();
    const debug = process.env.NODE_ENV === "development";

    return (
        <Aside
            p="lg"
            hidden={!open}
            width={{ sm: 280 }}
            sx={{ backgroundColor: "transparent" }}
            hiddenBreakpoint={50000}
            fixed
        >
            <Overlay blur={11} zIndex={-1} color="transparent" />
            <Aside.Section grow>
                <List listStyleType="none" center spacing="md">
                    {isAuthenticated ? (
                        <>
                            {isAdmin && (
                                <List.Item>
                                    <MenuItem
                                        href={"/customermanagement/create-refraction-protocol"}
                                    >
                                        Kundenverwaltung
                                    </MenuItem>
                                </List.Item>
                            )}
                            <List.Item>
                                <MenuItem href={"/spectaclepass"}>Digitaler Brillenpass</MenuItem>
                            </List.Item>

                            <List.Item>
                                <MenuItem href={"/appointment"}>Termin vereinbaren</MenuItem>
                            </List.Item>
                        </>
                    ) : (
                        <>
                            <List.Item>
                                <MenuItem href={"/auth/signin"}>Einloggen</MenuItem>
                            </List.Item>
                            <List.Item>
                                <MenuItem href={"/auth/signup"}>Registrieren</MenuItem>
                            </List.Item>
                        </>
                    )}
                    <List.Item>
                        <MenuItem href={"/about"}>Mehr erfahren</MenuItem>
                    </List.Item>
                    <List.Item>
                        <MenuItem href={"/fittingroom"}>Online Anprobe</MenuItem>
                    </List.Item>

                    {debug && !isMobile && (
                        <>
                            <Text size="sm" mt="lg">
                                Debug pages:
                            </Text>
                            <List.Item>
                                <MenuItem href={"/welcome"}>Willkommen</MenuItem>
                            </List.Item>
                            <List.Item>
                                <MenuItem href={"/auth/signup"}>Registrieren</MenuItem>
                            </List.Item>
                            <List.Item>
                                <MenuItem href={"/auth/signin"}>Einloggen</MenuItem>
                            </List.Item>
                            <List.Item>
                                <MenuItem href={"/auth/recover"}>Passwort vergessen</MenuItem>
                            </List.Item>
                            <List.Item>
                                <MenuItem href={"/customermanagement/create-refraction-protocol"}>
                                    Kundenverwaltung
                                </MenuItem>
                            </List.Item>
                            <List.Item>
                                <MenuItem href={"/appointment"}>Termin vereinbaren</MenuItem>
                            </List.Item>
                        </>
                    )}
                </List>
            </Aside.Section>
            <Aside.Section>
                <List listStyleType="none" center spacing="md">
                    {isAuthenticated && (
                        <>
                            <List.Item>
                                <MenuItem href={"/settings"}>Einstellungen</MenuItem>
                            </List.Item>
                            <List.Item>
                                <MenuItem href={"/auth/signout"}>Abmelden</MenuItem>
                            </List.Item>
                        </>
                    )}
                </List>
            </Aside.Section>
            <Aside.Section mt="xl">
                <Center>
                    <ThemeToggleButton />
                </Center>
            </Aside.Section>
        </Aside>
    );
};
