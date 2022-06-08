import { Anchor, Aside, Center, List, MediaQuery, Overlay, Text } from "@mantine/core";
import React, { PropsWithChildren } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import ThemeToggleButton from "~/components/layout/ThemeToggleButton";
import { useSession } from "~/hooks/useSession";
import { useClickOutside } from "@mantine/hooks";

type Props = {
    open: boolean;
    onClickOutside: () => void;
};

export const Sidebar = ({ open, onClickOutside }: Props) => {
    const { isAuthenticated, isAdmin } = useSession();
    const debug = process.env.NODE_ENV === "development";

    const sidebarRef = useClickOutside<HTMLDivElement>(onClickOutside, ["click"]);

    return (
        <Aside
            p="lg"
            hidden={!open}
            width={{ sm: 280 }}
            sx={(theme) => ({
                zIndex: 1,
                background: "transparent",
                "&:before": {
                    content: '""',
                    backgroundColor:
                        theme.colorScheme === "light" ? theme.colors.gray[1] : theme.colors.dark[8],
                    position: "absolute",
                    zIndex: -1,
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    opacity: 0.7,
                },
            })}
            hiddenBreakpoint={50000}
            fixed
            ref={sidebarRef}
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
                        <MenuItem href={"/appointment"}>Termin vereinbaren</MenuItem>
                    </List.Item>
                    <List.Item>
                        <MenuItem href={"/fittingroom"}>Online Anprobe</MenuItem>
                    </List.Item>

                    {debug && (
                        <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                            <div>
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
                                    <MenuItem href={"/auth/requestpasswordreset"}>
                                        Passwort vergessen
                                    </MenuItem>
                                </List.Item>
                                <List.Item>
                                    <MenuItem href={"/customermanagement"}>
                                        Kundenverwaltung
                                    </MenuItem>
                                </List.Item>
                            </div>
                        </MediaQuery>
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
                                <MenuItem href={"/auth/signin?logout=true"}>Abmelden</MenuItem>
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

const MenuItem = ({ href, children }: PropsWithChildren<{ href: string }>) => {
    const isActive = useRouter().asPath === href;

    return (
        <Link href={href} passHref>
            <Anchor
                sx={(theme) => ({
                    fontSize: theme.fontSizes.xl,
                    color: isActive
                        ? theme.colors.primary[6]
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
