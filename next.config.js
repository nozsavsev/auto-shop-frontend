/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Configure any other Next.js options here
  swcMinify: true,
  // Ensure environment variables are properly exposed to the client
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
}

module.exports = nextConfig 