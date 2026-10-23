ALTER TABLE news_articles ADD COLUMN version INTEGER NOT NULL DEFAULT 1 CHECK (version >= 1);

CREATE TABLE news_revisions (
  id INTEGER PRIMARY KEY,
  article_id TEXT NOT NULL,
  version INTEGER NOT NULL CHECK (version >= 1),
  actor TEXT NOT NULL CHECK (length(actor) BETWEEN 1 AND 100),
  source TEXT NOT NULL CHECK (source IN ('admin', 'ai', 'api', 'import')),
  summary TEXT NOT NULL CHECK (length(summary) BETWEEN 1 AND 500),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE (article_id, version)
);

CREATE INDEX news_revisions_recent ON news_revisions (article_id, version DESC);
