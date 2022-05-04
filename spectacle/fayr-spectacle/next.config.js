/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa");

const nextConfig = {
    reactStrictMode: true,
    pwa: {
        dest: "public",
        register: true,
        skipWaiting: true,
    },
};

module.exports = withPWA(nextConfig);
