import { MantineProvider, ColorScheme, ColorSchemeProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { AppProps } from "next/app";
import Head from "next/head";
import { Fragment, ReactNode, useState } from "react";

import "../styles/globals.scss";

import zeissTheme from "../theming/mantine";

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
    const { Component, pageProps } = props;
    const [colorScheme, setColorScheme] = useState<ColorScheme>(props.colorScheme);

    const Layout =
        (
            Component as typeof Component & {
                layoutProps: {
                    Layout: (props: { children: ReactNode } & unknown) => JSX.Element;
                };
            }
        ).layoutProps?.Layout || Fragment;

    const toggleColorScheme = (value?: ColorScheme) => {
        const nextColorScheme = value || (colorScheme === "dark" ? "light" : "dark");
        setColorScheme(nextColorScheme);
        // NOTE: if you want to, set cookie here
    };

    return (
        <>
            <Head>
                <title>Zeiss Vision Center</title>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
            </Head>

            <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
                <MantineProvider
                    withGlobalStyles
                    withNormalizeCSS
                    theme={{
                        ...zeissTheme,
                        colorScheme,
                        // you can change primaryColor w.r.t colorScheme here
                    }}
                >
                    <NotificationsProvider>
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </NotificationsProvider>
                </MantineProvider>
            </ColorSchemeProvider>
        </>
    );
}
