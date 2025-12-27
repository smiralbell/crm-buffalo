/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Trust proxy headers for correct URL handling behind reverse proxy
  async headers() {
    return []
  },
}

module.exports = nextConfig
