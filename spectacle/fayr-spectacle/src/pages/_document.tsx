import { createGetInitialProps } from "@mantine/next";
import Document, { Head, Html, Main, NextScript } from "next/document";

const getInitialProps = createGetInitialProps();

export default class _Document extends Document {
    static getInitialProps = getInitialProps;

    render() {
        return (
            <Html>
                <Head>
                    <link rel="icon" href="/images/favicon.ico" />
                    <link rel="preload" href="fonts/sfproregular.ttf" as="font" crossOrigin="*" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
