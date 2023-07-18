

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  images: {
    domains:["assets-global.website-files.com"]
  }
}

module.exports = nextConfig