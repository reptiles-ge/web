import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const LATIN_LOCALES = ["en", "ru", "tr"] as const;

function latinRedirects(
  pairs: Array<[string, string, number?]>,
): Array<{ source: string; destination: string; statusCode: number }> {
  return LATIN_LOCALES.flatMap((locale) =>
    pairs.map(([from, to, status = 301]) => ({
      source: `/${locale}${from}`,
      destination: `/${locale}${to}`,
      statusCode: status,
    })),
  );
}

const nextConfig: NextConfig = {
  trailingSlash: false,
  serverExternalPackages: ["sharp", "@reptiles-ge/img-compression"],
  experimental: {
    inlineCss: true,
  },
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
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/admin",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.reptiles.ge" }],
        destination: "https://reptiles.ge/:path*",
        statusCode: 301,
      },
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
        source: "/species/vipera-ammodytes",
        destination: "/gvelebi/tsxvirrkosani-gvelgesla",
        statusCode: 301,
      },
      {
        source: "/amphibians/frogs",
        destination: "/amfibiebi/bayayi",
        statusCode: 301,
      },
      {
        source: "/snakes/species",
        destination: "/gvelebi/saxeoebebi",
        statusCode: 301,
      },
      {
        source: "/snakes/identify-venomous",
        destination: "/gvelebi/shxamiani-gvelis-amocnoba",
        statusCode: 301,
      },
      {
        source: "/snakes/bite",
        destination: "/gvelebi/gvelis-nakbeni",
        statusCode: 301,
      },
      {
        source: "/snakes/range",
        destination: "/gvelebi/gavrtseleba",
        statusCode: 301,
      },
      {
        source: "/snakes/largest",
        destination: "/gvelebi/didi-gvelebi",
        statusCode: 301,
      },
      {
        source: "/gvelebi/qvitelmutsela-mtsuravi",
        destination: "/gvelebi",
        statusCode: 302,
      },
      {
        source: "/snakes/dolichophis-caspius",
        destination: "/gvelebi",
        statusCode: 302,
      },
      {
        source: "/species/dolichophis-caspius",
        destination: "/gvelebi",
        statusCode: 302,
      },
      {
        source: "/gvelebi/sakartvelos-gvelebi",
        destination: "/gvelebi/saxeoebebi",
        statusCode: 301,
      },
      {
        source: "/snakes/sakartvelos-gvelebi",
        destination: "/gvelebi/saxeoebebi",
        statusCode: 301,
      },
      {
        source: "/lizards/species",
        destination: "/xvlikebi/saxeoebebi",
        statusCode: 301,
      },
      {
        source: "/lizards/identify",
        destination: "/xvlikebi/identifikacia",
        statusCode: 301,
      },
      {
        source: "/lizards/lizard-or-glass-lizard",
        destination: "/xvlikebi/xvlikis-da-gvelxokeras-gansxvaveba",
        statusCode: 301,
      },
      {
        source: "/turtles/species",
        destination: "/kuebi/saxeoebebi",
        statusCode: 301,
      },
      {
        source: "/turtles/land",
        destination: "/kuebi/xmelis-kuebi",
        statusCode: 301,
      },
      {
        source: "/turtles/freshwater",
        destination: "/kuebi/tsqlis-kuebi",
        statusCode: 301,
      },
      {
        source: "/turtles/identify",
        destination: "/kuebi/identifikacia",
        statusCode: 301,
      },
      {
        source: "/amphibians/species",
        destination: "/amfibiebi/saxeoebebi",
        statusCode: 301,
      },
      {
        source: "/amphibians/frogs/species",
        destination: "/amfibiebi/bayayi/saxeoebebi",
        statusCode: 301,
      },
      {
        source: "/amphibians/newts",
        destination: "/amfibiebi/tritoni-salamandra",
        statusCode: 301,
      },
      {
        source: "/identify",
        destination: "/species",
        statusCode: 301,
      },
      {
        source: "/quiz/gvelis-identifikacia",
        destination: "/quiz/romeli-gvelia",
        statusCode: 301,
      },
      {
        source: "/quiz/which-snake",
        destination: "/quiz/romeli-gvelia",
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
        source: "/en/quiz/gvelis-identifikacia",
        destination: "/en/quiz/which-snake",
        statusCode: 301,
      },
      {
        source: "/en/quiz/romeli-gvelia",
        destination: "/en/quiz/which-snake",
        statusCode: 301,
      },
      {
        source: "/ru/quiz/gvelis-identifikacia",
        destination: "/ru/quiz/kakaya-zmeya",
        statusCode: 301,
      },
      {
        source: "/ru/quiz/romeli-gvelia",
        destination: "/ru/quiz/kakaya-zmeya",
        statusCode: 301,
      },
      {
        source: "/ru/quiz/which-snake",
        destination: "/ru/quiz/kakaya-zmeya",
        statusCode: 301,
      },
      {
        source: "/tr/quiz/gvelis-identifikacia",
        destination: "/tr/quiz/hangi-yilan",
        statusCode: 301,
      },
      {
        source: "/tr/quiz/romeli-gvelia",
        destination: "/tr/quiz/hangi-yilan",
        statusCode: 301,
      },
      {
        source: "/tr/quiz/which-snake",
        destination: "/tr/quiz/hangi-yilan",
        statusCode: 301,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
