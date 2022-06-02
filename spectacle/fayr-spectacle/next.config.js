/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa");

const nextConfig = {
    reactStrictMode: true,
    pwa: {
        dest: "public",
        register: true,
        skipWaiting: true,
    },
    webpack: (config, _options) => {
        config.resolve.fallback = {
            // https://github.com/papnkukn/qrcode-svg/issues/11#issuecomment-655907892
            fs: false,
        };
        return config;
    },
};

module.exports = withPWA(nextConfig);
