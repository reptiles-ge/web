import path from "node:path";

export const SPECIES_FIXTURE_DIR = path.resolve(
  import.meta.dirname,
  "../../node_modules/.cache/reptiles-tests",
);

export function speciesFixtureFile(name: string) {
  return path.join(SPECIES_FIXTURE_DIR, `species-${name}.json`);
}
