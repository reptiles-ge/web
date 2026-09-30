import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/speciesPageAnalysis", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/speciesPageAnalysis")>()),
  createSpeciesPage: vi.fn(async (input) => ({
    id: input.id,
    pullRequestUrl: "https://github.com/reptiles-ge/web/pull/999",
    report: "შექმნის ანგარიში",
  })),
}));

import { POST } from "@/app/api/admin/species-create/route";
import { createSpeciesPage } from "@/lib/speciesPageAnalysis";

const request = (
  body: unknown = {
    commonName: "კავკასიური მორიელი",
    scientificName: "Olivierus caucasicus",
  },
  origin = "http://localhost",
) =>
  new Request("http://localhost/api/admin/species-create", {
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json", origin },
    method: "POST",
  });

describe("POST /api/admin/species-create", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("TELEGRAM_BOT_TOKEN", "test-token");
    vi.stubEnv("TELEGRAM_CHAT_ID", "test-chat");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(Response.json({ ok: true })),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("creates a page from the two requested fields", async () => {
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect(createSpeciesPage).toHaveBeenCalledWith({
      commonName: "კავკასიური მორიელი",
      id: "olivierus-caucasicus",
      scientificName: "Olivierus caucasicus",
    });
    expect(await response.json()).toEqual({
      id: "olivierus-caucasicus",
      pullRequestUrl: "https://github.com/reptiles-ge/web/pull/999",
      report: "შექმნის ანგარიში",
    });
  });

  it("rejects invalid input before creation", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const response = await POST(
      request({ commonName: "მორიელი", scientificName: "Olivierus" }),
    );
    expect(response.status).toBe(400);
    expect(createSpeciesPage).not.toHaveBeenCalled();
  });

  it("rejects cross-origin requests", async () => {
    const response = await POST(request(undefined, "http://example.com"));
    expect(response.status).toBe(404);
    expect(createSpeciesPage).not.toHaveBeenCalled();
  });
});
