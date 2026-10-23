import { z } from "zod";

import { locales } from "@/i18n/locales";
import { SPECIES_COLORS } from "@/lib/speciesColors";

import {
  AFFILIATIONS,
  AUTHOR_JOB_TITLES,
  AUTHOR_KINDS,
  AUTHOR_ROLES,
} from "./authors";
import { ANIMAL_GROUPS } from "./species";
import { HABITATS, PHOTO_CONFIDENCE } from "./speciesRecord";

export const responseSchemas = z.registry<{ id: string }>();

const TEXT = "Localized text with inline links (see *Text format*).";

const OFFSET_DATE_TIME = "ISO 8601 date-time with a UTC offset.";

const doc = <T extends z.ZodType>(
  schema: T,
  description: string,
  examples?: z.output<T>[],
) => schema.meta({ description, ...(examples ? { examples } : {}) });

const component = <T extends z.ZodType>(
  id: string,
  schema: T,
  description: string,
) => {
  const documented = doc(schema, description);
  responseSchemas.add(documented, { id });
  return documented;
};

const text = (description: string) =>
  doc(z.string(), `${description} ${TEXT} May be empty.`);

const speciesId = doc(
  z.string(),
  "Stable species id, lowercase and hyphenated. It is based on a scientific name but can differ from the current `scientificName`; never parse it.",
  ["macrovipera-lebetina"],
);

const slug = doc(
  z.string(),
  "Public slug for the requested locale. Georgian (`ka`) uses the Georgian Latin-script slug of the site URL; other locales use the species id.",
  ["giurza", "macrovipera-lebetina"],
);

const locale = component(
  "Locale",
  z.enum(locales),
  "Content locale. `ka` (Georgian) is the canonical text; `en`, `ru` and `tr` are translations of it.",
);

const group = component(
  "AnimalGroup",
  z.enum(ANIMAL_GROUPS),
  "Animal group of the species.",
);

const habitat = component("Habitat", z.enum(HABITATS), "Broad habitat tag.");

const danger = component(
  "DangerLevel",
  z.enum(["Harmless", "Moderate", "High"]),
  "Risk to humans, as shown on the site (legend: https://reptiles.ge/en/risk-to-humans). `Harmless` means no medically significant venom. Only snakes, lizards, turtles, amphibians, spiders and scorpions can carry it. This is educational, not medical advice; in an emergency in Georgia call 112.",
);

const photoConfidence = component(
  "PhotoConfidence",
  PHOTO_CONFIDENCE,
  "How the photo relates to Georgia. `georgia-field`: taken in Georgia, with a known photographer and locality. `range-typical`: shows the species as it looks in the region, not confirmed as taken in Georgia. `placeholder`: a stand-in image.",
);

const dateTime = (description: string) =>
  doc(z.string(), `${description} ${OFFSET_DATE_TIME}`, [
    "2026-10-16T18:07:56+04:00",
  ]);

const imageUrl = doc(z.string(), "Absolute image URL.", [
  "https://cdn.reptiles.ge/macrovipera-lebetina-laura-1.jpg",
]);

const photoCredit = component(
  "PhotoCredit",
  z.strictObject({
    authorId: doc(
      z.string(),
      "Id of the author this credit belongs to, in `/v1/authors`. Set whenever `photographer` is known to the atlas.",
      ["zauri-khachidze"],
    ).optional(),
    date: doc(
      z.string(),
      "When the photo was taken, as published: `YYYY-MM-DD`, `YYYY-MM`, or a localized day and month.",
      ["2024-04-21", "2006-03"],
    ).optional(),
    lat: doc(
      z.number(),
      "Latitude where the photo was taken (WGS 84). Present only together with `lng`.",
      [42.67992],
    ).optional(),
    lng: doc(
      z.number(),
      "Longitude where the photo was taken (WGS 84). Present only together with `lat`.",
      [44.77063],
    ).optional(),
    location: doc(z.string(), "Place name, localized.", [
      "Vashlovani protected areas",
    ]).optional(),
    photoConfidence: photoConfidence.optional(),
    photographer: doc(z.string(), "Photographer name.", [
      "Laura and Bobby Bok",
    ]).optional(),
    url: doc(z.string(), "Source page of the photo.").optional(),
  }),
  "Credit for a photo. Show the photographer whenever you show the photo.",
);

const galleryImage = component(
  "GalleryImage",
  z.strictObject({
    credit: photoCredit.optional(),
    photoConfidence: photoConfidence.optional(),
    src: imageUrl,
  }),
  "One photo of the species gallery.",
);

const audio = component(
  "SpeciesAudio",
  z.strictObject({
    date: doc(z.string(), "Recording date, `YYYY-MM-DD`.", [
      "2021-02-26",
    ]).optional(),
    location: doc(z.string(), "Recording place.").optional(),
    recordist: doc(z.string(), "Person who made the recording.", [
      "Hannu Varkki",
    ]).optional(),
    src: doc(
      z.string(),
      "Audio file. Either an absolute URL or a path on the site, such as `/audio/bubo-bubo.mp3`, to resolve against `https://reptiles.ge`.",
      ["https://cdn.reptiles.ge/audio/emberiza-citrinella.mp3"],
    ),
    url: doc(z.string(), "Source page of the recording.").optional(),
  }),
  "Call or song recording.",
);

const faq = component(
  "SpeciesFaq",
  z.strictObject({
    answer: text("Answer."),
    question: doc(z.string(), "Question."),
  }),
  "Question and answer shown on the profile.",
);

const stat = component(
  "SpeciesStat",
  z.strictObject({
    label: doc(z.string(), "Localized label.", ["Length"]),
    value: doc(z.string(), "Localized display value.", ["typically 70–90 cm"]),
  }),
  "Key fact shown on the profile. Labels and values are display strings, not machine-readable units.",
);

const source = component(
  "SpeciesSource",
  z.strictObject({
    name: doc(z.string(), "Citation."),
    url: doc(z.string(), "DOI or URL of the source.").optional(),
  }),
  "Published source the profile is based on.",
);

const identification = component(
  "SpeciesIdentification",
  z.strictObject({
    coloration: text("Colour description.").optional(),
    colors: doc(
      z.array(z.enum(SPECIES_COLORS)),
      "Main colours, for colour filters.",
      [["brown", "gray"]],
    ).optional(),
    summary: text("How to recognise the species."),
    traits: doc(
      z.array(z.string()),
      `Identification features, one paragraph each. ${TEXT}`,
    ),
  }),
  "How to tell the species apart from similar ones.",
);

const lookalikeRef = component(
  "LookalikeRef",
  z.strictObject({
    commonName: doc(z.string(), "Localized common name.", [
      "Urartian ratsnake",
    ]),
    id: speciesId,
    slug,
  }),
  "A published species that is easily confused with this one.",
);

const lookalikeIds = doc(
  z.array(speciesId),
  "Ids of published species that are easily confused with this one. Direct lookalikes come first, then species that list this one, by id.",
);

const common = {
  commonName: doc(z.string(), "Localized common name.", ["Levantine viper"]),
  danger: danger.optional(),
  description: text("Short summary."),
  family: doc(z.string(), "Scientific family name.", ["Viperidae"]),
  genus: doc(z.string(), "Scientific genus name.", ["Macrovipera"]),
  group,
  habitats: doc(z.array(habitat), "Habitat tags."),
  id: speciesId,
  image: doc(imageUrl, "Main (hero) image URL."),
  imageCredit: photoCredit.optional(),
  location: doc(z.string(), "Short localized range summary.", [
    "Eastern Georgia",
  ]),
  mobileImage: doc(imageUrl, "Hero image cropped for narrow screens.", [
    "https://cdn.reptiles.ge/macrovipera-lebetina-laura-1-crop-381-0-533-1000.jpg",
  ]).optional(),
  mobileImageCredit: photoCredit.optional(),
  publishedAt: dateTime("When the profile was first published."),
  scientificName: doc(z.string(), "Scientific name.", [
    "Macrovipera lebetinus",
  ]),
  slug,
  stats: doc(z.array(stat), "Key facts."),
  updatedAt: dateTime("When this locale's text last changed."),
};

const fullText = {
  audio: audio.optional(),
  behavior: text("Activity, seasons and reproduction."),
  conservation: text("Conservation status and threats."),
  diet: text("What it eats."),
  facts: doc(z.array(z.string()), `Short facts. ${TEXT}`),
  faq: doc(z.array(faq), "Questions and answers.").optional(),
  gallery: doc(z.array(galleryImage), "All photos, in display order."),
  habitat: text("Where it lives."),
  identification: identification.optional(),
  interaction: text("Encounters with people.").optional(),
  overview: text("Introduction to the species."),
  sources: doc(z.array(source), "Sources of the profile."),
};

const speciesSummary = component(
  "SpeciesSummary",
  z.strictObject({
    commonName: common.commonName,
    danger: doc(
      danger.nullable(),
      "Risk to humans, or `null` when the species has none.",
    ),
    group,
    id: speciesId,
    image: common.image,
    scientificName: common.scientificName,
    slug,
    updatedAt: dateTime(
      "When this locale's text last changed (Georgian date when there is no translation date).",
    ),
  }),
  "A published species in list form.",
);

const species = component(
  "Species",
  z.strictObject({
    ...common,
    ...fullText,
    lookalikes: doc(
      z.array(lookalikeRef),
      "Published species that are easily confused with this one, with names in the requested locale.",
    ),
  }),
  "Full species profile, as rendered on the site.",
);

const catalogCard = component(
  "CatalogCard",
  z.strictObject({
    ...common,
    lookalikes: lookalikeIds,
    photoCount: doc(
      z.int().min(0),
      "Number of photos in the species gallery. The `full` view lists them in `gallery`.",
      [8],
    ),
  }),
  "Species in the light `card` view of the catalog.",
);

const catalogPhotoSpecies = component(
  "CatalogPhotoSpecies",
  z.strictObject({
    ...common,
    gallery: fullText.gallery,
    lookalikes: lookalikeIds,
  }),
  "Species in the `photos` view of the catalog: the `card` fields plus the gallery with every photo credit, for credit and photo-use pages.",
);

const catalogQuizSpecies = component(
  "CatalogQuizSpecies",
  z.strictObject({
    ...common,
    facts: fullText.facts,
    gallery: fullText.gallery,
    identification: fullText.identification,
    lookalikes: lookalikeIds,
  }),
  "Species in the `quiz` view of the catalog: the `card` fields plus what an identification quiz needs (identification traits, facts and the gallery).",
);

const catalogSpecies = component(
  "CatalogSpecies",
  z.strictObject({ ...common, ...fullText, lookalikes: lookalikeIds }),
  "Species in the `full` view of the catalog: every text field, with lookalikes as ids.",
);

const fieldRecord = component(
  "FieldRecord",
  z.strictObject({
    date: doc(z.string(), "Observation date, `YYYY-MM-DD`.", [
      "2026-08-29",
    ]).optional(),
    evidence: doc(
      z.enum(["literature", "observation", "specimen"]),
      "Kind of evidence, when known.",
    ).optional(),
    lat: doc(z.number(), "Latitude (WGS 84).", [41.40829]),
    lng: doc(z.number(), "Longitude (WGS 84).", [45.36996]),
    locality: doc(z.string(), "Place name as recorded.", ["Kakheti, GE"]),
    note: doc(z.string(), "Remark on the record.").optional(),
    observer: doc(z.string(), "Observer username on the source platform.", [
      "bertogcliment",
    ]).optional(),
    observerName: doc(z.string(), "Observer display name.").optional(),
    source: doc(z.string(), "Literature or collection reference.").optional(),
    url: doc(z.string(), "Source record, usually an iNaturalist observation.", [
      "https://www.inaturalist.org/observations/397216544",
    ]).optional(),
  }),
  "A dated location where the species was recorded in Georgia.",
);

const total = doc(z.int().min(0), "Number of items in `data`.");

const resolvedLocale = doc(locale, "Locale of the texts in `data`.");

const catalogTotal = doc(
  z.int().min(0),
  "Number of published species in the whole catalog, on every page.",
);

const nextCursor = doc(
  z.string().nullable(),
  "Pass as `cursor` to get the next page. `null` on the last page and without `limit`.",
  [null],
);

export const speciesListResponse = component(
  "SpeciesListResponse",
  z.strictObject({
    data: z.array(speciesSummary),
    locale: resolvedLocale,
    total,
  }),
  "Published species in catalog order.",
);

export const speciesResponse = component(
  "SpeciesResponse",
  z.strictObject({ data: species, locale: resolvedLocale }),
  "One species profile.",
);

export const fieldRecordsResponse = component(
  "FieldRecordsResponse",
  z.strictObject({
    data: z.array(fieldRecord),
    id: doc(speciesId, "Species id the records belong to."),
    total,
  }),
  "Field records of one species.",
);

export const catalogCardResponse = component(
  "CatalogCardResponse",
  z.strictObject({
    data: z.array(catalogCard),
    locale: resolvedLocale,
    nextCursor,
    total: catalogTotal,
    view: z.literal("card"),
  }),
  "Catalog in the `card` view.",
);

export const catalogPhotosResponse = component(
  "CatalogPhotosResponse",
  z.strictObject({
    data: z.array(catalogPhotoSpecies),
    locale: resolvedLocale,
    nextCursor,
    total: catalogTotal,
    view: z.literal("photos"),
  }),
  "Catalog in the `photos` view.",
);

export const catalogQuizResponse = component(
  "CatalogQuizResponse",
  z.strictObject({
    data: z.array(catalogQuizSpecies),
    locale: resolvedLocale,
    nextCursor,
    total: catalogTotal,
    view: z.literal("quiz"),
  }),
  "Catalog in the `quiz` view.",
);

export const catalogFullResponse = component(
  "CatalogFullResponse",
  z.strictObject({
    data: z.array(catalogSpecies),
    locale: resolvedLocale,
    nextCursor,
    total: catalogTotal,
    view: z.literal("full"),
  }),
  "Catalog in the `full` view.",
);

const authorId = doc(
  z.string(),
  "Stable author id, lowercase and hyphenated. For a contributor it is also the slug of their page on reptiles.ge.",
  ["sandro-khakhva"],
);

const authorName = doc(
  z.string(),
  "Name in the requested locale, or the Georgian name when there is no translation.",
  ["Sandro Khakhva"],
);

const authorKind = doc(
  z.enum(AUTHOR_KINDS),
  "`person`, or `page` for a project or organisation page.",
);

const authorRole = doc(
  z.enum(AUTHOR_ROLES).nullable(),
  "Main role shown on the contributor page. `null` for authors who are only credited on photos.",
);

const isContributor = doc(
  z.boolean(),
  "`true` when the author has a contributor page on reptiles.ge. Other authors are only credited on photos.",
);

const authorPhotoCount = doc(
  z.int().min(0),
  "Number of distinct photos of published species credited to this author.",
);

const authorAliases = doc(
  z.array(z.string()),
  "Every spelling of the author's name that appears in photo credits (`credit.photographer`), in any locale, sorted.",
  [["Sandro Khakhva", "სანდრო ხახვა"]],
);

const authorSummary = component(
  "AuthorSummary",
  z.strictObject({
    aliases: authorAliases,
    id: authorId,
    isContributor,
    kind: authorKind,
    name: authorName,
    photoCount: authorPhotoCount,
    role: authorRole,
  }),
  "An author credited on atlas photos.",
);

const authorProfile = component(
  "Author",
  z.strictObject({
    affiliations: doc(
      z.array(z.enum(AFFILIATIONS)),
      "Ids of the institutions the author is affiliated with, in display order.",
    ),
    aliases: authorAliases,
    bio: doc(
      z.string(),
      "Short biography in plain text, in the requested locale or Georgian.",
    ).optional(),
    id: authorId,
    isContributor,
    jobTitle: doc(
      z.enum(AUTHOR_JOB_TITLES).nullable(),
      "Job title, when the contributor page shows one.",
    ),
    kind: authorKind,
    links: doc(
      z.strictObject({
        facebook: z.string().optional(),
        inaturalist: z.string().optional(),
        instagram: z.string().optional(),
        researchGate: z.string().optional(),
      }),
      "Public profile links. Empty when there are none.",
    ),
    metaDescription: doc(
      z.string(),
      "Short page description for search results, in the requested locale.",
    ).optional(),
    name: authorName,
    photoCount: authorPhotoCount,
    portraitClass: doc(
      z.string().nullable(),
      "CSS `object-position` hint used to crop the portrait on reptiles.ge.",
    ),
    portraitSrc: doc(
      z.string().nullable(),
      "Portrait image URL. Set for contributors.",
    ),
    role: authorRole,
  }),
  "An author's profile.",
);

export const authorListResponse = component(
  "AuthorListResponse",
  z.strictObject({
    data: z.array(authorSummary),
    locale: resolvedLocale,
    total,
  }),
  "Authors ordered by id.",
);

export const authorResponse = component(
  "AuthorResponse",
  z.strictObject({ data: authorProfile, locale: resolvedLocale }),
  "One author's profile.",
);

const plain = (description: string, examples?: string[]) =>
  doc(
    z.string(),
    `${description} Plain text in the response locale.`,
    examples,
  );

const newsSlug = doc(
  z.string(),
  "Article slug: lowercase Latin words joined by hyphens. The same in every locale; also the URL part on reptiles.ge (`/news/{slug}`).",
  ["lagodekhi-iucn-mwvane-sia"],
);

const newsPhoto = component(
  "NewsPhoto",
  z.strictObject({
    alt: plain("Alternative text of the photo."),
    credit: photoCredit.optional(),
    fromAtlas: doc(
      z.boolean(),
      "The site captions this photo as a photograph from the atlas.",
    ).optional(),
    height: doc(z.int().positive(), "Height in pixels, when known.").optional(),
    plate: doc(
      z.boolean(),
      "Show the whole image at its own aspect ratio, without cropping.",
    ).optional(),
    src: doc(
      z.string(),
      "Image URL. Either absolute or a path on the site, such as `/images/news/…`, to resolve against `https://reptiles.ge`.",
      ["https://cdn.reptiles.ge/capra-cylindricornis-nika-3.jpg"],
    ),
    width: doc(z.int().positive(), "Width in pixels, when known.").optional(),
  }),
  "A news photo. The credit is shown as published and is not translated.",
);

const newsMark = component(
  "NewsMark",
  z.union([
    doc(z.string(), "Plain text, possibly a single space between two links."),
    z.strictObject({
      href: doc(z.string(), "Absolute URL."),
      label: z.string(),
      type: z.literal("external"),
    }),
    z.strictObject({
      id: doc(z.string(), "Group hub id, such as `snakes`."),
      label: z.string(),
      type: z.literal("hub"),
    }),
    z.strictObject({
      id: doc(
        z.string(),
        "Region id, such as `kakheti` (`/regions/{id}` on the site).",
      ),
      label: z.string(),
      type: z.literal("region"),
    }),
    z.strictObject({
      id: doc(speciesId, "Species id; resolve it with `/v1/species`."),
      label: z.string(),
      type: z.literal("species"),
    }),
    z.strictObject({
      label: z.string(),
      slug: doc(z.string(), "Author id in `/v1/authors`."),
      type: z.literal("credit-author"),
    }),
    z.strictObject({
      label: z.string(),
      type: z.literal("news-index"),
    }),
    z.strictObject({
      name: doc(z.string(), "Scientific name, shown in italics."),
      type: z.literal("sci"),
    }),
  ]),
  "One piece of a paragraph: plain text, a link (`type` says to what; `label` is the visible text), a link to the news index, or a scientific name.",
);

const newsBlock = component(
  "NewsBlock",
  z.union([
    z.strictObject({
      parts: z.array(newsMark),
      type: z.literal("p"),
    }),
    z.strictObject({
      src: doc(
        z.string(),
        "`src` of one of the article's photos (`image` or `gallery`).",
      ),
      type: z.literal("figure"),
    }),
  ]),
  "A paragraph or a figure.",
);

const newsSection = component(
  "NewsSection",
  z.strictObject({
    blocks: z.array(newsBlock),
    heading: plain("Section heading."),
  }),
  "One section of the article body.",
);

const newsSummary = component(
  "NewsSummary",
  z.strictObject({
    dek: plain("Short summary under the title."),
    image: doc(newsPhoto, "Cover photo.").optional(),
    lead: plain("Opening paragraph."),
    locales: doc(
      z.array(locale),
      "Locales the article is written in. Georgian is always first.",
    ),
    publishedAt: doc(z.string(), "Publication date, `YYYY-MM-DD`.", [
      "2026-10-17",
    ]),
    relatedHubIds: doc(z.array(z.string()), "Group hubs the article is about."),
    relatedRegionIds: doc(
      z.array(z.string()),
      "Regions of Georgia the article is about.",
    ),
    relatedSpeciesIds: doc(
      z.array(speciesId),
      "Atlas species the article is about.",
    ),
    series: doc(
      z.strictObject({
        id: z.string(),
        name: plain("Series name."),
      }),
      "Series of related articles this one belongs to.",
    ).optional(),
    slug: newsSlug,
    sources: doc(
      z.array(
        z.strictObject({
          name: plain("Source name."),
          url: doc(z.string(), "URL of the source."),
        }),
      ),
      "Sources the article is based on. The first one is the main source.",
    ),
    title: plain("Article title."),
    updatedAt: doc(
      z.string(),
      "Date of the last substantive update, `YYYY-MM-DD`.",
    ).optional(),
  }),
  "A published news article without its body.",
);

const newsArticle = component(
  "NewsArticle",
  newsSummary.extend({
    gallery: doc(z.array(newsPhoto), "Further photos, in order. May be empty."),
    metaDescription: plain("Description for search results."),
    metaTitle: plain("Title for search results."),
    sections: doc(z.array(newsSection), "Article body."),
  }),
  "A published news article with its body.",
);

export const newsListResponse = component(
  "NewsListResponse",
  z.strictObject({
    data: z.array(newsSummary),
    locale: resolvedLocale,
    nextCursor,
    total: doc(z.int().min(0), "Number of matching articles, on every page."),
  }),
  "Published articles in the requested locale, newest first.",
);

export const newsResponse = component(
  "NewsResponse",
  z.strictObject({
    data: newsArticle,
    locale: doc(
      locale,
      "Locale of the texts in `data`. `ka` when the article has no text in the requested locale.",
    ),
  }),
  "One news article.",
);

export const errorResponse = component(
  "Error",
  z.strictObject({
    error: z.strictObject({
      code: doc(
        z.string(),
        "Stable machine-readable code. Public endpoints return `invalid_request`, `not_found` or `internal_error`.",
        ["not_found"],
      ),
      details: doc(
        z.array(
          z.strictObject({
            message: z.string(),
            path: doc(z.string(), "Dot path of the invalid input."),
          }),
        ),
        "For `invalid_request`: one entry per invalid input.",
      ).optional(),
      message: doc(z.string(), "Human-readable message in English.", [
        "Species not found",
      ]),
    }),
  }),
  "Every error has this shape.",
);
