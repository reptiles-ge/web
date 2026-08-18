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
        source: "/snakes",
        destination: "/gvelebi",
        statusCode: 301,
      },
      {
        source: "/lizards",
        destination: "/xvlikebi",
        statusCode: 301,
      },
      {
        source: "/turtles",
        destination: "/kuebi",
        statusCode: 301,
      },
      {
        source: "/amphibians",
        destination: "/amfibiebi",
        statusCode: 301,
      },
      {
        source: "/venomous-snakes",
        destination: "/gvelebi/shxamiani-gvelebi",
        statusCode: 301,
      },
      {
        source: "/snakes-in-the-yard",
        destination: "/gvelebi/gveli-ezoshi",
        statusCode: 301,
      },
      {
        source: "/en/gvelebi",
        destination: "/en/snakes",
        statusCode: 301,
      },
      {
        source: "/en/xvlikebi",
        destination: "/en/lizards",
        statusCode: 301,
      },
      {
        source: "/en/kuebi",
        destination: "/en/turtles",
        statusCode: 301,
      },
      {
        source: "/en/amfibiebi",
        destination: "/en/amphibians",
        statusCode: 301,
      },
      {
        source: "/en/gvelebi/shxamiani-gvelebi",
        destination: "/en/venomous-snakes",
        statusCode: 301,
      },
      {
        source: "/en/gvelebi/gveli-ezoshi",
        destination: "/en/snakes-in-the-yard",
        statusCode: 301,
      },
      {
        source: "/species/vipera-ammodytes",
        destination: "/gvelebi/tsxvirrkosani-gvelgesla",
        statusCode: 301,
      },
      {
        source: "/en/species/vipera-ammodytes",
        destination: "/en/snakes/vipera-transcaucasiana",
        statusCode: 301,
      },
      {
        source: "/identify",
        destination: "/species",
        statusCode: 302,
      },
      {
        source: "/en/identify",
        destination: "/en/species",
        statusCode: 302,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
