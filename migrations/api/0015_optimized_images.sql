CREATE TABLE optimized_images (
  src TEXT PRIMARY KEY CHECK (length(src) > 0),
  path TEXT NOT NULL CHECK (length(path) > 0),
  width INTEGER NOT NULL CHECK (width > 0),
  height INTEGER NOT NULL CHECK (height > 0),
  widths TEXT NOT NULL CHECK (json_valid(widths) AND json_array_length(widths) > 0),
  formats TEXT NOT NULL CHECK (json_valid(formats) AND json_array_length(formats) > 0),
  created_at TEXT NOT NULL
);
