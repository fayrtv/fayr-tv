import { AppShell } from "~/components/common";
import React, { ComponentProps, PropsWithChildren, ReactChild } from "react";

import Header from "~/components/layout/Header";
import { Anchor, Aside, Navbar } from "@mantine/core";
import { useRouter } from "next/router";
import { NextLink } from "@mantine/next";
import Link from "next/link";

const ThemeAdaptiveAnchor = ({
    href,
    ...props
}: PropsWithChildren<Omit<React.ComponentPropsWithoutRef<typeof Anchor>, "sx">> & {
    href: string;
}) => {
    const router = useRouter();

    return (
        <Link href={href} passHref>
            <Anchor
                {...props}
                sx={(theme) => ({
                    color: theme.colorScheme === "dark" ? theme.white : theme.black,
                    textDecoration: router.route === href ? "underline" : "none",
                })}
            >
                {props.children}
            </Anchor>
        </Link>
    );
};

type Props = {
    children: ReactChild;
    subHeader?: ComponentProps<typeof Header>["subHeader"];
};

const Layout = ({ children, subHeader = { enabled: true } }: Props) => {
    const [burgerOpen, setBurgerOpen] = React.useState(false);
    return (
        <AppShell
            header={
                <Header
                    burgerOpen={burgerOpen}
                    setBurgerOpen={setBurgerOpen}
                    subHeader={subHeader}
                />
            }
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
                                <NextLink href={"/content/spectaclepass"}>Brillenpass</NextLink>
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

export function layoutFactory(props: Omit<Props, "children">) {
    // eslint-disable-next-line react/display-name
    return ({ children }: Pick<Props, "children">) => <Layout {...props}>{children}</Layout>;
}

export default Layout;
