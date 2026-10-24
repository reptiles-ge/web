CREATE TABLE api_keys (
  id TEXT PRIMARY KEY CHECK (length(id) = 36),
  name TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 100),
  note TEXT CHECK (note IS NULL OR length(note) <= 500),
  key_prefix TEXT NOT NULL CHECK (length(key_prefix) BETWEEN 8 AND 16),
  key_hash TEXT NOT NULL UNIQUE CHECK (length(key_hash) = 64),
  created_by TEXT NOT NULL CHECK (length(created_by) BETWEEN 1 AND 100),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  expires_at TEXT,
  revoked_at TEXT,
  last_used_at TEXT
);

CREATE INDEX api_keys_created_at ON api_keys (created_at);
