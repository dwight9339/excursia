/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  output: "standalone",
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ["maps.googleapis.com", "maps.gstatic.com"]
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  }
}

module.exports = nextConfig
