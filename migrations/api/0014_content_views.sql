CREATE TABLE content_view_kinds (
  id TEXT PRIMARY KEY
);

INSERT INTO content_view_kinds (id) VALUES ('species'), ('news');

CREATE TABLE content_views (
  kind TEXT NOT NULL REFERENCES content_view_kinds (id),
  target_id TEXT NOT NULL CHECK (length(target_id) BETWEEN 1 AND 120),
  day TEXT NOT NULL CHECK (length(day) = 10),
  views INTEGER NOT NULL CHECK (views >= 0),
  PRIMARY KEY (kind, target_id, day)
) WITHOUT ROWID;

CREATE TABLE content_view_salts (
  day TEXT PRIMARY KEY CHECK (length(day) = 10),
  salt TEXT NOT NULL CHECK (length(salt) = 64)
) WITHOUT ROWID;

CREATE TABLE content_view_visitors (
  day TEXT NOT NULL CHECK (length(day) = 10),
  kind TEXT NOT NULL REFERENCES content_view_kinds (id),
  target_id TEXT NOT NULL,
  visitor TEXT NOT NULL CHECK (length(visitor) = 64),
  PRIMARY KEY (day, kind, target_id, visitor)
) WITHOUT ROWID;
