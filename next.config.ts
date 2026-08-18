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
        source: "/amphibians/frogs",
        destination: "/amfibiebi/bayayi",
        statusCode: 301,
      },
      {
        source: "/en/amfibiebi/bayayi",
        destination: "/en/amphibians/frogs",
        statusCode: 301,
      },
      {
        source: "/en/amphibians/bayayi",
        destination: "/en/amphibians/frogs",
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
        source: "/en/gvelebi/saxeoebebi",
        destination: "/en/snakes/species",
        statusCode: 301,
      },
      {
        source: "/en/gvelebi/shxamiani-gvelis-amocnoba",
        destination: "/en/snakes/identify-venomous",
        statusCode: 301,
      },
      {
        source: "/en/gvelebi/gvelis-nakbeni",
        destination: "/en/snakes/bite",
        statusCode: 301,
      },
      {
        source: "/en/gvelebi/gavrtseleba",
        destination: "/en/snakes/range",
        statusCode: 301,
      },
      {
        source: "/en/gvelebi/didi-gvelebi",
        destination: "/en/snakes/largest",
        statusCode: 301,
      },
      {
        source: "/en/snakes/saxeoebebi",
        destination: "/en/snakes/species",
        statusCode: 301,
      },
      {
        source: "/en/snakes/shxamiani-gvelis-amocnoba",
        destination: "/en/snakes/identify-venomous",
        statusCode: 301,
      },
      {
        source: "/en/snakes/gvelis-nakbeni",
        destination: "/en/snakes/bite",
        statusCode: 301,
      },
      {
        source: "/en/snakes/gavrtseleba",
        destination: "/en/snakes/range",
        statusCode: 301,
      },
      {
        source: "/en/snakes/didi-gvelebi",
        destination: "/en/snakes/largest",
        statusCode: 301,
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
        source: "/en/snakes/sakartvelos-gvelebi",
        destination: "/en/snakes/species",
        statusCode: 301,
      },
      {
        source: "/en/gvelebi/sakartvelos-gvelebi",
        destination: "/en/snakes/species",
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
        source: "/en/xvlikebi/saxeoebebi",
        destination: "/en/lizards/species",
        statusCode: 301,
      },
      {
        source: "/en/xvlikebi/identifikacia",
        destination: "/en/lizards/identify",
        statusCode: 301,
      },
      {
        source: "/en/xvlikebi/xvlikis-da-gvelxokeras-gansxvaveba",
        destination: "/en/lizards/lizard-or-glass-lizard",
        statusCode: 301,
      },
      {
        source: "/en/lizards/saxeoebebi",
        destination: "/en/lizards/species",
        statusCode: 301,
      },
      {
        source: "/en/lizards/identifikacia",
        destination: "/en/lizards/identify",
        statusCode: 301,
      },
      {
        source: "/en/lizards/xvlikis-da-gvelxokeras-gansxvaveba",
        destination: "/en/lizards/lizard-or-glass-lizard",
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
        source: "/en/kuebi/saxeoebebi",
        destination: "/en/turtles/species",
        statusCode: 301,
      },
      {
        source: "/en/kuebi/xmelis-kuebi",
        destination: "/en/turtles/land",
        statusCode: 301,
      },
      {
        source: "/en/kuebi/tsqlis-kuebi",
        destination: "/en/turtles/freshwater",
        statusCode: 301,
      },
      {
        source: "/en/kuebi/identifikacia",
        destination: "/en/turtles/identify",
        statusCode: 301,
      },
      {
        source: "/en/turtles/saxeoebebi",
        destination: "/en/turtles/species",
        statusCode: 301,
      },
      {
        source: "/en/turtles/xmelis-kuebi",
        destination: "/en/turtles/land",
        statusCode: 301,
      },
      {
        source: "/en/turtles/tsqlis-kuebi",
        destination: "/en/turtles/freshwater",
        statusCode: 301,
      },
      {
        source: "/en/turtles/identifikacia",
        destination: "/en/turtles/identify",
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
        source: "/en/amfibiebi/saxeoebebi",
        destination: "/en/amphibians/species",
        statusCode: 301,
      },
      {
        source: "/en/amfibiebi/bayayi/saxeoebebi",
        destination: "/en/amphibians/frogs/species",
        statusCode: 301,
      },
      {
        source: "/en/amfibiebi/tritoni-salamandra",
        destination: "/en/amphibians/newts",
        statusCode: 301,
      },
      {
        source: "/en/amphibians/saxeoebebi",
        destination: "/en/amphibians/species",
        statusCode: 301,
      },
      {
        source: "/en/amphibians/bayayi/saxeoebebi",
        destination: "/en/amphibians/frogs/species",
        statusCode: 301,
      },
      {
        source: "/en/amphibians/tritoni-salamandra",
        destination: "/en/amphibians/newts",
        statusCode: 301,
      },
      {
        source: "/conservation",
        destination: "/konservacia",
        statusCode: 301,
      },
      {
        source: "/conservation/red-list-reptiles",
        destination: "/konservacia/witeli-nusxa-qvewarmavlebi",
        statusCode: 301,
      },
      {
        source: "/conservation/red-list-amphibians",
        destination: "/konservacia/witeli-nusxa-amfibiebi",
        statusCode: 301,
      },
      {
        source: "/conservation/rare-reptiles",
        destination: "/konservacia/ishviati-qvewarmavlebi",
        statusCode: 301,
      },
      {
        source: "/conservation/endemic-reptiles",
        destination: "/konservacia/endemuri-qvewarmavlebi",
        statusCode: 301,
      },
      {
        source: "/en/konservacia",
        destination: "/en/conservation",
        statusCode: 301,
      },
      {
        source: "/en/konservacia/witeli-nusxa-qvewarmavlebi",
        destination: "/en/conservation/red-list-reptiles",
        statusCode: 301,
      },
      {
        source: "/en/konservacia/witeli-nusxa-amfibiebi",
        destination: "/en/conservation/red-list-amphibians",
        statusCode: 301,
      },
      {
        source: "/en/konservacia/ishviati-qvewarmavlebi",
        destination: "/en/conservation/rare-reptiles",
        statusCode: 301,
      },
      {
        source: "/en/konservacia/endemuri-qvewarmavlebi",
        destination: "/en/conservation/endemic-reptiles",
        statusCode: 301,
      },
      {
        source: "/en/conservation/witeli-nusxa-qvewarmavlebi",
        destination: "/en/conservation/red-list-reptiles",
        statusCode: 301,
      },
      {
        source: "/en/conservation/witeli-nusxa-amfibiebi",
        destination: "/en/conservation/red-list-amphibians",
        statusCode: 301,
      },
      {
        source: "/en/conservation/ishviati-qvewarmavlebi",
        destination: "/en/conservation/rare-reptiles",
        statusCode: 301,
      },
      {
        source: "/en/conservation/endemuri-qvewarmavlebi",
        destination: "/en/conservation/endemic-reptiles",
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
