CREATE TABLE author_kinds (
  id TEXT PRIMARY KEY
);

INSERT INTO author_kinds (id) VALUES ('page'), ('person');

CREATE TABLE author_roles (
  id TEXT PRIMARY KEY
);

INSERT INTO author_roles (id) VALUES ('herpetologist'), ('photographer'), ('professor'), ('ranger'), ('researcher');

CREATE TABLE author_job_titles (
  id TEXT PRIMARY KEY
);

INSERT INTO author_job_titles (id) VALUES ('director'), ('professor'), ('ranger'), ('researcher');

CREATE TABLE affiliations (
  id TEXT PRIMARY KEY
);

INSERT INTO affiliations (id) VALUES
  ('borjomi-kharagauli-national-park'),
  ('connecticut-college'),
  ('georgian-society-of-nature-friends'),
  ('ilia-state-university'),
  ('institute-of-zoology'),
  ('naturehistorium');

CREATE TABLE authors (
  id TEXT PRIMARY KEY CHECK (id GLOB '[a-z0-9]*' AND id NOT GLOB '*[^a-z0-9-]*'),
  kind_id TEXT NOT NULL DEFAULT 'person' REFERENCES author_kinds (id),
  role_id TEXT REFERENCES author_roles (id),
  job_title_id TEXT REFERENCES author_job_titles (id),
  is_contributor INTEGER NOT NULL DEFAULT 0 CHECK (is_contributor IN (0, 1)),
  portrait_src TEXT CHECK (portrait_src IS NULL OR length(portrait_src) > 0),
  portrait_class TEXT,
  facebook_url TEXT,
  inaturalist_url TEXT,
  instagram_url TEXT,
  research_gate_url TEXT,
  CHECK (is_contributor = 0 OR (role_id IS NOT NULL AND portrait_src IS NOT NULL))
);

CREATE INDEX authors_contributor ON authors (is_contributor);

CREATE TABLE author_texts (
  author_id TEXT NOT NULL REFERENCES authors (id) ON DELETE CASCADE,
  locale TEXT NOT NULL REFERENCES locales (code),
  name TEXT NOT NULL CHECK (length(name) > 0),
  bio TEXT,
  meta_description TEXT,
  PRIMARY KEY (author_id, locale)
);

CREATE TABLE author_aliases (
  alias TEXT PRIMARY KEY CHECK (length(alias) > 0),
  author_id TEXT NOT NULL REFERENCES authors (id) ON DELETE CASCADE
);

CREATE INDEX author_aliases_author ON author_aliases (author_id);

CREATE TABLE author_affiliations (
  author_id TEXT NOT NULL REFERENCES authors (id) ON DELETE CASCADE,
  affiliation_id TEXT NOT NULL REFERENCES affiliations (id),
  position INTEGER NOT NULL CHECK (position >= 0),
  PRIMARY KEY (author_id, affiliation_id),
  UNIQUE (author_id, position)
);

ALTER TABLE species_media ADD COLUMN author_id TEXT REFERENCES authors (id) ON DELETE SET NULL;

ALTER TABLE species_media_overlays ADD COLUMN author_id TEXT REFERENCES authors (id) ON DELETE SET NULL;

CREATE INDEX species_media_author ON species_media (author_id);

CREATE INDEX species_media_overlays_author ON species_media_overlays (author_id);
