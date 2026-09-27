import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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

const request = (origin = "http://localhost", mode?: string) =>
  new Request("http://localhost/api/admin/species-analysis", {
    body: JSON.stringify({ id: "macrovipera-lebetina", mode }),
    headers: { "Content-Type": "application/json", origin },
    method: "POST",
  });

describe("POST /api/admin/species-analysis", () => {
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
      "analysis",
    );
    expect(fetch).toHaveBeenCalledWith(
      "https://api.telegram.org/bottest-token/sendMessage",
      expect.objectContaining({
        body: JSON.stringify({ chat_id: "test-chat", text: "✅ done გიურზა" }),
      }),
    );
  });

  it.each(["links", "lookalikes", "records"] as const)(
    "runs the %s review for the requested species",
    async (mode) => {
      const response = await POST(request("http://localhost", mode));
      expect(response.status).toBe(200);
      expect(analyzeSpeciesPage).toHaveBeenCalledWith(
        "macrovipera-lebetina",
        expect.any(Function),
        mode,
      );
    },
  );

  it("rejects an unsupported review mode", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const response = await POST(request("http://localhost", "unknown"));
    expect(response.status).toBe(400);
    expect(analyzeSpeciesPage).not.toHaveBeenCalled();
  });

  it("sends a short failure notification", async () => {
    vi.mocked(analyzeSpeciesPage).mockRejectedValueOnce(
      new Error("Codex failed"),
    );
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const response = await POST(request());
    expect(response.status).toBe(400);
    expect(fetch).toHaveBeenCalledWith(
      "https://api.telegram.org/bottest-token/sendMessage",
      expect.objectContaining({
        body: JSON.stringify({
          chat_id: "test-chat",
          text: "❌ failed გიურზა",
        }),
      }),
    );
  });

  it("rejects a cross-origin request before starting analysis", async () => {
    const response = await POST(request("http://example.com"));
    expect(response.status).toBe(404);
    expect(analyzeSpeciesPage).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });
});
