CREATE TABLE species_range_maps (
  species_id TEXT PRIMARY KEY REFERENCES species (id) ON DELETE CASCADE,
  inaturalist_taxon_id INTEGER NOT NULL CHECK (inaturalist_taxon_id > 0),
  range_source TEXT CHECK (range_source IS NULL OR range_source IN ('map-regions', 'record-summary')),
  confirmed_threshold INTEGER CHECK (confirmed_threshold IS NULL OR confirmed_threshold >= 1)
);

CREATE TABLE species_range_map_texts (
  species_id TEXT NOT NULL REFERENCES species_range_maps (species_id) ON DELETE CASCADE,
  locale TEXT NOT NULL REFERENCES locales (code),
  range_title TEXT CHECK (range_title IS NULL OR length(range_title) > 0),
  intro TEXT CHECK (intro IS NULL OR length(intro) > 0),
  map_aria TEXT CHECK (map_aria IS NULL OR length(map_aria) > 0),
  official_region_label TEXT CHECK (official_region_label IS NULL OR length(official_region_label) > 0),
  regions_metric_label TEXT CHECK (regions_metric_label IS NULL OR length(regions_metric_label) > 0),
  confirmed_status_label TEXT CHECK (confirmed_status_label IS NULL OR length(confirmed_status_label) > 0),
  PRIMARY KEY (species_id, locale)
);
