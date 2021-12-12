const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        colors: {
            background: "#07090c",
            neutral: "#D9D9D9",
            white: "#ffffff",
            primary: "#fa7751",
        },
        extend: {
            fontFamily: {
                sans: ["WinnerSans", defaultTheme.fontFamily.sans],
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
