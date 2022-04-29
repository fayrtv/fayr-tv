const withReactSvg = require("next-react-svg");
const path = require("path");

/*
CSS modules from shared-components must be transpiled before use.
 */
const withTM = require("next-transpile-modules")(["@fayr/common"]);

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    // https://www.npmjs.com/package/next-react-svg
    include: path.resolve(__dirname, "src/assets"),
    webpack(config, options) {
        return config;
    },
};

module.exports = withTM(withReactSvg(nextConfig));
