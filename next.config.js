/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Disable experimental features that might cause issues
  experimental: {
    outputFileTracingIncludes: {
      '/': ['./app/globals.css'],
    },
  },
}

module.exports = nextConfig
