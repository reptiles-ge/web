import { mkdirSync, writeFileSync } from "node:fs";

import type {
  CatalogCard,
  CatalogFullSpecies,
} from "@/data/speciesCatalogTypes";
import type { SpeciesFieldRecord } from "@/data/speciesTypes";

import { app } from "@/api/app";
import { readFieldRecords } from "@/api/db/fieldRecords";
import { createSpeciesTestDatabase } from "@/api/testing/sqliteDatabase";
import { routing } from "@/i18n/routing";

import {
  SPECIES_FIXTURE_DIR,
  speciesFixtureFile,
} from "../fixtures/speciesFixtureFiles";

export async function setup() {
  const database = createSpeciesTestDatabase();
  const env = {
    API_WRITE_TOKEN: "unused",
    DB: database.db,
    REVALIDATE_TOKEN: "unused",
    SITE: { fetch: async () => new Response(null, { status: 204 }) },
  };
  const catalog = async <T>(locale: string, view: string) => {
    const response = await app.request(
      `https://api.reptiles.ge/v1/catalog?view=${view}`,
      { headers: { "X-Locale": locale } },
      env,
    );
    if (!response.ok)
      throw new Error(`Catalog ${view} ${locale}: ${response.status}`);
    return ((await response.json()) as { data: T[] }).data;
  };

  mkdirSync(SPECIES_FIXTURE_DIR, { recursive: true });
  for (const locale of routing.locales) {
    const [full, cards] = await Promise.all([
      catalog<CatalogFullSpecies>(locale, "full"),
      catalog<CatalogCard>(locale, "card"),
    ]);
    const photoCounts = new Map(
      cards.map((card) => [card.id, card.photoCount]),
    );
    writeFileSync(
      speciesFixtureFile(locale),
      JSON.stringify(
        full.map((item) => ({ ...item, photoCount: photoCounts.get(item.id) })),
      ),
    );
  }

  const ids = database.sqlite
    .prepare(
      "SELECT DISTINCT species_id FROM species_field_records ORDER BY species_id",
    )
    .all() as Array<{ species_id: string }>;
  const fieldRecords: Record<string, SpeciesFieldRecord[]> = {};
  for (const { species_id: id } of ids) {
    fieldRecords[id] = await readFieldRecords(database.db, id);
  }
  writeFileSync(
    speciesFixtureFile("field-records"),
    JSON.stringify(fieldRecords),
  );
}
