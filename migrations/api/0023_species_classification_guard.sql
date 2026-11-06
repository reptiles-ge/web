ALTER TABLE animal_groups ADD COLUMN checklist INTEGER NOT NULL DEFAULT 0 CHECK (checklist IN (0, 1));

UPDATE animal_groups SET checklist = 1 WHERE id IN ('amphibian', 'lizard', 'snake', 'turtle');

CREATE INDEX species_family ON species (family);

CREATE INDEX species_taxon_order ON species (taxon_order);

CREATE TRIGGER species_classification_insert
BEFORE INSERT ON species
WHEN NEW.taxon_order IS NULL
  OR NEW.taxon_class IS NULL
  OR (NEW.checklist_status_id IS NOT NULL) != (SELECT checklist FROM animal_groups WHERE id = NEW.group_id)
BEGIN
  SELECT RAISE(ABORT, 'species needs an order and a class, and a checklist status exactly when its group is herpetofauna');
END;

CREATE TRIGGER species_classification_update
BEFORE UPDATE OF taxon_order, taxon_class, checklist_status_id, group_id ON species
WHEN NEW.taxon_order IS NULL
  OR NEW.taxon_class IS NULL
  OR (NEW.checklist_status_id IS NOT NULL) != (SELECT checklist FROM animal_groups WHERE id = NEW.group_id)
BEGIN
  SELECT RAISE(ABORT, 'species needs an order and a class, and a checklist status exactly when its group is herpetofauna');
END;
