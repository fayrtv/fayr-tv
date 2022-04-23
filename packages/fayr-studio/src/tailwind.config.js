/*
For reference, the default Tailwind config can be found at:
https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

module.exports = {
    mode: "jit",
    content: ["./src/**/*.{js,jsx,ts,tsx}", "../common/lib/**/*.{js,jsx}"],
    theme: {
        extend: {
            fontSize: {
                base: "1rem",
            },
            colors: {
                background: "var(--color-background)",
                neutral: "var(--color-neutral)",
                white: "var(--color-white)",
                primary: "var(--color-primary)",
                "primary-dark": "var(--color-primary-dark)",
                "primary-light": "var(--color-primary-light)",
                gray: "var(--color-gray)",
                blueish: "var(--color-blueish)",
            },
            fontFamily: {
                sans: ['"Segoe UI"'],
                upper: ["WinnerSans", defaultTheme.fontFamily.sans],
            },
        },
    },
    plugins: [
        require("@tailwindcss/forms"),
        // https://stackoverflow.com/questions/60854215/tailwind-use-font-from-local-files-globally
        plugin(({ addBase }) => {
            addBase({
                "@font-face": {
                    fontFamily: "WinnerSans",
                    fontWeight: "300",
                    src: "url(/fonts/font.woff)",
                },
            });
            addBase({
                "@font-face": {
                    fontFamily: "Roboto",
                    fontWeight: "300",
                    src: "url(/fonts/font.woff)",
                },
            });
        }),
    ],
};
