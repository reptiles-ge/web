CREATE TABLE locales (
  code TEXT PRIMARY KEY,
  position INTEGER NOT NULL UNIQUE
);

INSERT INTO locales (code, position) VALUES ('ka', 1), ('en', 2), ('ru', 3), ('tr', 4);

CREATE TABLE animal_groups (
  id TEXT PRIMARY KEY,
  position INTEGER NOT NULL UNIQUE
);

INSERT INTO animal_groups (id, position) VALUES
  ('snake', 1),
  ('lizard', 2),
  ('turtle', 3),
  ('amphibian', 4),
  ('bird', 5),
  ('mammal', 6),
  ('spider', 7),
  ('scorpion', 8),
  ('insect', 9);

CREATE TABLE habitats (
  id TEXT PRIMARY KEY
);

INSERT INTO habitats (id) VALUES ('forest'), ('grassland'), ('mountain'), ('wetland');

CREATE TABLE danger_levels (
  id TEXT PRIMARY KEY,
  rank INTEGER NOT NULL UNIQUE
);

INSERT INTO danger_levels (id, rank) VALUES ('Harmless', 1), ('Moderate', 2), ('High', 3);

CREATE TABLE photo_confidences (
  id TEXT PRIMARY KEY
);

INSERT INTO photo_confidences (id) VALUES ('georgia-field'), ('range-typical'), ('placeholder');

CREATE TABLE species (
  id TEXT PRIMARY KEY CHECK (id GLOB '[a-z]*' AND id NOT GLOB '*[^a-z0-9-]*'),
  scientific_name TEXT NOT NULL CHECK (length(scientific_name) > 0),
  genus TEXT NOT NULL,
  family TEXT NOT NULL,
  group_id TEXT NOT NULL REFERENCES animal_groups (id),
  danger_id TEXT REFERENCES danger_levels (id),
  status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'unpublished')),
  catalog_position INTEGER NOT NULL UNIQUE,
  slug_ka TEXT UNIQUE,
  published_at TEXT NOT NULL,
  CHECK (status != 'published' OR slug_ka IS NOT NULL)
);

CREATE INDEX species_group ON species (group_id, catalog_position);

CREATE TABLE species_texts (
  species_id TEXT NOT NULL REFERENCES species (id) ON DELETE CASCADE,
  locale TEXT NOT NULL REFERENCES locales (code),
  common_name TEXT NOT NULL CHECK (length(common_name) > 0),
  overview TEXT NOT NULL,
  description TEXT NOT NULL,
  habitat TEXT NOT NULL,
  diet TEXT NOT NULL,
  behavior TEXT NOT NULL,
  conservation TEXT NOT NULL,
  location TEXT NOT NULL,
  interaction TEXT,
  identification_summary TEXT,
  identification_coloration TEXT,
  updated_at TEXT,
  PRIMARY KEY (species_id, locale)
);

CREATE TABLE species_list_items (
  species_id TEXT NOT NULL REFERENCES species (id) ON DELETE CASCADE,
  locale TEXT NOT NULL REFERENCES locales (code),
  kind TEXT NOT NULL CHECK (kind IN ('fact', 'identification_trait')),
  position INTEGER NOT NULL CHECK (position >= 0),
  text TEXT NOT NULL,
  PRIMARY KEY (species_id, locale, kind, position)
);

CREATE TABLE species_faq (
  species_id TEXT NOT NULL REFERENCES species (id) ON DELETE CASCADE,
  locale TEXT NOT NULL REFERENCES locales (code),
  position INTEGER NOT NULL CHECK (position >= 0),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  PRIMARY KEY (species_id, locale, position)
);

CREATE TABLE species_stats (
  species_id TEXT NOT NULL REFERENCES species (id) ON DELETE CASCADE,
  locale TEXT NOT NULL REFERENCES locales (code),
  position INTEGER NOT NULL CHECK (position >= 0),
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  PRIMARY KEY (species_id, locale, position)
);

CREATE TABLE species_identification_colors (
  species_id TEXT NOT NULL REFERENCES species (id) ON DELETE CASCADE,
  position INTEGER NOT NULL CHECK (position >= 0),
  color TEXT NOT NULL,
  PRIMARY KEY (species_id, position)
);

CREATE TABLE species_sources (
  species_id TEXT NOT NULL REFERENCES species (id) ON DELETE CASCADE,
  position INTEGER NOT NULL CHECK (position >= 0),
  name TEXT NOT NULL,
  url TEXT,
  PRIMARY KEY (species_id, position)
);

CREATE TABLE species_habitats (
  species_id TEXT NOT NULL REFERENCES species (id) ON DELETE CASCADE,
  habitat_id TEXT NOT NULL REFERENCES habitats (id),
  position INTEGER NOT NULL CHECK (position >= 0),
  PRIMARY KEY (species_id, habitat_id),
  UNIQUE (species_id, position)
);

CREATE TABLE species_lookalikes (
  species_id TEXT NOT NULL REFERENCES species (id) ON DELETE CASCADE,
  lookalike_id TEXT NOT NULL REFERENCES species (id) ON DELETE CASCADE,
  position INTEGER NOT NULL CHECK (position >= 0),
  PRIMARY KEY (species_id, lookalike_id),
  UNIQUE (species_id, position),
  CHECK (species_id != lookalike_id)
);

CREATE INDEX species_lookalikes_reverse ON species_lookalikes (lookalike_id);

CREATE TABLE species_slugs (
  slug TEXT PRIMARY KEY,
  species_id TEXT NOT NULL REFERENCES species (id) ON DELETE CASCADE
);

CREATE INDEX species_slugs_species ON species_slugs (species_id);

CREATE TABLE species_media (
  id INTEGER PRIMARY KEY,
  species_id TEXT NOT NULL REFERENCES species (id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('hero', 'mobile', 'gallery', 'audio')),
  position INTEGER NOT NULL CHECK (position >= 0),
  src TEXT NOT NULL CHECK (length(src) > 0),
  photo_confidence_id TEXT REFERENCES photo_confidences (id),
  credit_person TEXT,
  credit_location TEXT,
  credit_date TEXT,
  credit_lat REAL CHECK (credit_lat IS NULL OR credit_lat BETWEEN -90 AND 90),
  credit_lng REAL CHECK (credit_lng IS NULL OR credit_lng BETWEEN -180 AND 180),
  credit_url TEXT,
  credit_photo_confidence_id TEXT REFERENCES photo_confidences (id),
  UNIQUE (species_id, role, position),
  CHECK (role = 'gallery' OR position = 0)
);

CREATE UNIQUE INDEX species_media_gallery_src ON species_media (species_id, src) WHERE role = 'gallery';

CREATE TABLE species_media_overlays (
  media_id INTEGER NOT NULL REFERENCES species_media (id) ON DELETE CASCADE,
  locale TEXT NOT NULL REFERENCES locales (code),
  position INTEGER NOT NULL CHECK (position >= 0),
  photo_confidence_id TEXT REFERENCES photo_confidences (id),
  credit_person TEXT,
  credit_location TEXT,
  credit_date TEXT,
  credit_lat REAL CHECK (credit_lat IS NULL OR credit_lat BETWEEN -90 AND 90),
  credit_lng REAL CHECK (credit_lng IS NULL OR credit_lng BETWEEN -180 AND 180),
  credit_url TEXT,
  credit_photo_confidence_id TEXT REFERENCES photo_confidences (id),
  PRIMARY KEY (media_id, locale),
  CHECK (locale != 'ka')
);
