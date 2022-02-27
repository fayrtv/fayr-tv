module.exports = {
    content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
    theme: {
        extend: {
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
        },
    },
    plugins: [],
};
