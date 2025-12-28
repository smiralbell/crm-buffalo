/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Ensure CSS is properly handled in standalone mode
  experimental: {
    outputFileTracingIncludes: {
      '/': ['./app/globals.css'],
    },
  },
}

module.exports = nextConfig
