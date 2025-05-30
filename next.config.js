/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Configure any other Next.js options here
  swcMinify: true,
}

module.exports = nextConfig 