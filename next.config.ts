import type { NextConfig } from "next";

import createBundleAnalyzer from "@next/bundle-analyzer";
import { withSentryConfig } from "@sentry/nextjs/config";
import createNextIntlPlugin from "next-intl/plugin";

import {
  API_CATALOG_LINK,
  API_CATALOG_PATH,
  apiDiscoveryLinkHeader,
} from "./src/lib/apiDocsPaths";
import { llmsLinkHeader } from "./src/lib/llmsPaths";
import { BLOCKING_METADATA_USER_AGENTS } from "./src/lib/metadataPlacement";
import {
  securityHeaders,
  SITE_HEADERS_SOURCE,
} from "./src/lib/securityHeaders";

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const LATIN_LOCALES = ["en", "ru", "tr"] as const;
const isDevelopment = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  experimental: {
    agentUpgrade: "security",
  },
  async headers() {
    const security = securityHeaders(isDevelopment);
    const noindexStatic = [{ key: "X-Robots-Tag", value: "noindex" }];
    return [
      {
        headers: [...security, { key: "Link", value: llmsLinkHeader("ka") }],
        source: SITE_HEADERS_SOURCE,
      },
      ...LATIN_LOCALES.flatMap((locale) =>
        [`/${locale}`, `/${locale}/:path*`].map((source) => ({
          headers: [{ key: "Link", value: llmsLinkHeader(locale) }],
          source,
        })),
      ),
      ...(["ka", ...LATIN_LOCALES] as const).map((locale) => ({
        headers: [
          {
            key: "Link",
            value: `${llmsLinkHeader(locale)}, ${apiDiscoveryLinkHeader()}`,
          },
        ],
        source: locale === "ka" ? "/developers" : `/${locale}/developers`,
      })),
      {
        headers: [{ key: "Link", value: API_CATALOG_LINK }],
        source: API_CATALOG_PATH,
      },
      {
        headers: noindexStatic,
        source: "/_next/static/:path*",
      },
      {
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
        source: "/geodata/georgia-regions-v1.json",
      },
      {
        headers: [
          ...security,
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
        source: "/api/:path*",
      },
      {
        headers: [
          ...security,
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
        source: "/admin",
      },
      {
        headers: [
          ...security,
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
        source: "/admin/:path*",
      },
    ];
  },
  htmlLimitedBots: BLOCKING_METADATA_USER_AGENTS,
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        hostname: "cdn.reptiles.ge",
        protocol: "https",
      },
      {
        hostname: "upload.wikimedia.org",
        protocol: "https",
      },
    ],
    unoptimized: true,
  },
  pageExtensions: isDevelopment
    ? ["local.tsx", "local.ts", "tsx", "ts", "jsx", "js"]
    : ["tsx", "ts", "jsx", "js"],
  serverExternalPackages: ["sharp", "@reptiles-ge/img-compression"],
  trailingSlash: false,
};

export default withSentryConfig(withBundleAnalyzer(withNextIntl(nextConfig)), {
  bundleSizeOptimizations: {
    excludeDebugStatements: true,
  },
  org: "icleaning-06",
  project: "reptiles-ge-web",
  silent: !process.env.CI,
  widenClientFileUpload: true,
});
