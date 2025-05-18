import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during builds (e.g. for Netlify)
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
