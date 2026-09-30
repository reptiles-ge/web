import { afterEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/admin/species-create/route";

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
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the Codex prompt without running it", async () => {
    const response = await POST(request());
    expect(response.status).toBe(200);
    const payload = (await response.json()) as { prompt: string };
    expect(payload.prompt).toContain("კავკასიური მორიელი");
    expect(payload.prompt).toContain("Olivierus caucasicus");
    expect(payload.prompt).toContain("olivierus-caucasicus");
    expect(payload.prompt).toContain(
      "src/content/species/olivierus-caucasicus/ka.mdx",
    );
    expect(payload.prompt).not.toContain("{{COMMON_NAME}}");
    expect(payload.prompt).not.toContain("{{SPECIES_ID}}");
  });

  it("rejects invalid input before building a prompt", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const response = await POST(
      request({ commonName: "მორიელი", scientificName: "Olivierus" }),
    );
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "სამეცნიერო სახელი ჩაწერე ლათინურად, ავტორისა და წლის გარეშე",
    });
  });

  it("rejects cross-origin requests", async () => {
    const response = await POST(request(undefined, "http://example.com"));
    expect(response.status).toBe(404);
  });
});
