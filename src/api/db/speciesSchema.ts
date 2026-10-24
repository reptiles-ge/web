const CREDIT_COLUMNS = [
  "credit_person",
  "credit_location",
  "credit_date",
  "credit_lat",
  "credit_lng",
  "credit_url",
  "credit_photo_confidence_id",
] as const;

export const RANGE_MAP_TEXT_COLUMNS = [
  "range_title",
  "intro",
  "map_aria",
  "official_region_label",
  "regions_metric_label",
  "confirmed_status_label",
] as const;

export const RANGE_MAP_TEXT_KEYS = [
  "rangeTitle",
  "intro",
  "mapAria",
  "officialRegionLabel",
  "regionsMetricLabel",
  "confirmedStatusLabel",
] as const;

export const SPECIES_TABLES = [
  {
    columns: [
      "id",
      "scientific_name",
      "genus",
      "family",
      "group_id",
      "danger_id",
      "status",
      "catalog_position",
      "slug_ka",
      "published_at",
    ],
    name: "species",
  },
  {
    columns: [
      "species_id",
      "locale",
      "common_name",
      "overview",
      "description",
      "habitat",
      "diet",
      "behavior",
      "conservation",
      "location",
      "interaction",
      "identification_summary",
      "identification_coloration",
      "updated_at",
    ],
    name: "species_texts",
  },
  {
    columns: ["species_id", "locale", "kind", "position", "text"],
    name: "species_list_items",
  },
  {
    columns: ["species_id", "locale", "position", "question", "answer"],
    name: "species_faq",
  },
  {
    columns: ["species_id", "locale", "position", "label", "value"],
    name: "species_stats",
  },
  {
    columns: ["species_id", "position", "color"],
    name: "species_identification_colors",
  },
  {
    columns: ["species_id", "position", "name", "url"],
    name: "species_sources",
  },
  {
    columns: ["species_id", "habitat_id", "position"],
    name: "species_habitats",
  },
  {
    columns: [
      "species_id",
      "role",
      "position",
      "src",
      "photo_confidence_id",
      ...CREDIT_COLUMNS,
    ],
    name: "species_media",
  },
  {
    columns: [
      "media_id",
      "locale",
      "position",
      "photo_confidence_id",
      ...CREDIT_COLUMNS,
    ],
    name: "species_media_overlays",
  },
  {
    columns: ["species_id", "lookalike_id", "position"],
    name: "species_lookalikes",
  },
  {
    columns: ["slug", "species_id"],
    name: "species_slugs",
  },
  {
    columns: [
      "species_id",
      "inaturalist_taxon_id",
      "range_source",
      "confirmed_threshold",
    ],
    name: "species_range_maps",
  },
  {
    columns: ["species_id", "locale", ...RANGE_MAP_TEXT_COLUMNS],
    name: "species_range_map_texts",
  },
] as const;

export type SpeciesTable = (typeof SPECIES_TABLES)[number]["name"];
