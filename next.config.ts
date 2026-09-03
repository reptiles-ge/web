import type { NextConfig } from "next";

import createBundleAnalyzer from "@next/bundle-analyzer";
import createNextIntlPlugin from "next-intl/plugin";

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const LATIN_LOCALES = ["en", "ru", "tr"] as const;

function latinRedirects(
  pairs: Array<[string, string, number?]>,
): Array<{ destination: string; source: string; statusCode: number }> {
  return LATIN_LOCALES.flatMap((locale) =>
    pairs.map(([from, to, status = 301]) => ({
      destination: `/${locale}${to}`,
      source: `/${locale}${from}`,
      statusCode: status,
    })),
  );
}

const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true,
  },
  async headers() {
    return [
      {
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
        source: "/api/:path*",
      },
      {
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
        source: "/admin",
      },
      {
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
        source: "/admin/:path*",
      },
    ];
  },
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        hostname: "cdn.reptiles.ge",
        protocol: "https",
      },
    ],
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        destination: "https://reptiles.ge/:path*",
        has: [{ type: "host", value: "www.reptiles.ge" }],
        source: "/:path*",
        statusCode: 301,
      },
      {
        destination: "/gvelebi",
        source: "/snakes",
        statusCode: 301,
      },
      {
        destination: "/xvlikebi",
        source: "/lizards",
        statusCode: 301,
      },
      {
        destination: "/kuebi",
        source: "/turtles",
        statusCode: 301,
      },
      {
        destination: "/amfibiebi",
        source: "/amphibians",
        statusCode: 301,
      },
      {
        destination: "/gvelebi/shxamiani-gvelebi",
        source: "/venomous-snakes",
        statusCode: 301,
      },
      {
        destination: "/gvelebi/gveli-ezoshi",
        source: "/snakes-in-the-yard",
        statusCode: 301,
      },
      {
        destination: "/gvelebi/tsxvirrkosani-gvelgesla",
        source: "/species/vipera-ammodytes",
        statusCode: 301,
      },
      {
        destination: "/amfibiebi/bayayi",
        source: "/amphibians/frogs",
        statusCode: 301,
      },
      {
        destination: "/gvelebi/saxeoebebi",
        source: "/snakes/species",
        statusCode: 301,
      },
      {
        destination: "/gvelebi/shxamiani-gvelis-amocnoba",
        source: "/snakes/identify-venomous",
        statusCode: 301,
      },
      {
        destination: "/gvelebi/gvelis-nakbeni",
        source: "/snakes/bite",
        statusCode: 301,
      },
      {
        destination: "/gvelebi/gavrtseleba",
        source: "/snakes/range",
        statusCode: 301,
      },
      {
        destination: "/gvelebi/didi-gvelebi",
        source: "/snakes/largest",
        statusCode: 301,
      },
      {
        destination: "/gvelebi",
        source: "/gvelebi/qvitelmutsela-mtsuravi",
        statusCode: 302,
      },
      {
        destination: "/gvelebi",
        source: "/snakes/dolichophis-caspius",
        statusCode: 302,
      },
      {
        destination: "/gvelebi",
        source: "/species/dolichophis-caspius",
        statusCode: 302,
      },
      {
        destination: "/gvelebi/saxeoebebi",
        source: "/gvelebi/sakartvelos-gvelebi",
        statusCode: 301,
      },
      {
        destination: "/gvelebi/saxeoebebi",
        source: "/snakes/sakartvelos-gvelebi",
        statusCode: 301,
      },
      {
        destination: "/xvlikebi/saxeoebebi",
        source: "/lizards/species",
        statusCode: 301,
      },
      {
        destination: "/xvlikebi/identifikacia",
        source: "/lizards/identify",
        statusCode: 301,
      },
      {
        destination: "/xvlikebi/xvlikis-da-gvelxokeras-gansxvaveba",
        source: "/lizards/lizard-or-glass-lizard",
        statusCode: 301,
      },
      {
        destination: "/kuebi/saxeoebebi",
        source: "/turtles/species",
        statusCode: 301,
      },
      {
        destination: "/kuebi/xmelis-kuebi",
        source: "/turtles/land",
        statusCode: 301,
      },
      {
        destination: "/kuebi/tsqlis-kuebi",
        source: "/turtles/freshwater",
        statusCode: 301,
      },
      {
        destination: "/kuebi/identifikacia",
        source: "/turtles/identify",
        statusCode: 301,
      },
      {
        destination: "/amfibiebi/saxeoebebi",
        source: "/amphibians/species",
        statusCode: 301,
      },
      {
        destination: "/amfibiebi/bayayi/saxeoebebi",
        source: "/amphibians/frogs/species",
        statusCode: 301,
      },
      {
        destination: "/amfibiebi/tritoni-salamandra",
        source: "/amphibians/newts",
        statusCode: 301,
      },
      {
        destination: "/species",
        source: "/identify",
        statusCode: 301,
      },
      {
        destination: "/quiz/romeli-gvelia",
        source: "/quiz/gvelis-identifikacia",
        statusCode: 301,
      },
      {
        destination: "/quiz/romeli-gvelia",
        source: "/quiz/which-snake",
        statusCode: 301,
      },
      ...latinRedirects([
        ["/gvelebi", "/snakes"],
        ["/xvlikebi", "/lizards"],
        ["/kuebi", "/turtles"],
        ["/amfibiebi", "/amphibians"],
        ["/gvelebi/shxamiani-gvelebi", "/venomous-snakes"],
        ["/gvelebi/gveli-ezoshi", "/snakes-in-the-yard"],
        ["/species/vipera-ammodytes", "/snakes/vipera-transcaucasiana"],
        ["/amfibiebi/bayayi", "/amphibians/frogs"],
        ["/amphibians/bayayi", "/amphibians/frogs"],
        ["/gvelebi/saxeoebebi", "/snakes/species"],
        ["/gvelebi/shxamiani-gvelis-amocnoba", "/snakes/identify-venomous"],
        ["/gvelebi/gvelis-nakbeni", "/snakes/bite"],
        ["/gvelebi/gavrtseleba", "/snakes/range"],
        ["/gvelebi/didi-gvelebi", "/snakes/largest"],
        ["/snakes/saxeoebebi", "/snakes/species"],
        ["/snakes/shxamiani-gvelis-amocnoba", "/snakes/identify-venomous"],
        ["/snakes/gvelis-nakbeni", "/snakes/bite"],
        ["/snakes/gavrtseleba", "/snakes/range"],
        ["/snakes/didi-gvelebi", "/snakes/largest"],
        ["/snakes/sakartvelos-gvelebi", "/snakes/species"],
        ["/gvelebi/sakartvelos-gvelebi", "/snakes/species"],
        ["/xvlikebi/saxeoebebi", "/lizards/species"],
        ["/xvlikebi/identifikacia", "/lizards/identify"],
        [
          "/xvlikebi/xvlikis-da-gvelxokeras-gansxvaveba",
          "/lizards/lizard-or-glass-lizard",
        ],
        ["/lizards/saxeoebebi", "/lizards/species"],
        ["/lizards/identifikacia", "/lizards/identify"],
        [
          "/lizards/xvlikis-da-gvelxokeras-gansxvaveba",
          "/lizards/lizard-or-glass-lizard",
        ],
        ["/kuebi/saxeoebebi", "/turtles/species"],
        ["/kuebi/xmelis-kuebi", "/turtles/land"],
        ["/kuebi/tsqlis-kuebi", "/turtles/freshwater"],
        ["/kuebi/identifikacia", "/turtles/identify"],
        ["/turtles/saxeoebebi", "/turtles/species"],
        ["/turtles/xmelis-kuebi", "/turtles/land"],
        ["/turtles/tsqlis-kuebi", "/turtles/freshwater"],
        ["/turtles/identifikacia", "/turtles/identify"],
        ["/amfibiebi/saxeoebebi", "/amphibians/species"],
        ["/amfibiebi/bayayi/saxeoebebi", "/amphibians/frogs/species"],
        ["/amfibiebi/tritoni-salamandra", "/amphibians/newts"],
        ["/amphibians/saxeoebebi", "/amphibians/species"],
        ["/amphibians/bayayi/saxeoebebi", "/amphibians/frogs/species"],
        ["/amphibians/tritoni-salamandra", "/amphibians/newts"],
        ["/identify", "/species"],
        ["/snakes/dolichophis-caspius", "/snakes", 302],
        ["/gvelebi/qvitelmutsela-mtsuravi", "/snakes", 302],
        ["/species/dolichophis-caspius", "/snakes", 302],
      ]),
      {
        destination: "/en/quiz/which-snake",
        source: "/en/quiz/gvelis-identifikacia",
        statusCode: 301,
      },
      {
        destination: "/en/quiz/which-snake",
        source: "/en/quiz/romeli-gvelia",
        statusCode: 301,
      },
      {
        destination: "/ru/quiz/kakaya-zmeya",
        source: "/ru/quiz/gvelis-identifikacia",
        statusCode: 301,
      },
      {
        destination: "/ru/quiz/kakaya-zmeya",
        source: "/ru/quiz/romeli-gvelia",
        statusCode: 301,
      },
      {
        destination: "/ru/quiz/kakaya-zmeya",
        source: "/ru/quiz/which-snake",
        statusCode: 301,
      },
      {
        destination: "/tr/quiz/hangi-yilan",
        source: "/tr/quiz/gvelis-identifikacia",
        statusCode: 301,
      },
      {
        destination: "/tr/quiz/hangi-yilan",
        source: "/tr/quiz/romeli-gvelia",
        statusCode: 301,
      },
      {
        destination: "/tr/quiz/hangi-yilan",
        source: "/tr/quiz/which-snake",
        statusCode: 301,
      },
    ];
  },
  serverExternalPackages: ["sharp", "@reptiles-ge/img-compression"],
  trailingSlash: false,
};

export default withBundleAnalyzer(withNextIntl(nextConfig));
