import type { HerpetofaunaChecklistStatus } from "@/data/herpetofauna-checklist";
import type { AnimalGroup, HabitatTag } from "@/data/speciesAtlasMeta";
import type {
  DangerLevel,
  GalleryImage,
  PhotoCredit,
  Species,
  SpeciesIdentification,
  SpeciesTranslation,
} from "@/data/speciesTypes";

import type { ApiDatabase, ApiStatement } from "./database";

import { TRANSLATION_LOCALES, type TranslationLocale } from "./speciesRows";

export type SpeciesCatalogData = {
  atlasMeta: Record<string, SpeciesCatalogMeta>;
  catalogIds: string[];
  idByAnySlug: Record<string, string>;
  kaSlugById: Record<string, string>;
  lookalikes: Record<string, string[]>;
  slugsById: Record<string, string[]>;
  species: Species[];
  translations: Record<TranslationLocale, Record<string, SpeciesTranslation>>;
  unpublishedIds: string[];
};

type CreditRow = {
  author_id: null | string;
  credit_date: null | string;
  credit_lat: null | number;
  credit_lng: null | number;
  credit_location: null | string;
  credit_person: null | string;
  credit_photo_confidence_id: null | string;
  credit_url: null | string;
  photo_confidence_id: null | string;
};

type Localized<T> = Map<string, T[]>;

type MediaRow = CreditRow & {
  id: number;
  position: number;
  role: "audio" | "gallery" | "hero" | "mobile";
  species_id: string;
  src: string;
};

type OverlayRow = CreditRow & {
  locale: TranslationLocale;
  media_id: number;
  position: number;
};

type SpeciesCatalogMeta = {
  checklistStatus: HerpetofaunaChecklistStatus | null;
  class: null | string;
  featured: boolean;
  group: AnimalGroup;
  habitats: HabitatTag[];
  order: null | string;
};

type SpeciesRow = {
  checklist_status_id: HerpetofaunaChecklistStatus | null;
  danger_id: DangerLevel | null;
  family: string;
  featured: number;
  genus: string;
  group_id: AnimalGroup;
  id: string;
  published_at: string;
  scientific_name: string;
  slug_ka: null | string;
  status: string;
  taxon_class: null | string;
  taxon_order: null | string;
};

type TextRow = {
  behavior: string;
  common_name: string;
  conservation: string;
  description: string;
  diet: string;
  habitat: string;
  identification_coloration: null | string;
  identification_summary: null | string;
  interaction: null | string;
  locale: string;
  location: string;
  overview: string;
  species_id: string;
  updated_at: null | string;
};

const CREDIT_SELECT =
  "photo_confidence_id, author_id, credit_person, credit_location, credit_date, credit_lat, credit_lng, credit_url, credit_photo_confidence_id";

export type SpeciesCatalogParts = {
  facts: boolean;
  faq: boolean;
  identification: boolean;
  longTexts: boolean;
  sources: boolean;
};

export type SpeciesCatalogScope = {
  locales?: readonly TranslationLocale[];
  match?: SpeciesMatch;
  parts?: SpeciesCatalogParts;
  published?: boolean;
};

export type SpeciesMatch = { sql: string; value: string };

type CatalogRows = {
  colors: Array<{ color: string; species_id: string }>;
  faq: Array<{
    answer: string;
    locale: string;
    question: string;
    species_id: string;
  }>;
  habitats: Array<{ habitat_id: HabitatTag; species_id: string }>;
  items: Array<{
    kind: string;
    locale: string;
    species_id: string;
    text: string;
  }>;
  lookalikes: Array<{ lookalike_id: string; species_id: string }>;
  media: MediaRow[];
  overlays: OverlayRow[];
  slugs: Array<{ slug: string; species_id: string }>;
  sources: Array<{ name: string; species_id: string; url: null | string }>;
  species: SpeciesRow[];
  stats: Array<{
    label: string;
    locale: string;
    species_id: string;
    value: string;
  }>;
  texts: TextRow[];
};

type Clause = { sql: string; values: unknown[] };

const ALL_PARTS: SpeciesCatalogParts = {
  facts: true,
  faq: true,
  identification: true,
  longTexts: true,
  sources: true,
};

const BASE_TEXT_COLUMNS =
  "species_id, locale, common_name, description, location, updated_at";

const LONG_TEXT_COLUMNS = {
  skipped:
    "'' AS overview, '' AS habitat, '' AS diet, '' AS behavior, '' AS conservation, NULL AS interaction",
  wanted: "overview, habitat, diet, behavior, conservation, interaction",
};

const IDENTIFICATION_TEXT_COLUMNS = {
  skipped: "NULL AS identification_summary, NULL AS identification_coloration",
  wanted: "identification_summary, identification_coloration",
};

export async function readSpeciesCatalog(
  db: ApiDatabase,
  speciesId?: string,
): Promise<SpeciesCatalogData> {
  const query = speciesCatalogQuery(
    db,
    speciesId ? { match: { sql: "= ?", value: speciesId } } : {},
  );
  return query.build(
    (await db.batch(query.statements)).map((result) => result.results),
  );
}

export function speciesCatalogQuery(
  db: ApiDatabase,
  {
    locales = TRANSLATION_LOCALES,
    match,
    parts = ALL_PARTS,
    published = false,
  }: SpeciesCatalogScope,
) {
  const speciesClauses = (column: string): Clause[] => [
    ...(match
      ? [{ sql: `${column} ${match.sql}`, values: [match.value] }]
      : []),
    ...(published
      ? [
          {
            sql:
              column === "id"
                ? "status = 'published'"
                : `${column} IN (SELECT id FROM species WHERE status = 'published')`,
            values: [],
          },
        ]
      : []),
  ];
  const allLocales = TRANSLATION_LOCALES.every((code) =>
    locales.includes(code),
  );
  const localeClause = (codes: readonly string[]): Clause[] =>
    allLocales
      ? []
      : [
          {
            sql: `locale IN (${codes.map(() => "?").join(", ")})`,
            values: [...codes],
          },
        ];
  const textLocales = ["ka", ...locales];
  const listKinds = [
    ...(parts.facts ? ["fact"] : []),
    ...(parts.identification ? ["identification_trait"] : []),
  ];
  const textColumns = [
    BASE_TEXT_COLUMNS,
    LONG_TEXT_COLUMNS[parts.longTexts ? "wanted" : "skipped"],
    IDENTIFICATION_TEXT_COLUMNS[parts.identification ? "wanted" : "skipped"],
  ].join(", ");
  const statement = (sql: string, clauses: Clause[], order = "") => {
    const where = clauses.length
      ? ` WHERE ${clauses.map((clause) => clause.sql).join(" AND ")}`
      : "";
    const values = clauses.flatMap((clause) => clause.values);
    const prepared = db.prepare(`${sql}${where}${order}`);
    return values.length ? prepared.bind(...values) : prepared;
  };
  const queries: Partial<Record<keyof CatalogRows, ApiStatement>> = {
    species: statement(
      "SELECT id, scientific_name, genus, family, group_id, danger_id, status, slug_ka, published_at, taxon_order, taxon_class, checklist_status_id, featured FROM species",
      speciesClauses("id"),
      " ORDER BY catalog_position",
    ),
    texts: statement(`SELECT ${textColumns} FROM species_texts`, [
      ...speciesClauses("species_id"),
      ...localeClause(textLocales),
    ]),
    ...(listKinds.length
      ? {
          items: statement(
            "SELECT species_id, locale, kind, text FROM species_list_items",
            [
              ...speciesClauses("species_id"),
              ...localeClause(textLocales),
              ...(listKinds.length === 2
                ? []
                : [
                    {
                      sql: `kind IN (${listKinds.map(() => "?").join(", ")})`,
                      values: listKinds,
                    },
                  ]),
            ],
            " ORDER BY species_id, locale, kind, position",
          ),
        }
      : {}),
    ...(parts.faq
      ? {
          faq: statement(
            "SELECT species_id, locale, question, answer FROM species_faq",
            [...speciesClauses("species_id"), ...localeClause(textLocales)],
            " ORDER BY species_id, locale, position",
          ),
        }
      : {}),
    stats: statement(
      "SELECT species_id, locale, label, value FROM species_stats",
      [...speciesClauses("species_id"), ...localeClause(textLocales)],
      " ORDER BY species_id, locale, position",
    ),
    ...(parts.identification
      ? {
          colors: statement(
            "SELECT species_id, color FROM species_identification_colors",
            speciesClauses("species_id"),
            " ORDER BY species_id, position",
          ),
        }
      : {}),
    ...(parts.sources
      ? {
          sources: statement(
            "SELECT species_id, name, url FROM species_sources",
            speciesClauses("species_id"),
            " ORDER BY species_id, position",
          ),
        }
      : {}),
    habitats: statement(
      "SELECT species_id, habitat_id FROM species_habitats",
      speciesClauses("species_id"),
      " ORDER BY species_id, position",
    ),
    media: statement(
      `SELECT id, species_id, role, position, src, ${CREDIT_SELECT} FROM species_media`,
      speciesClauses("species_id"),
      " ORDER BY species_id, role, position",
    ),
    ...(locales.length
      ? {
          overlays: statement(
            `SELECT media_id, locale, position, ${CREDIT_SELECT} FROM species_media_overlays`,
            [
              ...mediaClauses(speciesClauses("species_id")),
              ...localeClause(locales),
            ],
            " ORDER BY locale, position",
          ),
        }
      : {}),
    lookalikes: statement(
      "SELECT species_id, lookalike_id FROM species_lookalikes",
      speciesClauses("species_id"),
      " ORDER BY species_id, position",
    ),
    slugs: statement(
      "SELECT slug, species_id FROM species_slugs",
      speciesClauses("species_id"),
      " ORDER BY slug",
    ),
  };
  const keys = Object.keys(queries) as Array<keyof CatalogRows>;
  return {
    build: (results: unknown[][]) => {
      const rows = Object.fromEntries(
        keys.map((key, index) => [key, results[index]]),
      ) as Partial<CatalogRows>;
      return buildSpeciesCatalog(
        {
          colors: rows.colors ?? [],
          faq: rows.faq ?? [],
          habitats: rows.habitats ?? [],
          items: rows.items ?? [],
          lookalikes: rows.lookalikes ?? [],
          media: rows.media ?? [],
          overlays: rows.overlays ?? [],
          slugs: rows.slugs ?? [],
          sources: rows.sources ?? [],
          species: rows.species ?? [],
          stats: rows.stats ?? [],
          texts: rows.texts ?? [],
        },
        locales,
      );
    },
    statements: keys.map((key) => queries[key]!),
  };
}

function buildSpeciesCatalog(
  {
    colors,
    faq,
    habitats,
    items,
    lookalikes,
    media,
    overlays,
    slugs,
    sources,
    species,
    stats,
    texts,
  }: CatalogRows,
  locales: readonly TranslationLocale[],
): SpeciesCatalogData {
  const textsBy = group(texts, (row) => `${row.species_id}:${row.locale}`);
  const itemsBy = group(
    items,
    (row) => `${row.species_id}:${row.locale}:${row.kind}`,
  );
  const faqBy = group(faq, (row) => `${row.species_id}:${row.locale}`);
  const statsBy = group(stats, (row) => `${row.species_id}:${row.locale}`);
  const colorsBy = group(colors, (row) => row.species_id);
  const sourcesBy = group(sources, (row) => row.species_id);
  const habitatsBy = group(habitats, (row) => row.species_id);
  const mediaBy = group(media, (row) => row.species_id);
  const mediaById = new Map(media.map((row) => [row.id, row]));
  const overlaysBy = group(
    overlays,
    (row) => `${mediaById.get(row.media_id)?.species_id}:${row.locale}`,
  );

  const catalog: SpeciesCatalogData = {
    atlasMeta: {},
    catalogIds: species.map((row) => row.id),
    idByAnySlug: Object.fromEntries(
      slugs.map((row) => [row.slug, row.species_id]),
    ),
    kaSlugById: Object.fromEntries(
      species.flatMap((row) => (row.slug_ka ? [[row.id, row.slug_ka]] : [])),
    ),
    lookalikes: {},
    slugsById: {},
    species: [],
    translations: { en: {}, ru: {}, tr: {} },
    unpublishedIds: species
      .filter((row) => row.status !== "published")
      .map((row) => row.id),
  };

  for (const row of slugs) {
    (catalog.slugsById[row.species_id] ??= []).push(row.slug);
  }

  for (const row of lookalikes) {
    (catalog.lookalikes[row.species_id] ??= []).push(row.lookalike_id);
  }

  for (const row of species) {
    const colorList = (colorsBy.get(row.id) ?? []).map((entry) => entry.color);
    const text = (locale: string) =>
      localizedText(
        row.id,
        locale,
        textsBy,
        itemsBy,
        faqBy,
        statsBy,
        colorList,
      );
    const ka = text("ka");
    const ownMedia = mediaBy.get(row.id) ?? [];
    const single = (role: MediaRow["role"]) =>
      ownMedia.find((entry) => entry.role === role);
    const hero = single("hero");
    const mobile = single("mobile");
    const audio = single("audio");

    catalog.atlasMeta[row.id] = {
      checklistStatus: row.checklist_status_id,
      class: row.taxon_class,
      featured: row.featured === 1,
      group: row.group_id,
      habitats: (habitatsBy.get(row.id) ?? []).map((entry) => entry.habitat_id),
      order: row.taxon_order,
    };
    catalog.species.push(
      compact({
        ...ka.fields,
        audio: audio
          ? compact({
              date: audio.credit_date ?? undefined,
              location: audio.credit_location ?? undefined,
              recordist: audio.credit_person ?? undefined,
              src: audio.src,
              url: audio.credit_url ?? undefined,
            })
          : undefined,
        danger: row.danger_id ?? undefined,
        family: row.family,
        gallery: ownMedia
          .filter((entry) => entry.role === "gallery")
          .map((entry) => galleryImage(entry.src, entry)),
        genus: row.genus,
        id: row.id,
        image: hero?.src,
        imageCredit: hero ? credit(hero) : undefined,
        mobileImage: mobile?.src,
        mobileImageCredit: mobile ? credit(mobile) : undefined,
        publishedAt: row.published_at,
        scientificName: row.scientific_name,
        sources: (sourcesBy.get(row.id) ?? []).map((entry) =>
          compact({ name: entry.name, url: entry.url ?? undefined }),
        ),
        updatedAt: ka.updatedAt ?? "",
      }),
    );

    for (const locale of locales) {
      const translation = text(locale);
      const own = overlaysBy.get(`${row.id}:${locale}`) ?? [];
      const overlayFor = (entry: MediaRow | undefined) =>
        entry && own.find((overlay) => overlay.media_id === entry.id);
      const heroOverlay = overlayFor(hero);
      const mobileOverlay = overlayFor(mobile);
      const gallery = own
        .filter(
          (overlay) => mediaById.get(overlay.media_id)?.role === "gallery",
        )
        .map((overlay) =>
          galleryImage(mediaById.get(overlay.media_id)!.src, overlay),
        );
      catalog.translations[locale][row.id] = compact({
        ...translation.fields,
        gallery: gallery.length > 0 ? gallery : undefined,
        imageCredit: heroOverlay ? credit(heroOverlay) : undefined,
        mobileImageCredit: mobileOverlay ? credit(mobileOverlay) : undefined,
        updatedAt: translation.updatedAt ?? undefined,
      });
    }
  }

  return catalog;
}

function compact<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  ) as T;
}

function credit(row: CreditRow): PhotoCredit | undefined {
  const value = compact({
    authorId: row.author_id ?? undefined,
    date: row.credit_date ?? undefined,
    lat: row.credit_lat ?? undefined,
    lng: row.credit_lng ?? undefined,
    location: row.credit_location ?? undefined,
    photoConfidence:
      (row.credit_photo_confidence_id as PhotoCredit["photoConfidence"]) ??
      undefined,
    photographer: row.credit_person ?? undefined,
    url: row.credit_url ?? undefined,
  });
  return Object.keys(value).length > 0 ? value : undefined;
}

function galleryImage(src: string, row: CreditRow): GalleryImage {
  return compact({
    credit: credit(row),
    photoConfidence:
      (row.photo_confidence_id as GalleryImage["photoConfidence"]) ?? undefined,
    src,
  });
}

function group<T>(list: T[], key: (row: T) => string): Localized<T> {
  const map: Localized<T> = new Map();
  for (const row of list) {
    const id = key(row);
    const bucket = map.get(id);
    if (bucket) bucket.push(row);
    else map.set(id, [row]);
  }
  return map;
}

function localizedText(
  id: string,
  locale: string,
  textsBy: Localized<TextRow>,
  itemsBy: Localized<{ text: string }>,
  faqBy: Localized<{ answer: string; question: string }>,
  statsBy: Localized<{ label: string; value: string }>,
  colors: string[],
) {
  const row = textsBy.get(`${id}:${locale}`)?.[0];
  if (!row) throw new Error(`${id} has no ${locale} text`);
  const list = (kind: string) =>
    (itemsBy.get(`${id}:${locale}:${kind}`) ?? []).map((entry) => entry.text);
  const faq = (faqBy.get(`${id}:${locale}`) ?? []).map(
    ({ answer, question }) => ({ answer, question }),
  );
  const identification: SpeciesIdentification | undefined =
    row.identification_summary === null
      ? undefined
      : compact({
          coloration: row.identification_coloration ?? undefined,
          colors: colors.length > 0 ? colors : undefined,
          summary: row.identification_summary,
          traits: list("identification_trait"),
        } as SpeciesIdentification);
  return {
    fields: compact({
      behavior: row.behavior,
      commonName: row.common_name,
      conservation: row.conservation,
      description: row.description,
      diet: row.diet,
      facts: list("fact"),
      faq: faq.length > 0 ? faq : undefined,
      habitat: row.habitat,
      identification,
      interaction: row.interaction ?? undefined,
      location: row.location,
      overview: row.overview,
      stats: (statsBy.get(`${id}:${locale}`) ?? []).map(({ label, value }) => ({
        label,
        value,
      })),
    }),
    updatedAt: row.updated_at,
  };
}

function mediaClauses(clauses: Clause[]): Clause[] {
  if (!clauses.length) return [];
  return [
    {
      sql: `media_id IN (SELECT id FROM species_media WHERE ${clauses.map((clause) => clause.sql).join(" AND ")})`,
      values: clauses.flatMap((clause) => clause.values),
    },
  ];
}
