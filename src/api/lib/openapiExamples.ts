const credit = {
  authorId: "laura-and-bobby-bok",
  location: "Vashlovani protected areas",
  photoConfidence: "georgia-field",
  photographer: "Laura and Bobby Bok",
} as const;

const levantineViper = {
  commonName: "Levantine viper",
  danger: "High",
  description:
    "The Levantine viper is Georgia's largest venomous viper and lives in dry places in the east. Its bite is dangerous, and you cannot identify it by the spots on its back alone.",
  family: "Viperidae",
  genus: "Macrovipera",
  group: "snake",
  habitats: ["grassland", "mountain"],
  id: "macrovipera-lebetina",
  image: "https://cdn.reptiles.ge/macrovipera-lebetina-laura-1.jpg",
  imageCredit: credit,
  location: "Eastern Georgia",
  mobileImage:
    "https://cdn.reptiles.ge/macrovipera-lebetina-laura-1-crop-381-0-533-1000.jpg",
  mobileImageCredit: credit,
  publishedAt: "2026-08-04T18:02:05+04:00",
  scientificName: "Macrovipera lebetinus",
  slug: "macrovipera-lebetina",
  stats: [
    { label: "Length", value: "typically 70–90 cm" },
    { label: "Venom", value: "High risk" },
    { label: "Conservation", value: "Least Concern (LC)" },
  ],
  updatedAt: "2026-10-16T18:07:56+04:00",
} as const;

const levantineViperTexts = {
  behavior:
    "In the South Caucasus, the Levantine viper is usually active from April to the end of October, but it may appear as early as late March. When you may come across it depends on the weather and the daytime temperature.",
  conservation:
    "A 2021 assessment found that the Levantine viper faces a low risk of extinction worldwide. It is not on Georgia’s 2014 Red List, although older Georgian encyclopedias sometimes link it to the Red Book.",
  diet: "Rodents are the main prey of adult Levantine vipers. Besides rodents, they also catch small birds, lizards and other small animals with backbones.",
  facts: [],
  faq: [
    {
      answer:
        "Yes. As of 2026, the Levantine viper has been confirmed in Georgia. It lives mainly in the dry and semi-dry areas of eastern Georgia. It is not found throughout the country.",
      question: "Is the Levantine viper found in Georgia?",
    },
  ],
  gallery: [
    {
      credit,
      src: "https://cdn.reptiles.ge/macrovipera-lebetina-laura-1.jpg",
    },
    {
      credit: {
        authorId: "armen-seropian",
        date: "2025-05-28",
        location: "Vashlovani protected areas",
        photoConfidence: "georgia-field",
        photographer: "Armen Seropian",
      },
      src: "https://cdn.reptiles.ge/macrovipera-lebetina-armen-1.jpg",
    },
  ],
  habitat:
    "The Levantine viper is found in dry, stony and rocky places. In Georgia, it lives in dry areas along the lower Iori, Mtkvari and Alazani rivers, in Shiraki and Gareji, and in the dry foothills of [Kvemo Kartli](/regions/kvemo-kartli).",
  identification: {
    summary:
      "The Levantine viper is a thick-bodied viper with a broad, triangular head. Its pupils are vertically elongated, and a raised ridge runs down the middle of each scale.",
    traits: [
      "The Levantine viper has a thick, heavy body, and its broad, triangular head stands out clearly from the neck. The snout is blunt, with no horn.",
    ],
  },
  overview:
    "The Levantine viper, or gyurza (Macrovipera lebetinus), is Georgia's largest [venomous viper](/venomous-snakes) and the only one that lays eggs. It lives mainly in dry and semi-dry parts of eastern Georgia, from Shiraki and Gareji to the foothills of Kvemo Kartli.",
  sources: [
    {
      name: "Tarkhnishvili et al. 2026 — Annotated checklist of Georgia's amphibians and reptiles",
      url: "https://doi.org/10.3897/caucasiana.5.e189214",
    },
  ],
} as const;

const lookalikeIds = [
  "elaphe-urartica",
  "hemorrhois-ravergieri",
  "vipera-transcaucasiana",
];

const catalogFacets = {
  danger: { all: 145, harmless: 68, venomous: 11 },
  group: {
    all: 145,
    amphibian: 12,
    bird: 45,
    insect: 4,
    lizard: 29,
    mammal: 17,
    scorpion: 4,
    snake: 22,
    spider: 8,
    turtle: 4,
  },
  habitat: { all: 145, forest: 83, grassland: 95, mountain: 64, wetland: 29 },
  region: {
    abkhazia: 30,
    adjara: 47,
    all: 145,
    guria: 20,
    imereti: 28,
    kakheti: 72,
    "kvemo-kartli": 54,
    "mtskheta-mtianeti": 54,
    racha: 11,
    "samegrelo-zemo-svaneti": 38,
    "samtskhe-javakheti": 56,
    "shida-kartli": 38,
    tbilisi: 49,
  },
};

const catalogStats = {
  lastUpdated: "2026-10-22T15:29:08+04:00",
  photos: 1274,
  venomous: 11,
};

const lagodekhiCover = {
  alt: "An East Caucasian tur on a high mountain slope in Lagodekhi.",
  credit: {
    authorId: "nika-melikishvili",
    date: "2021-12-29",
    location: "ლაგოდეხი",
    photographer: "ნიკა მელიქიშვილი",
  },
  fromAtlas: true,
  src: "https://cdn.reptiles.ge/capra-cylindricornis-nika-3.jpg",
} as const;

const lagodekhi = {
  dek: "Georgia’s oldest protected area is hosting the steering committee of the IUCN World Commission on Protected Areas for a week. Lagodekhi is a candidate for both the Green List and the European Diploma.",
  image: lagodekhiCover,
  lead: "A week-long meeting has opened in Lagodekhi Protected Areas: the steering committee of the IUCN World Commission on Protected Areas (WCPA) is gathering there with about 30 international experts and commission members.",
  locales: ["ka", "en", "ru", "tr"],
  publishedAt: "2026-10-17",
  readMinutes: 3,
  relatedHubIds: [],
  relatedRegionIds: ["kakheti"],
  relatedSpeciesIds: ["capra-cylindricornis", "cervus-elaphus"],
  slug: "lagodekhi-iucn-mwvane-sia",
  sources: [
    {
      name: "IUCN — World Commission on Protected Areas",
      url: "https://iucn.org/our-union/commissions/world-commission-protected-areas",
    },
  ],
  title:
    "Lagodekhi is an IUCN Green List candidate as the World Commission on Protected Areas meets in Georgia",
} as const;

export const RESPONSE_EXAMPLES = {
  author: {
    data: {
      affiliations: [],
      aliases: [
        "Alexandre Khakhva",
        "Sandro Khakhva",
        "Сандро Хахва",
        "ალექსანდრე ხახვა",
        "სანდრო ხახვა",
      ],
      bio: "Sandro (Alexandre) Khakhva is a young Georgian researcher from Adjara — a beginning herpetologist and naturalist.",
      id: "sandro-khakhva",
      isContributor: true,
      jobTitle: null,
      kind: "person",
      links: {},
      name: "Sandro Khakhva",
      photoCount: 20,
      portraitClass: null,
      portraitSrc: "https://cdn.reptiles.ge/authors/sandro-khakhva.jpg",
      role: "herpetologist",
    },
    locale: "en",
  },
  authorList: {
    data: [
      {
        aliases: ["Armen Seropian", "Армен Серопиан", "არმენ სეროფიანი"],
        id: "armen-seropian",
        isContributor: true,
        kind: "person",
        name: "Armen Seropian",
        photoCount: 21,
        role: "researcher",
      },
    ],
    locale: "en",
    total: 1,
  },
  catalogCard: {
    data: [{ ...levantineViper, lookalikes: lookalikeIds, photoCount: 8 }],
    facets: catalogFacets,
    locale: "en",
    nextCursor: null,
    stats: catalogStats,
    total: 145,
    view: "card",
  },
  catalogFull: {
    data: [
      { ...levantineViper, ...levantineViperTexts, lookalikes: lookalikeIds },
    ],
    facets: catalogFacets,
    locale: "en",
    nextCursor: null,
    stats: catalogStats,
    total: 145,
    view: "full",
  },
  catalogPhotos: {
    data: [
      {
        ...levantineViper,
        gallery: levantineViperTexts.gallery,
        lookalikes: lookalikeIds,
      },
    ],
    facets: catalogFacets,
    locale: "en",
    nextCursor: null,
    stats: catalogStats,
    total: 145,
    view: "photos",
  },
  catalogQuiz: {
    data: [
      {
        ...levantineViper,
        facts: levantineViperTexts.facts,
        gallery: levantineViperTexts.gallery,
        identification: levantineViperTexts.identification,
        lookalikes: lookalikeIds,
      },
    ],
    facets: catalogFacets,
    locale: "en",
    nextCursor: null,
    stats: catalogStats,
    total: 145,
    view: "quiz",
  },
  contributor: {
    data: {
      affiliations: ["borjomi-kharagauli-national-park"],
      aliases: ["Zauri Khachidze", "Заури Хачидзе", "ზაური ხაჩიძე"],
      bio: "Ranger at Borjomi-Kharagauli National Park and wildlife photographer.",
      id: "zauri-khachidze",
      isContributor: true,
      jobTitle: "ranger",
      kind: "person",
      links: { facebook: "https://www.facebook.com/zauri.xachidze/" },
      name: "Zauri Khachidze",
      photoCount: 67,
      portraitClass: "object-[50%_32%]",
      portraitSrc: "https://cdn.reptiles.ge/authors/zauri-khachidze.jpg",
      role: "ranger",
      speciesCount: 27,
    },
    locale: "en",
  },
  contributorList: {
    data: [
      {
        affiliations: ["borjomi-kharagauli-national-park"],
        aliases: ["Zauri Khachidze", "Заури Хачидзе", "ზაური ხაჩიძე"],
        bio: "Ranger at Borjomi-Kharagauli National Park and wildlife photographer.",
        id: "zauri-khachidze",
        isContributor: true,
        jobTitle: "ranger",
        kind: "person",
        links: { facebook: "https://www.facebook.com/zauri.xachidze/" },
        name: "Zauri Khachidze",
        photoCount: 67,
        portraitClass: "object-[50%_32%]",
        portraitSrc: "https://cdn.reptiles.ge/authors/zauri-khachidze.jpg",
        role: "ranger",
        speciesCount: 27,
      },
    ],
    locale: "en",
    total: 17,
  },
  error: {
    error: { code: "not_found", message: "Species not found" },
  },
  fieldRecords: {
    data: [
      {
        date: "2026-08-29",
        lat: 41.59262,
        lng: 45.23572,
        locality: "Kakheti, GE",
        observer: "cristianluquehuertas",
        observerName: "Cristian Luque Huertas",
        url: "https://www.inaturalist.org/observations/398124552",
      },
    ],
    id: "macrovipera-lebetina",
    total: 1,
  },
  invalidRequest: {
    error: {
      code: "invalid_request",
      details: [
        {
          message: 'Invalid option: expected one of "ka"|"en"|"ru"|"tr"',
          path: "x-locale",
        },
      ],
      message: "Invalid header",
    },
  },
  news: {
    data: {
      ...lagodekhi,
      gallery: [
        {
          alt: "A red deer fawn in the Lagodekhi forest.",
          credit: {
            authorId: "dachi-mtchedlishvili",
            date: "2025-06-05",
            location: "ლაგოდეხი",
            photographer: "დაჩი მჭედლიშვილი",
          },
          fromAtlas: true,
          src: "https://cdn.reptiles.ge/cervus-elaphus-dachi-1.jpg",
        },
      ],
      metaDescription:
        "Founded in 1912, Lagodekhi is a candidate for the Green List and European Diploma. The IUCN World Commission on Protected Areas steering committee meets here.",
      metaTitle: "Lagodekhi is an IUCN Green List candidate",
      sections: [
        {
          blocks: [
            {
              parts: [
                "Lagodekhi is in ",
                { id: "kakheti", label: "Kakheti", type: "region" },
                " and appears on many atlas pages, as a range locality or as the place a photo was taken.",
              ],
              type: "p",
            },
          ],
          heading: "Lagodekhi in this atlas",
        },
      ],
    },
    locale: "en",
  },
  newsList: {
    data: [
      {
        dek: "Batumi Raptor Count closed its autumn 2026 count on 21 October. The last day brought the season’s second Rough-legged Buzzard, three Wallcreepers and a basking Caucasus viper.",
        image: {
          alt: "Seven counters of the Station 2 team on the last day of the season, with misty wooded hills of Adjara behind them.",
          credit: {
            date: "2026-10-21",
            photographer: "BRC Station 2 team",
            url: "https://www.batumiraptorcount.org/news/2026/10/last-day-of-the-season",
          },
          height: 1667,
          src: "https://cdn.reptiles.ge/news-batumi-2026-end-brc-station-2-team.jpg",
          width: 2500,
        },
        lead: "The autumn raptor count at the Batumi bottleneck ended on 21 October 2026, after 71 days.",
        locales: ["ka", "en", "ru", "tr"],
        publishedAt: "2026-10-23",
        readMinutes: 4,
        relatedHubIds: ["birds", "snakes"],
        relatedRegionIds: ["adjara"],
        relatedSpeciesIds: ["vipera-kaznakovi", "buteo-buteo"],
        series: {
          id: "batumi-raptor-count-2026",
          name: "Batumi Raptor Count, autumn 2026",
        },
        slug: "batumi-raptor-count-2026-season-ends",
        sources: [
          {
            name: "Batumi Raptor Count — One last watch over the bottleneck: the end of the count",
            url: "https://www.batumiraptorcount.org/news/2026/10/last-day-of-the-season",
          },
        ],
        title:
          "Batumi count ends after 71 days: a Rough-legged Buzzard and a Caucasus viper on the last day",
      },
    ],
    locale: "en",
    nextCursor: "batumi-raptor-count-2026-season-ends",
    total: 5,
  },
  species: {
    data: {
      ...levantineViper,
      ...levantineViperTexts,
      lookalikes: [
        {
          commonName: "Urartian ratsnake",
          id: "elaphe-urartica",
          slug: "elaphe-urartica",
        },
        {
          commonName: "Nose-horned viper",
          id: "vipera-transcaucasiana",
          slug: "vipera-transcaucasiana",
        },
      ],
    },
    locale: "en",
  },
  speciesList: {
    data: [
      {
        commonName: "Dinnik's viper",
        danger: "Moderate",
        group: "snake",
        id: "vipera-dinniki",
        image: "https://cdn.reptiles.ge/vipera-dinniki-brecht-2.jpg",
        scientificName: "Vipera dinniki",
        slug: "vipera-dinniki",
        updatedAt: "2026-10-16T18:07:56+04:00",
      },
      {
        commonName: "Levantine viper",
        danger: "High",
        group: "snake",
        id: "macrovipera-lebetina",
        image: "https://cdn.reptiles.ge/macrovipera-lebetina-laura-1.jpg",
        scientificName: "Macrovipera lebetinus",
        slug: "macrovipera-lebetina",
        updatedAt: "2026-10-16T18:07:56+04:00",
      },
    ],
    locale: "en",
    total: 2,
  },
};
