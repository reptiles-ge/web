CREATE TABLE traffic_sources_by_country (
  day TEXT NOT NULL CHECK (length(day) = 10),
  source TEXT NOT NULL CHECK (length(source) BETWEEN 1 AND 40),
  referrer TEXT NOT NULL CHECK (length(referrer) <= 253),
  path TEXT NOT NULL CHECK (length(path) BETWEEN 1 AND 200),
  locale TEXT NOT NULL CHECK (locale IN ('ka', 'en', 'ru', 'tr')),
  country TEXT NOT NULL DEFAULT '' CHECK (country = '' OR (length(country) = 2 AND country GLOB '[A-Z][A-Z]')),
  visits INTEGER NOT NULL CHECK (visits >= 0),
  PRIMARY KEY (day, source, referrer, path, locale, country)
) WITHOUT ROWID;

INSERT INTO traffic_sources_by_country (day, source, referrer, path, locale, country, visits)
SELECT day, source, referrer, path, locale, '', visits FROM traffic_sources;

DROP TABLE traffic_sources;

ALTER TABLE traffic_sources_by_country RENAME TO traffic_sources;

CREATE INDEX traffic_sources_day ON traffic_sources (day);
