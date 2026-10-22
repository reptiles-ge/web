CREATE TABLE species_drafts (
  id INTEGER PRIMARY KEY,
  species_id TEXT NOT NULL REFERENCES species (id) ON DELETE CASCADE,
  base_version INTEGER NOT NULL CHECK (base_version >= 1),
  source TEXT NOT NULL CHECK (source IN ('admin', 'ai', 'api')),
  actor TEXT NOT NULL CHECK (length(actor) BETWEEN 1 AND 100),
  summary TEXT NOT NULL CHECK (length(summary) BETWEEN 1 AND 500),
  record TEXT NOT NULL CHECK (json_valid(record)),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  decided_at TEXT,
  decided_by TEXT CHECK (decided_by IS NULL OR length(decided_by) BETWEEN 1 AND 100),
  CHECK ((status = 'pending') = (decided_at IS NULL)),
  CHECK ((decided_at IS NULL) = (decided_by IS NULL))
);

CREATE INDEX species_drafts_pending ON species_drafts (species_id, status, id);
