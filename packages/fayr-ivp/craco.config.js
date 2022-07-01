module.exports = {
    webpack: {
        configure: {
            //#region https://github.com/papnkukn/qrcode-svg/issues/11#issuecomment-750513699
            resolve: {
                fallback: {
                    fs: false,
                },
            },
            //#endregion
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        enforce: "pre",
                        use: ["source-map-loader"],
                    },
                ],
            },
            ignoreWarnings: [/amazon-chime-sdk-js/, /inversify/],
        },
    },
    babel: {
        presets: [],
        plugins: [
            "babel-plugin-transform-typescript-metadata",
            ["@babel/plugin-proposal-decorators", { version: "legacy", loose: true }],
            ["@babel/plugin-proposal-class-properties", { loose: true }],
            ["@babel/plugin-proposal-private-methods", { loose: true }],
            ["@babel/plugin-proposal-private-property-in-object", { loose: true }],
        ],
    },
};
