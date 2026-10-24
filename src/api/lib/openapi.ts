import { z } from "zod";

import {
  authorListQuery,
  authorParam,
  contributorListQuery,
} from "../schemas/authors";
import { catalogQuery } from "../schemas/catalog";
import { LOCALE_HEADER, localeHeader } from "../schemas/common";
import { newsListQuery, newsParam } from "../schemas/news";
import { responseSchemas } from "../schemas/responses";
import { speciesListQuery, speciesParam } from "../schemas/species";
import { API_KEY_HEADER } from "./apiKeys";
import { PUBLIC_CACHE } from "./cache";
import { RESPONSE_EXAMPLES } from "./openapiExamples";

type Example = { summary?: string; value: unknown };

type JsonSchema = Record<string, unknown>;

type Operation = {
  description: string;
  errors: Array<400 | 404>;
  header?: z.ZodObject;
  method: "get";
  operationId: string;
  param?: z.ZodObject;
  parameterDocs?: Record<string, ParameterDoc>;
  path: string;
  query?: z.ZodObject;
  success: {
    description: string;
    examples: Record<string, Example>;
    schema: JsonSchema;
  };
  summary: string;
  tag: "Authors" | "Catalog" | "Images" | "News" | "Species";
};

type ParameterDoc = { description: string; example: string };

const ref = (id: string) => ({ $ref: `#/components/schemas/${id}` });

const PARAMETER_DOCS: Record<string, ParameterDoc> = {
  cursor: {
    description:
      "The `nextCursor` of the previous page (the `id` of its last species). Only with `limit`, not with `page`.",
    example: "natrix-tessellata",
  },
  danger: {
    description:
      "`venomous` (danger level `High` or `Moderate`) or `harmless`. Only groups where venom applies: amphibians, lizards, scorpions, snakes, spiders and turtles.",
    example: "venomous",
  },
  group: {
    description: "Only species of this animal group.",
    example: "snake",
  },
  habitat: {
    description: "Only species tagged with this habitat.",
    example: "forest",
  },
  limit: {
    description:
      "Page size, 1–100. Without it every match comes back in one response.",
    example: "40",
  },
  page: {
    description:
      "Page number from 1, of `limit` species each. Only with `limit`, not with `cursor`. A page past the last one is empty.",
    example: "2",
  },
  q: {
    description:
      "Search text, up to 100 characters. Matches common names and places in every locale, and scientific, genus and family names, case-insensitively.",
    example: "viper",
  },
  region: {
    description:
      "Only species the atlas lists for this region of Georgia (a region id of Reptiles.ge, such as `kakheti`).",
    example: "kakheti",
  },
  slug: {
    description:
      "Public slug of the species in the requested locale (`X-Locale`): the Georgian slug for `ka` (`giurza`), the species id for `en`, `ru` and `tr` (`macrovipera-lebetina`). Case-insensitive.",
    example: "giurza",
  },
  sort: {
    description:
      "`catalog` (default, catalog order), `featured` (species with a photo first), `az` (common name in the requested locale), `range` (most regions first) or `updated` (newest text first). Ties keep catalog order.",
    example: "featured",
  },
  view: {
    description:
      "`card` (default, about 200–300 KB without `limit`) has what lists and cards need. `photos` adds the gallery (about 0.5 MB), `quiz` adds identification, facts and gallery (about 0.8–1.4 MB). `full` adds every text field and is several MB (about 2 MB for `en`, 3.7 MB for `ka`); use it only when you need all texts at once. Georgian responses are the largest.",
    example: "card",
  },
  "x-locale": {
    description:
      "Language of the texts. `ka` (Georgian) is the canonical text and the default; `en`, `ru` and `tr` are translations.",
    example: "en",
  },
};

const NEWS_PARAMETER_DOCS: Record<string, ParameterDoc> = {
  author: {
    description:
      "Only articles that name this author (an id from `/v1/authors`) or one of their credit spellings.",
    example: "nika-melikishvili",
  },
  hub: {
    description: "Only articles about this group hub.",
    example: "birds",
  },
  limit: {
    description: "Page size, 1–100. Default 50.",
    example: "24",
  },
  page: {
    description: "Page number, from 1. Default 1.",
    example: "1",
  },
  q: {
    description:
      "Only articles whose title, dek or source names contain this text, ignoring case.",
    example: "batumi",
  },
  region: {
    description: "Only articles about this region of Georgia.",
    example: "kakheti",
  },
  series: {
    description: "Only articles of this series.",
    example: "batumi-raptor-count-2026",
  },
  slug: {
    description: "Article slug. The same in every locale.",
    example: "lagodekhi-iucn-mwvane-sia",
  },
  species: {
    description:
      "Only articles about this species (a species id), or that link it in the text of the requested locale.",
    example: "capra-cylindricornis",
  },
};

const DESCRIPTION = `
Open, read-only JSON API of [Reptiles.ge](https://reptiles.ge), the atlas of animals of Georgia (the country in the Caucasus).

It serves the same published species profiles as the site: amphibians and reptiles (the deepest layer, following the Tarkhnishvili et al. 2026 checklist), birds, mammals, spiders, scorpions and insects. Lists contain published atlas profiles only; they are not a complete list of Georgia's fauna. The atlas news articles are under \`/v1/news\`.

## Quick start

\`\`\`bash
curl -H "X-Api-Key: rpt_…" -H "X-Locale: en" "https://api.reptiles.ge/v1/species?group=snake"
curl -H "X-Api-Key: rpt_…" -H "X-Locale: en" "https://api.reptiles.ge/v1/species/giurza"
\`\`\`

Every request needs an API key in the \`${API_KEY_HEADER}\` header. Ask for one through [the developers page](https://reptiles.ge/en/developers). Keys start with \`rpt_\` and can expire or be revoked. Keep the key on your server: do not put it in browser code. Browsers on other sites cannot send the header anyway, because cross-origin requests do not allow it. To try a request here, enter the key under "Authentication".

Each key may make 120 requests per minute. Responses served from the edge cache count too.

## Versioning

Every path starts with \`/v1\`. A breaking change gets a new version (\`/v2\`) instead of changing \`/v1\`. Within \`/v1\`, new fields may be added: ignore fields you do not know.

## Locales

Send the \`${LOCALE_HEADER}\` request header: \`ka\`, \`en\`, \`ru\` or \`tr\` (default \`ka\`). There is no \`locale\` query parameter. Georgian is the canonical text; the other locales translate it. Names, texts, stat labels and photo places come back in that locale; scientific names, ids and URLs are the same in every locale. \`updatedAt\` is the date of that locale's text. Every response with localized text echoes the \`locale\` it used, in the body and in \`Content-Language\`; \`/v1/species/{slug}/field-records\` and \`/v1/images\` have no localized text and send neither.

## Ids and slugs

\`id\` is the stable key of a species (for example \`macrovipera-lebetina\`). \`slug\` is the public URL part for the requested locale: the Georgian slug for \`ka\` (\`giurza\`), the id otherwise. \`/v1/species/{slug}\` accepts only that slug, for the same \`${LOCALE_HEADER}\`: \`/v1/species/giurza\`, or \`/v1/species/macrovipera-lebetina\` with \`${LOCALE_HEADER}: en\`.

## Text format

Text fields are plain text, not HTML:

- Paragraphs are separated by \`\\n\`.
- Links are inline Markdown, \`[label](target)\`. A target is one of:
  - a species id, such as \`[Dinnik’s viper](vipera-dinniki)\`: link it to that species (\`/v1/species/vipera-dinniki\`);
  - a site path starting with \`/\`, such as \`[Kakheti](/regions/kakheti)\`: a page on Reptiles.ge, in its English form (\`https://reptiles.ge/en/regions/kakheti\`);
  - an absolute \`https://\` URL.
- There is no other Markdown.

News article bodies (\`/v1/news/{slug}\`) do not use this format. Their paragraphs are arrays of \`NewsMark\` pieces: plain strings, typed links and scientific names.

An empty string, an empty array or a missing optional field means the atlas has published nothing there. It does not mean "none" or "absent": do not fill it in or read it as a negative answer.

## Images, audio and credits

Image URLs are absolute (mostly \`cdn.reptiles.ge\`). Each photo can carry a credit (\`imageCredit\`, \`mobileImageCredit\`, \`gallery[].credit\`): show the photographer whenever you show the photo. Every \`photographer\` spelling is an alias of one author in \`/v1/authors\`; contributors (\`isContributor\`) also have a profile page on Reptiles.ge. \`photoConfidence\` says whether a photo was taken in Georgia. An \`audio.src\` can be a site path such as \`/audio/bubo-bubo.mp3\`; resolve it against \`https://reptiles.ge\`. Resized AVIF and WebP copies of photos uploaded through the API are listed in \`/v1/images\`.

## Caching

Successful responses send \`Cache-Control: ${PUBLIC_CACHE}\` and are cached at the edge, so a change can take up to an hour to appear. Successful responses have an \`ETag\`: send it back in \`If-None-Match\` and you get \`304 Not Modified\` with an empty body when nothing changed. Prefer \`/v1/species\`, the \`card\`, \`photos\` or \`quiz\` catalog over the multi-megabyte \`full\` catalog.

## Errors

Errors use one JSON shape, \`{ "error": { "code", "message", "details"? } }\`. \`code\` is stable; \`message\` is for people. \`400 invalid_request\` lists every invalid input in \`details\`; an unknown species or path answers \`404 not_found\`. A missing, revoked or expired key answers \`401 unauthorized\`, checked before any other input. More than 120 requests in a minute for one key answer \`429 rate_limited\`; wait a minute and retry.

## About the content

This is a scientific atlas. Each profile lists its sources in \`sources\`. The \`danger\` level is an educational risk label, not medical advice; in an emergency in Georgia call **112**.
`.trim();

const OPERATIONS: Operation[] = [
  {
    description:
      "Every published species in catalog order, in a light list form. Filter with `group`.",
    errors: [400],
    header: localeHeader,
    method: "get",
    operationId: "listSpecies",
    path: "/v1/species",
    query: speciesListQuery,
    success: {
      description: "Published species.",
      examples: { snakes: { value: RESPONSE_EXAMPLES.speciesList } },
      schema: ref("SpeciesListResponse"),
    },
    summary: "List species",
    tag: "Species",
  },
  {
    description:
      "One published species profile with every text, the photo gallery, sources and lookalikes. Unpublished species answer `404`.",
    errors: [400, 404],
    header: localeHeader,
    method: "get",
    operationId: "getSpecies",
    param: speciesParam,
    path: "/v1/species/{slug}",
    success: {
      description: "Species profile.",
      examples: {
        levantineViper: {
          summary: "Levantine viper, shortened",
          value: RESPONSE_EXAMPLES.species,
        },
      },
      schema: ref("SpeciesResponse"),
    },
    summary: "Get a species",
    tag: "Species",
  },
  {
    description:
      "Dated locations where the species was recorded in Georgia: observations (mostly iNaturalist), literature and specimens. Not every species has records; then `data` is empty.",
    errors: [400, 404],
    header: localeHeader,
    method: "get",
    operationId: "listFieldRecords",
    param: speciesParam,
    path: "/v1/species/{slug}/field-records",
    success: {
      description: "Field records.",
      examples: {
        levantineViper: {
          summary: "One record, shortened",
          value: RESPONSE_EXAMPLES.fieldRecords,
        },
      },
      schema: ref("FieldRecordsResponse"),
    },
    summary: "List field records",
    tag: "Species",
  },
  {
    description:
      "Settings and texts of the interactive range map on the species page, in the requested locale. Only texts that differ from the site's defaults are listed. `data` is `null` when the species page has no interactive map.",
    errors: [400, 404],
    header: localeHeader,
    method: "get",
    operationId: "getRangeMap",
    param: speciesParam,
    path: "/v1/species/{slug}/range-map",
    success: {
      description: "Range map.",
      examples: {
        pondSlider: {
          summary: "Pond slider, shortened",
          value: RESPONSE_EXAMPLES.rangeMap,
        },
      },
      schema: ref("RangeMapResponse"),
    },
    summary: "Get the range map",
    tag: "Species",
  },
  {
    description:
      "Published species with groups, habitats and lookalike ids. Use `card` for lists and cards, `photos` for photo credits (the card fields plus the gallery), `quiz` for identification quizzes (the card fields plus identification, facts and gallery), and `full` only when you need every text, for example to build a search index. Filter with `group`, `danger`, `habitat`, `region` and `q`, and order with `sort`. Pagination is optional: pass `limit`, then either `page` for a numbered page or each response's `nextCursor` as `cursor` until it is `null`. `total` counts every match; `facets` count the matches for each filter value and `stats` sum over every match, so a page never needs the whole catalog for its counts.",
    errors: [400],
    header: localeHeader,
    method: "get",
    operationId: "getCatalog",
    path: "/v1/catalog",
    query: catalogQuery,
    success: {
      description: "Catalog in the requested view.",
      examples: {
        card: {
          summary: "card view, one species shown",
          value: RESPONSE_EXAMPLES.catalogCard,
        },
        full: {
          summary: "full view, one species shown and shortened",
          value: RESPONSE_EXAMPLES.catalogFull,
        },
        photos: {
          summary: "photos view, one species shown",
          value: RESPONSE_EXAMPLES.catalogPhotos,
        },
        quiz: {
          summary: "quiz view, one species shown and shortened",
          value: RESPONSE_EXAMPLES.catalogQuiz,
        },
      },
      schema: {
        discriminator: { propertyName: "view" },
        oneOf: [
          ref("CatalogCardResponse"),
          ref("CatalogFullResponse"),
          ref("CatalogPhotosResponse"),
          ref("CatalogQuizResponse"),
        ],
      },
    },
    summary: "Get the catalog",
    tag: "Catalog",
  },
  {
    description:
      "Everyone credited on atlas photos, ordered by id. Pass `contributor=true` for only the contributors who have a page on Reptiles.ge. `name` is localized; a photo credit's `photographer` text matches one of an author's `aliases`.",
    errors: [400],
    header: localeHeader,
    method: "get",
    operationId: "listAuthors",
    path: "/v1/authors",
    query: authorListQuery,
    success: {
      description: "Authors.",
      examples: {
        contributors: {
          summary: "contributor=true, one author shown",
          value: RESPONSE_EXAMPLES.authorList,
        },
      },
      schema: ref("AuthorListResponse"),
    },
    summary: "List authors",
    tag: "Authors",
  },
  {
    description:
      "One author's profile: localized name and biography, role, links, affiliations, the name spellings used in photo credits, and how many photos of published species they are credited on.",
    errors: [400, 404],
    header: localeHeader,
    method: "get",
    operationId: "getAuthor",
    param: authorParam,
    path: "/v1/authors/{id}",
    success: {
      description: "Author profile.",
      examples: {
        sandroKhakhva: {
          summary: "A contributor",
          value: RESPONSE_EXAMPLES.author,
        },
      },
      schema: ref("AuthorResponse"),
    },
    summary: "Get an author",
    tag: "Authors",
  },
  {
    description:
      "Every contributor with a page on Reptiles.ge, as full profiles, most credited photos first (ties by id). `photoCount` and `speciesCount` count photos of published species. Pass `limit` for only the first contributors; `total` always counts all of them.",
    errors: [400],
    header: localeHeader,
    method: "get",
    operationId: "listContributors",
    path: "/v1/contributors",
    query: contributorListQuery,
    success: {
      description: "Contributors.",
      examples: {
        top: {
          summary: "limit=1",
          value: RESPONSE_EXAMPLES.contributorList,
        },
      },
      schema: ref("ContributorListResponse"),
    },
    summary: "List contributors",
    tag: "Authors",
  },
  {
    description:
      "One contributor's profile, the same fields as an entry in `/v1/contributors`. Authors who are only credited on photos (no page on Reptiles.ge) answer 404; use `/v1/authors/{id}` for them.",
    errors: [400, 404],
    header: localeHeader,
    method: "get",
    operationId: "getContributor",
    param: authorParam,
    path: "/v1/contributors/{id}",
    success: {
      description: "Contributor profile.",
      examples: {
        zauriKhachidze: {
          summary: "A contributor",
          value: RESPONSE_EXAMPLES.contributor,
        },
      },
      schema: ref("ContributorResponse"),
    },
    summary: "Get a contributor",
    tag: "Authors",
  },
  {
    description:
      "Published news articles in the requested locale, newest first, without their body. Only articles written in that locale are listed. Filter with `hub`, `region`, `species`, `series`, `author` or the text search `q`; filters combine. Pages are numbered: `page` (from 1) and `limit` (default 50), with `total` and `pageCount` in every response. `facets.hub` counts the matches for each hub with the other filters applied.",
    errors: [400],
    header: localeHeader,
    method: "get",
    operationId: "listNews",
    parameterDocs: NEWS_PARAMETER_DOCS,
    path: "/v1/news",
    query: newsListQuery,
    success: {
      description: "News articles.",
      examples: {
        series: {
          summary: "series=batumi-raptor-count-2026&limit=1, shortened",
          value: RESPONSE_EXAMPLES.newsList,
        },
      },
      schema: ref("NewsListResponse"),
    },
    summary: "List news",
    tag: "News",
  },
  {
    description:
      "One published news article with its body: sections of paragraphs and figures. Paragraphs are structured (`NewsMark`), not Markdown. When the article has no text in the requested locale, the Georgian text comes back and `locale` says `ka`. Drafts answer `404`.",
    errors: [400, 404],
    header: localeHeader,
    method: "get",
    operationId: "getNews",
    param: newsParam,
    parameterDocs: NEWS_PARAMETER_DOCS,
    path: "/v1/news/{slug}",
    success: {
      description: "News article.",
      examples: {
        lagodekhi: {
          summary: "Lagodekhi, shortened",
          value: RESPONSE_EXAMPLES.news,
        },
      },
      schema: ref("NewsResponse"),
    },
    summary: "Get a news article",
    tag: "News",
  },
  {
    description:
      "Photos uploaded through the API that have resized AVIF and WebP copies, ordered by `src`. Photos optimized before uploads moved to the API are not listed. Use it to build `srcset` for an `image` or `gallery[].src` you already have.",
    errors: [],
    method: "get",
    operationId: "listImages",
    path: "/v1/images",
    success: {
      description: "Optimized photos.",
      examples: {
        levantineViper: {
          summary: "One photo",
          value: RESPONSE_EXAMPLES.images,
        },
      },
      schema: ref("OptimizedImageListResponse"),
    },
    summary: "List optimized photos",
    tag: "Images",
  },
];

export const UNDOCUMENTED_PATH_PREFIXES = [
  "/v1/access-requests",
  "/v1/admin/",
  "/v1/auth/",
  "/v1/ratings",
  "/v1/views",
];

export const documentedOperations = OPERATIONS.map(({ method, path }) => ({
  method,
  path,
}));

export function buildOpenApiDocument() {
  const paths: Record<string, Record<string, unknown>> = {};
  for (const entry of OPERATIONS) {
    paths[entry.path] = {
      ...paths[entry.path],
      [entry.method]: operation(entry),
    };
  }
  return {
    components: {
      headers: {
        CacheControl: {
          description: "Caching policy of the response.",
          schema: { example: PUBLIC_CACHE, type: "string" },
        },
        ETag: {
          description: "Version of the response. Send it in `If-None-Match`.",
          schema: { type: "string" },
        },
      },
      parameters: {
        IfNoneMatch: {
          description:
            "An `ETag` from an earlier response. When it still matches, the API answers `304` with an empty body.",
          in: "header",
          name: "If-None-Match",
          required: false,
          schema: { type: "string" },
        },
      },
      responses: {
        BadRequest: errorResponse(
          "Invalid query or path parameter.",
          RESPONSE_EXAMPLES.invalidRequest,
        ),
        InternalError: errorResponse("Unexpected server error.", {
          error: { code: "internal_error", message: "Internal error" },
        }),
        NotFound: errorResponse(
          "No published species, author or news article with this id or slug.",
          RESPONSE_EXAMPLES.error,
        ),
        NotModified: {
          description: "The `If-None-Match` ETag still matches. Empty body.",
          headers: { ETag: { $ref: "#/components/headers/ETag" } },
        },
        TooManyRequests: errorResponse("Too many requests for this API key.", {
          error: {
            code: "rate_limited",
            message: "Too many requests for this key",
          },
        }),
        Unauthorized: errorResponse("Missing or invalid API key.", {
          error: { code: "unauthorized", message: "Missing API key" },
        }),
      },
      schemas: componentSchemas(),
      securitySchemes: {
        ApiKey: {
          description: "API key of a registered client.",
          in: "header",
          name: API_KEY_HEADER,
          type: "apiKey",
        },
      },
    },
    externalDocs: {
      description: "Reptiles.ge, the atlas these data come from",
      url: "https://reptiles.ge/en",
    },
    info: {
      contact: { name: "Reptiles.ge", url: "https://reptiles.ge/en/contact" },
      description: DESCRIPTION,
      title: "Reptiles.ge API",
      version: "1",
    },
    openapi: "3.1.0",
    paths,
    security: [{ ApiKey: [] }],
    servers: [
      { description: "This server", url: "/" },
      { description: "Production", url: "https://api.reptiles.ge" },
    ],
    tags: [
      {
        description: "Published species profiles and their field records.",
        name: "Species",
      },
      {
        description:
          "Published species with filters, counts per filter and optional pagination.",
        name: "Catalog",
      },
      {
        description: "Photographers and contributors credited on atlas photos.",
        name: "Authors",
      },
      {
        description: "Published news articles of the atlas.",
        name: "News",
      },
      {
        description: "Resized AVIF and WebP copies of uploaded photos.",
        name: "Images",
      },
    ],
  };
}

function componentSchemas() {
  const { schemas } = z.toJSONSchema(responseSchemas, {
    io: "output",
    uri: (id) => `#/components/schemas/${id}`,
  });
  return Object.fromEntries(
    Object.entries(schemas).map(([id, schema]) => {
      const { $id: _id, $schema: _schema, ...rest } = schema;
      return [id, rest];
    }),
  );
}

function errorResponse(description: string, example: unknown) {
  return {
    content: { "application/json": { example, schema: ref("Error") } },
    description,
  };
}

function headerName(name: string) {
  return name.replace(
    /(^|-)([a-z])/g,
    (_, dash, letter: string) => `${dash}${letter.toUpperCase()}`,
  );
}

function operation(entry: Operation) {
  const errors = { 400: "BadRequest", 404: "NotFound" };
  return {
    description: entry.description,
    operationId: entry.operationId,
    parameters: [
      ...(entry.header ? parameters(entry.header, "header", entry) : []),
      ...(entry.param ? parameters(entry.param, "path", entry) : []),
      ...(entry.query ? parameters(entry.query, "query", entry) : []),
      { $ref: "#/components/parameters/IfNoneMatch" },
    ],
    responses: {
      200: {
        content: {
          "application/json": {
            examples: entry.success.examples,
            schema: entry.success.schema,
          },
        },
        description: entry.success.description,
        headers: {
          "Cache-Control": { $ref: "#/components/headers/CacheControl" },
          ETag: { $ref: "#/components/headers/ETag" },
        },
      },
      304: { $ref: "#/components/responses/NotModified" },
      401: { $ref: "#/components/responses/Unauthorized" },
      429: { $ref: "#/components/responses/TooManyRequests" },
      ...Object.fromEntries(
        entry.errors.map((status) => [
          status,
          { $ref: `#/components/responses/${errors[status]}` },
        ]),
      ),
      500: { $ref: "#/components/responses/InternalError" },
    },
    summary: entry.summary,
    tags: [entry.tag],
  };
}

function parameters(
  schema: z.ZodObject,
  location: "header" | "path" | "query",
  entry: Operation,
) {
  const required = new Set((toSchema(schema).required as string[]) ?? []);
  return Object.entries(schema.shape).map(([name, field]) => ({
    ...(entry.parameterDocs?.[name] ?? PARAMETER_DOCS[name]),
    in: location,
    name: location === "header" ? headerName(name) : name,
    required: location === "path" || required.has(name),
    schema: toSchema(field as z.ZodType),
  }));
}

function toSchema(schema: z.ZodType): JsonSchema {
  const { $schema: _, ...rest } = z.toJSONSchema(schema, {
    io: "input",
    unrepresentable: "any",
  });
  return rest;
}
