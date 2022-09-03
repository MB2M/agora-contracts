/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ["tokens.1inch.io", "assets.coingecko.com"],
    },
};

module.exports = nextConfig;
