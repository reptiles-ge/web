import { describe, expect, it } from "vitest";

import { type ErrorBody, requestJson } from "../testing/request";
import { createSpeciesTestDatabase } from "../testing/sqliteDatabase";

const SITE_KEY = "site-key-for-tests";

function hiddenViperDatabase() {
  const database = createSpeciesTestDatabase();
  database.sqlite.exec(
    "DELETE FROM species_field_records WHERE species_id = 'macrovipera-lebetina'",
  );
  database.sqlite
    .prepare(
      "INSERT INTO species_field_records (species_id, position, locality, lat, lng) VALUES ('macrovipera-lebetina', 0, 'Vashlovani', 41.2, 46.2)",
    )
    .run();
  database.sqlite.exec(
    "INSERT INTO species_range_maps (species_id, inaturalist_taxon_id, hide_points) VALUES ('macrovipera-lebetina', 1, 1) ON CONFLICT (species_id) DO UPDATE SET hide_points = 1",
  );
  return { DB: database.db, SITE_API_KEY: SITE_KEY };
}

describe("GET /v1/site/species/:slug/field-records", () => {
  it("gives the site every record, also of a species whose map hides points", async () => {
    const { body, response } = await requestJson<{
      data: unknown[];
      id: string;
      total: number;
    }>("/v1/site/species/giurza/field-records", hiddenViperDatabase(), {
      headers: { "X-Api-Key": SITE_KEY },
    });
    expect(response.status).toBe(200);
    expect(body).toEqual({
      data: [{ lat: 41.2, lng: 46.2, locality: "Vashlovani" }],
      id: "macrovipera-lebetina",
      total: 1,
    });
  });

  it("refuses any caller without the site key", async () => {
    const env = hiddenViperDatabase();
    for (const headers of [{}, { "X-Api-Key": "rk_someone-else" }] as Record<
      string,
      string
    >[]) {
      const { body, response } = await requestJson<ErrorBody>(
        "/v1/site/species/giurza/field-records",
        env,
        { headers },
      );
      expect(response.status).toBe(401);
      expect(body.error.code).toBe("unauthorized");
    }
  });

  it("answers 404 for a species the API does not publish", async () => {
    const { response } = await requestJson<ErrorBody>(
      "/v1/site/species/dolichophis-caspius/field-records",
      hiddenViperDatabase(),
      { headers: { "X-Api-Key": SITE_KEY } },
    );
    expect(response.status).toBe(404);
  });
});
