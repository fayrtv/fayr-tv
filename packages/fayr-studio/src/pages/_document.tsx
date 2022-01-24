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
        // noinspection HtmlRequiredTitleElement
        return (
            <Html lang="en" className="h-full bg-gray-50">
                <Head>
                    <meta charSet="utf-8" />
                    <link rel="manifest" href="manifest.json" />
                    <script
                        async
                        defer
                        data-domain={process.env.URL}
                        src="https://plausible.io/js/plausible.js"
                    />
                </Head>
                <body className="h-full">
                    <div id="root" className="h-full overflow-hidden">
                        <Main />
                        <NextScript />
                    </div>
                </body>
            </Html>
        );
    }
}

export default FayrStudioDocument;
