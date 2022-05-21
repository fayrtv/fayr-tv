import { Anchor, Aside, Navbar } from "@mantine/core";
import { NextLink } from "@mantine/next";
import React, { PropsWithChildren } from "react";
import { useRouter } from "next/router";
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
    open: boolean;
};

export const Sidebar = ({ open }: Props) => {
    return (
        <Aside
            p="md"
            hidden={!open}
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
                        <ThemeAdaptiveAnchor href={"/auth/signin"}>Einloggen</ThemeAdaptiveAnchor>
                    </li>
                    <li>
                        <ThemeAdaptiveAnchor href={"/auth/recover"}>
                            Passwort vergessen
                        </ThemeAdaptiveAnchor>
                    </li>
                    <li>
                        <ThemeAdaptiveAnchor href={"/about"}>
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
                            href={"/content/customermanagement/create-refraction-protocol"}
                        >
                            Kundenverwaltung
                        </ThemeAdaptiveAnchor>
                    </li>
                </ul>
            </Navbar.Section>
        </Aside>
    );
};
