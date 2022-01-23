import Document, { Html, Head, Main, NextScript } from "next/document";
import type { DocumentContext } from "next/document";

class FayrStudioDocument extends Document {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-member-accessibility
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility, @typescript-eslint/explicit-module-boundary-types
    render() {
        return (
            <Html lang="en">
                <Head>
                    <script
                        async
                        defer
                        data-domain={process.env.URL}
                        src="https://plausible.io/js/plausible.js"
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default FayrStudioDocument;
