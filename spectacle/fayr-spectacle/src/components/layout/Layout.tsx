import { AppShell } from "~/components/common";
import { PropsWithChildren, ReactChild } from "react";

import Header from "~/components/layout/Header";
import React from "react";
import { Anchor, Aside, Navbar, useMantineColorScheme } from "@mantine/core";
import { useRouter } from "next/router";

type Props = {
    children: ReactChild;
};

const ThemeAdaptiveAnchor = (
    props: PropsWithChildren<Omit<React.ComponentPropsWithoutRef<typeof Anchor>, "sx">> & {
        href: string;
    },
) => {
    const router = useRouter();

    return (
        <Anchor
            {...props}
            sx={(theme) => ({
                color: theme.colorScheme === "dark" ? theme.white : theme.black,
                textDecoration: router.route === props.href ? "underline" : "none",
            })}
        >
            {props.children}
        </Anchor>
    );
};

const Layout = ({ children }: Props) => {
    const [burgerOpen, setBurgerOpen] = React.useState(false);
    return (
        <AppShell
            header={<Header burgerOpen={burgerOpen} setBurgerOpen={setBurgerOpen} />}
            styles={{
                root: { height: "100vh", display: "flex", flexDirection: "column" },
                main: { padding: 0 },
                body: { flexGrow: 1 },
            }}
            aside={
                <Aside
                    p="md"
                    hidden={!burgerOpen}
                    width={{ sm: 200, lg: 300 }}
                    sx={(theme) => ({
                        backgroundColor: `rgb(${
                            theme.colorScheme === "light" ? "255, 255, 2555" : "0, 0, 0"
                        }, 0.75)`,
                    })}
                    hiddenBreakpoint={50000}
                    fixed
                >
                    <Navbar.Section>
                        <h2>Sitemap</h2>
                        <ul>
                            <li>
                                <ThemeAdaptiveAnchor href={"/content/spectaclepass"}>
                                    Brillenpass
                                </ThemeAdaptiveAnchor>
                            </li>
                            <li>
                                <ThemeAdaptiveAnchor href={"/auth/signup"}>
                                    Registrieren
                                </ThemeAdaptiveAnchor>
                            </li>
                            <li>
                                <ThemeAdaptiveAnchor href={"/auth/signin"}>
                                    Einloggen
                                </ThemeAdaptiveAnchor>
                            </li>
                            <li>
                                <ThemeAdaptiveAnchor href={"/auth/recover"}>
                                    Passwort vergessen
                                </ThemeAdaptiveAnchor>
                            </li>
                            <li>
                                <ThemeAdaptiveAnchor href={"/about/digital-spectacle-passport"}>
                                    Infos zum Brillenpass
                                </ThemeAdaptiveAnchor>
                            </li>
                            <li>
                                <ThemeAdaptiveAnchor href={"/content/fittingroom"}>
                                    Anprobe
                                </ThemeAdaptiveAnchor>
                            </li>
                            <li>
                                <ThemeAdaptiveAnchor href={"/appointment"}>
                                    Terminvereinbarung
                                </ThemeAdaptiveAnchor>
                            </li>
                            <li>
                                <ThemeAdaptiveAnchor
                                    href={"/content/customermanagement/createrefractionprotocol"}
                                >
                                    Kundenverwaltung
                                </ThemeAdaptiveAnchor>
                            </li>
                        </ul>
                    </Navbar.Section>
                </Aside>
            }
        >
            {children}
        </AppShell>
    );
};

export default Layout;
