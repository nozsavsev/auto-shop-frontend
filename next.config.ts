import type { NextConfig } from "next";
const { withSuperjson } = require("next-superjson");
const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  output: "standalone",
};
module.exports = withSuperjson()(nextConfig);
