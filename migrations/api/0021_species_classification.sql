CREATE TABLE checklist_statuses (
  id TEXT PRIMARY KEY
);

INSERT INTO checklist_statuses (id) VALUES ('confirmed'), ('candidate'), ('introduced');

ALTER TABLE species ADD COLUMN taxon_order TEXT CHECK (taxon_order IS NULL OR length(taxon_order) > 0);

ALTER TABLE species ADD COLUMN taxon_class TEXT CHECK (taxon_class IS NULL OR length(taxon_class) > 0);

ALTER TABLE species ADD COLUMN checklist_status_id TEXT REFERENCES checklist_statuses (id);

ALTER TABLE species ADD COLUMN featured INTEGER NOT NULL DEFAULT 0 CHECK (featured IN (0, 1));
