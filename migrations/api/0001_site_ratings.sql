CREATE TABLE site_ratings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  path TEXT NOT NULL CHECK (length(path) BETWEEN 1 AND 300),
  locale TEXT NOT NULL CHECK (locale IN ('ka', 'en', 'ru', 'tr')),
  feedback TEXT CHECK (feedback IS NULL OR length(feedback) <= 1000),
  country TEXT CHECK (country IS NULL OR length(country) = 2),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX site_ratings_created_at ON site_ratings (created_at);
