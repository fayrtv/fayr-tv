import { AppShell } from "~/components/common";
import { ReactChild } from "react";

import Header from "~/components/layout/Header";
import React from "react";
import { Anchor, Aside, Navbar } from "@mantine/core";

type Props = {
    children: ReactChild;
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
                    hiddenBreakpoint={50000}
                    fixed
                >
                    <Navbar.Section>
                        <h2>Sitemap</h2>
                        <ul>
                            <li>
                                <Anchor href={"/content/spectaclepass"}>Brillenpass</Anchor>
                            </li>
                            <li>
                                <Anchor href={"/auth/signup"}>Registrieren</Anchor>
                            </li>
                            <li>
                                <Anchor href={"/auth/signin"}>Einloggen</Anchor>
                            </li>
                            <li>
                                <Anchor href={"/auth/recover"}>Passwort vergessen</Anchor>
                            </li>
                            <li>
                                <Anchor href={"/about/digital-spectacle-passport"}>
                                    Infos zum Brillenpass
                                </Anchor>
                            </li>
                            <li>
                                <Anchor href={"/content/fittingroom"}>Anprobe</Anchor>
                            </li>
                            <li>
                                <Anchor href={"/appointment"}>Terminvereinbarung</Anchor>
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
