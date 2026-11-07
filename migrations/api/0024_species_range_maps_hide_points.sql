ALTER TABLE species_range_maps ADD COLUMN hide_points INTEGER NOT NULL DEFAULT 0 CHECK (hide_points IN (0, 1));
