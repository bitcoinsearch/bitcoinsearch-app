const mapping = require("./src/config/mapping.json");
const domains = [
  ...new Set(
    Object.keys(mapping.labels).map((domain) => new URL(domain).hostname)
  ),
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // domain mapping is not an exhaustive list of all the domains we have
    // domains,
    // allow favicon from any indexed domain for now
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
