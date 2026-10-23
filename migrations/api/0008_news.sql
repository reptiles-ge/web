CREATE TABLE news_series (
  id TEXT PRIMARY KEY
);

INSERT INTO news_series (id) VALUES ('batumi-raptor-count-2026'), ('caucasus-leopards'), ('rioni-sturgeon');

CREATE TABLE news_articles (
  id TEXT PRIMARY KEY CHECK (id GLOB '[a-z0-9]*' AND id NOT GLOB '*[^a-z0-9-]*' AND id NOT GLOB '*--*' AND id NOT GLOB '*-' AND id GLOB '*[a-z]*' AND id != 'page'),
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')),
  position INTEGER NOT NULL UNIQUE CHECK (position >= 0),
  published_at TEXT NOT NULL CHECK (length(published_at) > 0),
  updated_at TEXT,
  series_id TEXT REFERENCES news_series (id)
);

CREATE INDEX news_articles_published ON news_articles (status, published_at DESC, position);

CREATE INDEX news_articles_series ON news_articles (series_id);

CREATE TABLE news_texts (
  article_id TEXT NOT NULL REFERENCES news_articles (id) ON DELETE CASCADE,
  locale TEXT NOT NULL REFERENCES locales (code),
  title TEXT NOT NULL CHECK (length(title) > 0),
  dek TEXT NOT NULL CHECK (length(dek) > 0),
  lead TEXT NOT NULL CHECK (length(lead) > 0),
  meta_title TEXT NOT NULL CHECK (length(meta_title) > 0),
  meta_description TEXT NOT NULL CHECK (length(meta_description) > 0),
  PRIMARY KEY (article_id, locale)
);

CREATE TABLE news_sections (
  article_id TEXT NOT NULL,
  locale TEXT NOT NULL,
  position INTEGER NOT NULL CHECK (position >= 0),
  heading TEXT NOT NULL,
  blocks TEXT NOT NULL CHECK (json_valid(blocks) AND json_type(blocks) = 'array'),
  PRIMARY KEY (article_id, locale, position),
  FOREIGN KEY (article_id, locale) REFERENCES news_texts (article_id, locale) ON DELETE CASCADE
);

CREATE TABLE news_media (
  id INTEGER PRIMARY KEY,
  article_id TEXT NOT NULL REFERENCES news_articles (id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('cover', 'gallery')),
  position INTEGER NOT NULL CHECK (position >= 0),
  src TEXT NOT NULL CHECK (length(src) > 0),
  width INTEGER CHECK (width IS NULL OR width > 0),
  height INTEGER CHECK (height IS NULL OR height > 0),
  plate INTEGER CHECK (plate IS NULL OR plate IN (0, 1)),
  from_atlas INTEGER CHECK (from_atlas IS NULL OR from_atlas IN (0, 1)),
  credit_person TEXT,
  credit_location TEXT,
  credit_date TEXT,
  credit_lat REAL CHECK (credit_lat IS NULL OR credit_lat BETWEEN -90 AND 90),
  credit_lng REAL CHECK (credit_lng IS NULL OR credit_lng BETWEEN -180 AND 180),
  credit_url TEXT,
  credit_photo_confidence_id TEXT REFERENCES photo_confidences (id),
  author_id TEXT REFERENCES authors (id) ON DELETE SET NULL,
  UNIQUE (article_id, role, position),
  CHECK (role = 'gallery' OR position = 0),
  CHECK ((credit_lat IS NULL) = (credit_lng IS NULL))
);

CREATE UNIQUE INDEX news_media_gallery_src ON news_media (article_id, src) WHERE role = 'gallery';

CREATE INDEX news_media_author ON news_media (author_id);

CREATE TABLE news_media_alts (
  media_id INTEGER NOT NULL REFERENCES news_media (id) ON DELETE CASCADE,
  locale TEXT NOT NULL REFERENCES locales (code),
  alt TEXT NOT NULL CHECK (length(alt) > 0),
  PRIMARY KEY (media_id, locale)
);

CREATE TABLE news_sources (
  article_id TEXT NOT NULL REFERENCES news_articles (id) ON DELETE CASCADE,
  position INTEGER NOT NULL CHECK (position >= 0),
  url TEXT NOT NULL CHECK (length(url) > 0),
  name TEXT CHECK (name IS NULL OR length(name) > 0),
  name_ka TEXT,
  name_en TEXT,
  name_ru TEXT,
  name_tr TEXT,
  PRIMARY KEY (article_id, position),
  CHECK (
    (name IS NOT NULL AND name_ka IS NULL AND name_en IS NULL AND name_ru IS NULL AND name_tr IS NULL)
    OR (name IS NULL AND length(name_ka) > 0 AND length(name_en) > 0 AND length(name_ru) > 0 AND length(name_tr) > 0)
  )
);

CREATE TABLE news_hubs (
  article_id TEXT NOT NULL REFERENCES news_articles (id) ON DELETE CASCADE,
  position INTEGER NOT NULL CHECK (position >= 0),
  hub_id TEXT NOT NULL CHECK (length(hub_id) > 0),
  PRIMARY KEY (article_id, position),
  UNIQUE (article_id, hub_id)
);

CREATE INDEX news_hubs_hub ON news_hubs (hub_id);

CREATE TABLE news_regions (
  article_id TEXT NOT NULL REFERENCES news_articles (id) ON DELETE CASCADE,
  position INTEGER NOT NULL CHECK (position >= 0),
  region_id TEXT NOT NULL CHECK (length(region_id) > 0),
  PRIMARY KEY (article_id, position),
  UNIQUE (article_id, region_id)
);

CREATE INDEX news_regions_region ON news_regions (region_id);

CREATE TABLE news_species (
  article_id TEXT NOT NULL REFERENCES news_articles (id) ON DELETE CASCADE,
  position INTEGER NOT NULL CHECK (position >= 0),
  species_id TEXT NOT NULL REFERENCES species (id),
  PRIMARY KEY (article_id, position),
  UNIQUE (article_id, species_id)
);

CREATE INDEX news_species_species ON news_species (species_id);

CREATE TABLE news_import_runs (
  id INTEGER PRIMARY KEY,
  ran_at TEXT NOT NULL
);
