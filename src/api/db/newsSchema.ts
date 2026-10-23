export const NEWS_TABLES = [
  {
    columns: [
      "id",
      "status",
      "position",
      "published_at",
      "updated_at",
      "series_id",
    ],
    name: "news_articles",
  },
  {
    columns: [
      "article_id",
      "locale",
      "title",
      "dek",
      "lead",
      "meta_title",
      "meta_description",
    ],
    name: "news_texts",
  },
  {
    columns: ["article_id", "locale", "position", "heading", "blocks"],
    name: "news_sections",
  },
  {
    columns: [
      "article_id",
      "role",
      "position",
      "src",
      "width",
      "height",
      "plate",
      "from_atlas",
      "credit_person",
      "credit_location",
      "credit_date",
      "credit_lat",
      "credit_lng",
      "credit_url",
      "credit_photo_confidence_id",
    ],
    name: "news_media",
  },
  {
    columns: ["media_id", "locale", "alt"],
    name: "news_media_alts",
  },
  {
    columns: [
      "article_id",
      "position",
      "url",
      "name",
      "name_ka",
      "name_en",
      "name_ru",
      "name_tr",
    ],
    name: "news_sources",
  },
  {
    columns: ["article_id", "position", "hub_id"],
    name: "news_hubs",
  },
  {
    columns: ["article_id", "position", "region_id"],
    name: "news_regions",
  },
  {
    columns: ["article_id", "position", "species_id"],
    name: "news_species",
  },
] as const;

export type NewsTable = (typeof NEWS_TABLES)[number]["name"];
