const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
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
                    fontWheight: "300",
                    src: "url(/src/fonts/font.woff)",
                },
            });
        }),
    ],
};
