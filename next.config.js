/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Enable detailed logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // Ensure CSS is properly handled in standalone mode
  experimental: {
    outputFileTracingIncludes: {
      '/': ['./app/globals.css'],
    },
  },
}

module.exports = nextConfig
