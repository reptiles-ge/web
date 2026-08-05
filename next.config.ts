import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
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
    ];
  },
};

export default withNextIntl(nextConfig);
