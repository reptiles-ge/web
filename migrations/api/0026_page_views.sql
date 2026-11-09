CREATE TABLE page_views (
  path TEXT NOT NULL CHECK (length(path) BETWEEN 1 AND 200),
  locale TEXT NOT NULL CHECK (locale IN ('ka', 'en', 'ru', 'tr')),
  day TEXT NOT NULL CHECK (length(day) = 10),
  views INTEGER NOT NULL CHECK (views >= 0),
  PRIMARY KEY (path, locale, day)
) WITHOUT ROWID;

CREATE INDEX page_views_day ON page_views (day);

CREATE TABLE page_view_visitors (
  day TEXT NOT NULL CHECK (length(day) = 10),
  path TEXT NOT NULL,
  visitor TEXT NOT NULL CHECK (length(visitor) = 64),
  PRIMARY KEY (day, path, visitor)
) WITHOUT ROWID;

CREATE TABLE traffic_sources (
  day TEXT NOT NULL CHECK (length(day) = 10),
  source TEXT NOT NULL CHECK (length(source) BETWEEN 1 AND 40),
  referrer TEXT NOT NULL CHECK (length(referrer) <= 253),
  path TEXT NOT NULL CHECK (length(path) BETWEEN 1 AND 200),
  locale TEXT NOT NULL CHECK (locale IN ('ka', 'en', 'ru', 'tr')),
  visits INTEGER NOT NULL CHECK (visits >= 0),
  PRIMARY KEY (day, source, referrer, path, locale)
) WITHOUT ROWID;

CREATE TABLE traffic_source_visitors (
  day TEXT NOT NULL CHECK (length(day) = 10),
  source TEXT NOT NULL,
  visitor TEXT NOT NULL CHECK (length(visitor) = 64),
  PRIMARY KEY (day, source, visitor)
) WITHOUT ROWID;
