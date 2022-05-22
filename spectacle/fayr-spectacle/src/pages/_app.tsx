// noinspection JSUnusedGlobalSymbols
import { ColorScheme, ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import Amplify, { withSSRContext } from "aws-amplify";
import { AppProps } from "next/app";
import Head from "next/head";
import { Fragment, ReactNode, useState } from "react";
import { getCookie, setCookies } from "cookies-next";
import config from "~/aws-exports";
import "dayjs/locale/de";

import "../styles/globals.scss";

import spectacleTheme, { spectacleStyles } from "../theming/mantine";
import StoreInfoProvider from "~/components/StoreInfoProvider";
import { GetServerSidePropsContext } from "next";
import { QueryClient, QueryClientProvider } from "react-query";
import { DataStore } from "@aws-amplify/datastore";
import { Store } from "~/models";
import { deserializeModel, SerializedModel, serializeModel } from "~/models/amplify-models";
import { getCurrentStore } from "~/helpers/storeLocator";

// TODO: https://ordinarycoders.com/blog/article/nextjs-aws-amplify
// https://www.youtube.com/watch?v=YvoyHgZWSFY&ab_channel=BojidarYovchev

Amplify.configure({
    ...config,
    ssr: true,
});

const queryClient = new QueryClient();

type ServerInitialProps = { colorScheme: ColorScheme; store: SerializedModel<Store> };

export default function App({
    Component,
    colorScheme,
    pageProps,
    store,
}: AppProps & ServerInitialProps) {
    const [currentColorScheme, setCurrentColorScheme] = useState<ColorScheme>(colorScheme);

    const Layout =
        (
            Component as typeof Component & {
                layoutProps: {
                    Layout: (props: { children: ReactNode } & unknown) => JSX.Element;
                };
            }
        ).layoutProps?.Layout || Fragment;

    const toggleColorScheme = (value?: ColorScheme) => {
        const nextColorScheme = value || (currentColorScheme === "dark" ? "light" : "dark");
        setCurrentColorScheme(nextColorScheme);
        setCookies("mantine-color-scheme", nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
    };

    return (
        <>
            <Head>
                <title>{store.name}</title>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
            </Head>

            <ColorSchemeProvider
                colorScheme={currentColorScheme}
                toggleColorScheme={toggleColorScheme}
            >
                <MantineProvider
                    withGlobalStyles
                    withNormalizeCSS
                    styles={spectacleStyles}
                    theme={{
                        ...spectacleTheme,
                        colorScheme: currentColorScheme,
                        // you can change primaryColor w.r.t colorScheme here
                    }}
                >
                    <QueryClientProvider client={queryClient}>
                        <NotificationsProvider>
                            <StoreInfoProvider value={store}>
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

App.getInitialProps = async (ctx: GetServerSidePropsContext) => {
    const store = await getCurrentStore(ctx.req);

    return {
        colorScheme: getCookie("mantine-color-scheme", ctx) || "light",
        store: serializeModel(store),
    } as ServerInitialProps;
};
