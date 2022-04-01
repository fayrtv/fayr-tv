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
            ignoreWarnings: [/amazon-chime-sdk-js/],
        },
    },
    babel: {
        presets: [],
        plugins: [
            "babel-plugin-transform-typescript-metadata",
            ["@babel/plugin-proposal-decorators", { version: "legacy" }],
            ["@babel/plugin-proposal-class-properties", { loose: true }],
        ],
        loaderOptions: (babelLoaderOptions, { env, paths }) => {
            return babelLoaderOptions;
        },
    },
};
