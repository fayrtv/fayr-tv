import { ColorScheme, ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import Amplify from "aws-amplify";
import { AppProps } from "next/app";
import Head from "next/head";
import { Fragment, ReactNode, useState } from "react";
import { getCookie, setCookies } from "cookies-next";
import config from "~/aws-exports";
import "dayjs/locale/de";

import "../styles/globals.scss";

import zeissTheme from "../theming/mantine";
import StoreInfoProvider, { useStoreInfo } from "~/components/StoreInfoProvider";
import { GetServerSidePropsContext } from "next";
import { QueryClient, QueryClientProvider } from "react-query";

// TODO: https://ordinarycoders.com/blog/article/nextjs-aws-amplify
// https://www.youtube.com/watch?v=YvoyHgZWSFY&ab_channel=BojidarYovchev

Amplify.configure({
    ...config,
    ssr: true,
});

const queryClient = new QueryClient();

const storeInfo = {
    name: "ZEISS Vision Center",
    city: "Osnabrück",
    owner: "Reiner Siekemeyer",
    fullAddress: "Lorzingstraße 4, 49074 Osnabrück",
    phoneNumber: "0541 80079119",
};

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
        setCookies("mantine-color-scheme", nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
    };

    return (
        <>
            <Head>
                <title>{storeInfo.name}</title>
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
                    <QueryClientProvider client={queryClient}>
                        <NotificationsProvider>
                            <StoreInfoProvider value={storeInfo}>
                                <Layout>
                                    <Component {...pageProps} />
                                </Layout>
                            </StoreInfoProvider>
                        </NotificationsProvider>
                    </QueryClientProvider>
                </MantineProvider>
            </ColorSchemeProvider>
        </>
    );
}

App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
    colorScheme: getCookie("mantine-color-scheme", ctx) || "light",
});
