ALTER TABLE species ADD COLUMN version INTEGER NOT NULL DEFAULT 1 CHECK (version >= 1);

CREATE TABLE species_revisions (
  id INTEGER PRIMARY KEY,
  species_id TEXT NOT NULL,
  version INTEGER NOT NULL CHECK (version >= 1),
  actor TEXT NOT NULL CHECK (length(actor) BETWEEN 1 AND 100),
  source TEXT NOT NULL CHECK (source IN ('admin', 'ai', 'api')),
  summary TEXT NOT NULL CHECK (length(summary) BETWEEN 1 AND 500),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE (species_id, version)
);

CREATE INDEX species_revisions_recent ON species_revisions (species_id, version DESC);

CREATE TABLE species_import_runs (
  id INTEGER PRIMARY KEY,
  ran_at TEXT NOT NULL
);
