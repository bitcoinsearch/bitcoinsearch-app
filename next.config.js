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
    domains,
  },
};

module.exports = nextConfig;
