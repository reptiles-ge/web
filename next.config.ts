import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
    ],
  },
  // async redirects() {
  //   return [
  //     {
  //       source: "/species/vipera",
  //       destination: "/species/vipera-dinniki",
  //       permanent: true,
  //     },
  //   ];
  // },
};

export default nextConfig;
