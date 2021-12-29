const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

module.exports = {
    mode: "jit",
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    purge: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                background: "#07090C",
                neutral: "#D9D9D9",
                white: "#ffffff",
                primary: "#fa7751",
                gray: "#181F29",
            },
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
