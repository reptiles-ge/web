CREATE TABLE species_field_records (
  id INTEGER PRIMARY KEY,
  species_id TEXT NOT NULL REFERENCES species (id) ON DELETE CASCADE,
  position INTEGER NOT NULL CHECK (position >= 0),
  locality TEXT NOT NULL CHECK (length(locality) > 0),
  lat REAL NOT NULL CHECK (lat BETWEEN -90 AND 90),
  lng REAL NOT NULL CHECK (lng BETWEEN -180 AND 180),
  evidence TEXT CHECK (evidence IS NULL OR evidence IN ('literature', 'observation', 'specimen')),
  date TEXT,
  note TEXT,
  observer TEXT,
  observer_name TEXT,
  source TEXT,
  url TEXT,
  UNIQUE (species_id, position)
);
