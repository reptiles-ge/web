import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/adminAccess", () => ({
  isLocalAdminEnabled: () => true,
  localAdminForbiddenResponse: () => new Response(null, { status: 403 }),
}));

import { POST } from "@/app/api/admin/species-drafts/route.local";
import {
  listAdminSpeciesDrafts,
  proposeAdminSpeciesDraft,
  readAdminSpecies,
} from "@/lib/adminSpeciesApi";

import {
  REPTILES_API_TEST_TOKEN,
  reptilesApi,
  resetReptilesApi,
} from "../../../../../tests/msw/reptilesApi";
import { server } from "../../../../../tests/msw/server";

const ID = "testudo-graeca";

function decide(body: Record<string, unknown>) {
  return POST(
    new Request("http://localhost/api/admin/species-drafts", {
      body: JSON.stringify({ id: ID, ...body }),
      headers: { origin: "http://localhost" },
      method: "POST",
    }),
  );
}

async function draft(overview: string) {
  const { record, version } = await readAdminSpecies(ID);
  record.base.overview = overview;
  return (
    await proposeAdminSpeciesDraft(ID, {
      baseVersion: version,
      record,
      summary: "Test draft",
    })
  ).draftId;
}

beforeEach(() => {
  resetReptilesApi();
  server.use(reptilesApi);
  vi.stubEnv("API_WRITE_TOKEN", REPTILES_API_TEST_TOKEN);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("local admin draft decisions", () => {
  it("approves a draft into the live record", async () => {
    const draftId = await draft("approved text");
    const response = await decide({ decision: "approve", draftId });
    expect(await response.json()).toEqual({ status: "approved", version: 2 });
    expect((await readAdminSpecies(ID)).record.base.overview).toBe(
      "approved text",
    );
  });

  it("rejects a draft", async () => {
    const draftId = await draft("rejected text");
    const response = await decide({ decision: "reject", draftId });
    expect(await response.json()).toEqual({ status: "rejected" });
    expect(await listAdminSpeciesDrafts(ID)).toEqual([]);
  });

  it("validates the request and passes API errors through", async () => {
    expect((await decide({ decision: "approve", draftId: 0 })).status).toBe(
      400,
    );
    expect((await decide({ decision: "merge", draftId: 1 })).status).toBe(400);
    expect(
      (await decide({ decision: "approve", draftId: 1, id: "Bad Id" })).status,
    ).toBe(400);
    const missing = await decide({ decision: "approve", draftId: 999 });
    expect(await missing.json()).toEqual({ error: "Draft not found" });
  });
});
