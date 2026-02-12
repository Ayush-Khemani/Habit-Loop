/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Ensure correct project root when using Turbopack (Next.js 15+)
  ...(process.env.TURBOPACK && { turbopack: { root: process.cwd() } }),
}

module.exports = nextConfig
