const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

module.exports = {
    mode: "jit",
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontSize: {
                base: "1rem",
            },
            colors: {
                background: "#07090C",
                neutral: "#D9D9D9",
                white: "#ffffff",
                primary: "#fa7751",
                "primary-dark": "#d96242",
                "primary-light": "#fa8966",
                gray: "#C4C4C4",
                blueish: "#181F29",
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
        plugin(function ({ addBase }) {
            addBase({
                "@font-face": {
                    fontFamily: "WinnerSans",
                    fontWeight: "300",
                    src: "url(/src/fonts/font.woff)",
                },
            });
        }),
    ],
};
