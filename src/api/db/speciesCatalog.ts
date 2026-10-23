import type { AnimalGroup, HabitatTag } from "@/data/speciesAtlasMeta";
import type {
  DangerLevel,
  GalleryImage,
  PhotoCredit,
  Species,
  SpeciesIdentification,
  SpeciesTranslation,
} from "@/data/speciesTypes";

import type { ApiDatabase } from "./database";
import type { TranslationLocale } from "./speciesRows";

export type SpeciesCatalogData = {
  atlasMeta: Record<string, { group: AnimalGroup; habitats: HabitatTag[] }>;
  catalogIds: string[];
  idByAnySlug: Record<string, string>;
  kaSlugById: Record<string, string>;
  lookalikes: Record<string, string[]>;
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

type SpeciesRow = {
  danger_id: DangerLevel | null;
  family: string;
  genus: string;
  group_id: AnimalGroup;
  id: string;
  published_at: string;
  scientific_name: string;
  slug_ka: null | string;
  status: string;
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

export async function readSpeciesCatalog(
  db: ApiDatabase,
  speciesId?: string,
): Promise<SpeciesCatalogData> {
  const where = (column: string) => (speciesId ? ` WHERE ${column} = ?` : "");
  const statement = (query: string) =>
    speciesId ? db.prepare(query).bind(speciesId) : db.prepare(query);
  const [
    species,
    texts,
    items,
    faq,
    stats,
    colors,
    sources,
    habitats,
    media,
    overlays,
    lookalikes,
    slugs,
  ] = (
    await db.batch([
      statement(
        `SELECT id, scientific_name, genus, family, group_id, danger_id, status, slug_ka, published_at FROM species${where("id")} ORDER BY catalog_position`,
      ),
      statement(
        `SELECT species_id, locale, common_name, overview, description, habitat, diet, behavior, conservation, location, interaction, identification_summary, identification_coloration, updated_at FROM species_texts${where("species_id")}`,
      ),
      statement(
        `SELECT species_id, locale, kind, text FROM species_list_items${where("species_id")} ORDER BY species_id, locale, kind, position`,
      ),
      statement(
        `SELECT species_id, locale, question, answer FROM species_faq${where("species_id")} ORDER BY species_id, locale, position`,
      ),
      statement(
        `SELECT species_id, locale, label, value FROM species_stats${where("species_id")} ORDER BY species_id, locale, position`,
      ),
      statement(
        `SELECT species_id, color FROM species_identification_colors${where("species_id")} ORDER BY species_id, position`,
      ),
      statement(
        `SELECT species_id, name, url FROM species_sources${where("species_id")} ORDER BY species_id, position`,
      ),
      statement(
        `SELECT species_id, habitat_id FROM species_habitats${where("species_id")} ORDER BY species_id, position`,
      ),
      statement(
        `SELECT id, species_id, role, position, src, ${CREDIT_SELECT} FROM species_media${where("species_id")} ORDER BY species_id, role, position`,
      ),
      statement(
        `SELECT media_id, locale, position, ${CREDIT_SELECT} FROM species_media_overlays${speciesId ? " WHERE media_id IN (SELECT id FROM species_media WHERE species_id = ?)" : ""} ORDER BY locale, position`,
      ),
      statement(
        `SELECT species_id, lookalike_id FROM species_lookalikes${where("species_id")} ORDER BY species_id, position`,
      ),
      statement(
        `SELECT slug, species_id FROM species_slugs${where("species_id")} ORDER BY slug`,
      ),
    ])
  ).map((result) => result.results) as [
    SpeciesRow[],
    TextRow[],
    Array<{ kind: string; locale: string; species_id: string; text: string }>,
    Array<{
      answer: string;
      locale: string;
      question: string;
      species_id: string;
    }>,
    Array<{ label: string; locale: string; species_id: string; value: string }>,
    Array<{ color: string; species_id: string }>,
    Array<{ name: string; species_id: string; url: null | string }>,
    Array<{ habitat_id: HabitatTag; species_id: string }>,
    MediaRow[],
    OverlayRow[],
    Array<{ lookalike_id: string; species_id: string }>,
    Array<{ slug: string; species_id: string }>,
  ];

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
    species: [],
    translations: { en: {}, ru: {}, tr: {} },
    unpublishedIds: species
      .filter((row) => row.status === "unpublished")
      .map((row) => row.id),
  };

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
    if (!hero) throw new Error(`${row.id} has no hero image`);

    catalog.atlasMeta[row.id] = {
      group: row.group_id,
      habitats: (habitatsBy.get(row.id) ?? []).map((entry) => entry.habitat_id),
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
        image: hero.src,
        imageCredit: credit(hero),
        mobileImage: mobile?.src,
        mobileImageCredit: mobile ? credit(mobile) : undefined,
        publishedAt: row.published_at,
        scientificName: row.scientific_name,
        sources: (sourcesBy.get(row.id) ?? []).map((entry) =>
          compact({ name: entry.name, url: entry.url ?? undefined }),
        ),
        updatedAt: ka.updatedAt ?? "",
      }) as Species,
    );

    for (const locale of ["en", "ru", "tr"] as const) {
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
      }) as SpeciesTranslation;
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
