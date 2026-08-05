import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.reptiles.ge",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/species/vipera-ammodytes",
        destination: "/species/vipera-transcaucasiana",
        permanent: true,
      },
      {
        source: "/en/species/vipera-ammodytes",
        destination: "/en/species/vipera-transcaucasiana",
        permanent: true,
      },
      {
        source: "/identify",
        destination: "/species",
        permanent: false,
      },
      {
        source: "/en/identify",
        destination: "/en/species",
        permanent: false,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
