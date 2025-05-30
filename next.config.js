/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Configure any other Next.js options here
  swcMinify: true,
  // Remove the NEXT_PUBLIC_ variable from env config since it will be handled at runtime
  env: {
    // Add any other truly static environment variables here
  },
  // Ensure environment variables are available at runtime
  experimental: {
    outputFileTracingRoot: process.cwd(),
  },
}

module.exports = nextConfig 