CREATE TABLE image_manifest (
  key TEXT PRIMARY KEY CHECK (length(key) > 0),
  src TEXT NOT NULL CHECK (length(src) > 0),
  entry TEXT NOT NULL CHECK (json_valid(entry)),
  updated_at TEXT NOT NULL
);

CREATE TABLE schema_image_crops (
  src TEXT NOT NULL CHECK (length(src) > 0),
  ratio TEXT NOT NULL CHECK (ratio IN ('16x9', '4x3', '1x1')),
  url TEXT NOT NULL CHECK (length(url) > 0),
  width INTEGER NOT NULL CHECK (width > 0),
  height INTEGER NOT NULL CHECK (height > 0),
  updated_at TEXT NOT NULL,
  PRIMARY KEY (src, ratio)
);
