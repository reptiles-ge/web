CREATE TABLE api_cache_generation (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  generation INTEGER NOT NULL CHECK (generation >= 0)
);

INSERT INTO api_cache_generation (id, generation) VALUES (1, 0);
