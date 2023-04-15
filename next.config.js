/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ["maps.googleapis.com", "maps.gstatic.com"]
  }
}

module.exports = nextConfig
