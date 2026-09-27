import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/speciesPageAnalysis", () => ({
  analyzeSpeciesPage: vi.fn(
    async (_id: string, onReport: (value: string) => void) => {
      onReport("კვლევის ანგარიში");
      return { pullRequestUrl: null, report: "კვლევის ანგარიში" };
    },
  ),
}));

import { POST } from "@/app/api/admin/species-analysis/route";
import { analyzeSpeciesPage } from "@/lib/speciesPageAnalysis";

const request = (origin = "http://localhost") =>
  new Request("http://localhost/api/admin/species-analysis", {
    body: JSON.stringify({ id: "macrovipera-lebetina" }),
    headers: { "Content-Type": "application/json", origin },
    method: "POST",
  });

describe("POST /api/admin/species-analysis", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns the report when research finds no content change", async () => {
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      pullRequestUrl: null,
      report: "კვლევის ანგარიში",
    });
    expect(analyzeSpeciesPage).toHaveBeenCalledWith(
      "macrovipera-lebetina",
      expect.any(Function),
    );
  });

  it("rejects a cross-origin request before starting analysis", async () => {
    const response = await POST(request("http://example.com"));
    expect(response.status).toBe(404);
    expect(analyzeSpeciesPage).not.toHaveBeenCalled();
  });
});
