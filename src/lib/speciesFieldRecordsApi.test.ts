import { http, HttpResponse } from "msw";
import fs from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { SpeciesFieldRecord } from "@/data/speciesTypes";

import { recordRequests, server } from "../../tests/msw/server";
import { getSpeciesFieldRecords } from "./speciesFieldRecordsApi";

const compiled = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), "src/data/fieldRecords.generated.json"),
    "utf8",
  ),
) as Record<string, SpeciesFieldRecord[]>;

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getSpeciesFieldRecords", () => {
  it("loads the field records of a species by id", async () => {
    const requests = recordRequests();
    const records = await getSpeciesFieldRecords("natrix-natrix");
    requests.stop();
    expect(requests.urls).toEqual([
      "https://api.reptiles.ge/v1/species/natrix-natrix/field-records",
    ]);
    expect(records).toStrictEqual(compiled["natrix-natrix"]);
  });

  it("returns no records for a species without any", async () => {
    expect(await getSpeciesFieldRecords("bubo-bubo")).toEqual([]);
  });

  it("returns no records for a species the API does not publish", async () => {
    expect(await getSpeciesFieldRecords("dolichophis-caspius")).toEqual([]);
  });

  it("sends the cache bypass secret when it is configured", async () => {
    const seen: Array<null | string> = [];
    server.use(
      http.get(
        "https://api.reptiles.ge/v1/species/:slug/field-records",
        ({ request }) => {
          seen.push(request.headers.get("X-Cache-Bypass"));
          return HttpResponse.json({ data: [], id: "a", total: 0 });
        },
      ),
    );
    await getSpeciesFieldRecords("natrix-natrix");
    vi.stubEnv("REVALIDATE_TOKEN", "fresh-secret");
    await getSpeciesFieldRecords("natrix-natrix");
    expect(seen).toEqual([null, "fresh-secret"]);
  });

  it("fails loudly when the API errors", async () => {
    server.use(
      http.get("https://api.reptiles.ge/v1/species/:slug/field-records", () =>
        HttpResponse.json(
          { error: { code: "internal_error" } },
          { status: 500 },
        ),
      ),
    );
    await expect(getSpeciesFieldRecords("natrix-natrix")).rejects.toThrow(
      "Species API answered 500 for natrix-natrix field records",
    );
  });
});
