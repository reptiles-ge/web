import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/speciesPageAnalysis", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/speciesPageAnalysis")>()),
  runSpeciesWorkflow: vi.fn(
    async (
      _id: string,
      modes: string[],
      onStep: (mode: string, report: string) => void,
    ) => {
      for (const mode of modes) onStep(mode, mode);
      return { pullRequestUrl: "https://github.com/reptiles-ge/web/pull/999" };
    },
  ),
}));

import { POST } from "@/app/api/admin/species-workflow/route";
import { runSpeciesWorkflow } from "@/lib/speciesPageAnalysis";

const request = (modes: unknown, origin = "http://localhost") =>
  new Request("http://localhost/api/admin/species-workflow", {
    body: JSON.stringify({ id: "macrovipera-lebetina", modes }),
    headers: { "Content-Type": "application/json", origin },
    method: "POST",
  });

describe("POST /api/admin/species-workflow", () => {
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

  it("preserves the requested step order in one run", async () => {
    const response = await POST(request(["records", "analysis"]));
    expect(response.status).toBe(200);
    expect(runSpeciesWorkflow).toHaveBeenCalledWith(
      "macrovipera-lebetina",
      ["records", "analysis"],
      expect.any(Function),
    );
    expect((await response.json()).steps).toEqual([
      { mode: "records", report: "records" },
      { mode: "analysis", report: "analysis" },
    ]);
  });

  it("rejects duplicate steps and cross-origin requests", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect((await POST(request(["analysis", "analysis"]))).status).toBe(400);
    expect(
      (await POST(request(["analysis"], "http://example.com"))).status,
    ).toBe(404);
    expect(runSpeciesWorkflow).not.toHaveBeenCalled();
  });
});
