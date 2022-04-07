/*
CSS modules from shared-components must be transpiled before use.
 */
const withTM = require("next-transpile-modules")(["@fayr/common"]);

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    /* config options here */
};

module.exports = withTM(nextConfig);
