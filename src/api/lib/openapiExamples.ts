const credit = {
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

export const RESPONSE_EXAMPLES = {
  catalogCard: {
    data: [{ ...levantineViper, lookalikes: lookalikeIds, photoCount: 8 }],
    locale: "en",
    nextCursor: null,
    total: 145,
    view: "card",
  },
  catalogFull: {
    data: [
      { ...levantineViper, ...levantineViperTexts, lookalikes: lookalikeIds },
    ],
    locale: "en",
    nextCursor: null,
    total: 145,
    view: "full",
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
