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
};
