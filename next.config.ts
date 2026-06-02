import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/nabila/dashboard',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
