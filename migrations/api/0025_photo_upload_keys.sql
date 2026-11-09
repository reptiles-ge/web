CREATE TABLE photo_upload_keys (
  key TEXT PRIMARY KEY CHECK (length(key) > 0),
  created_at TEXT NOT NULL
);
