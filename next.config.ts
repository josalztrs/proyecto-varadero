import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['framer-motion']
  ,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
        pathname: '/josalztrs.png',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
        pathname: '/xxelaifaxx.png'
      },
    ],
  }
};

export default nextConfig;
