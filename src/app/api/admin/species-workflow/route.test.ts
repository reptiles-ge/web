import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/speciesPageAnalysis", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/speciesPageAnalysis")>()),
  runSpeciesWorkflow: vi.fn(
    async (
      _id: string,
      modes: string[],
      onStep: (mode: string, report: string) => Promise<void> | void,
    ) => {
      for (const mode of modes) await onStep(mode, mode);
      return {
        error: null,
        failedStep: null,
        pullRequestUrl: "https://github.com/reptiles-ge/web/pull/999",
      };
    },
  ),
}));

import { POST } from "@/app/api/admin/species-workflow/route.local";
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
    expect(
      vi
        .mocked(fetch)
        .mock.calls.map(
          ([, options]) => JSON.parse(String(options?.body)).text,
        ),
    ).toEqual([
      "✅ 1/3 done გიურზა (records)",
      "✅ 2/3 done გიურზა (analysis)",
      "✅ 3/3 done გიურზა (workflow)",
    ]);
  });

  it("does not report the final stage when the workflow fails", async () => {
    vi.mocked(runSpeciesWorkflow).mockImplementationOnce(
      async (_id, modes, onStep) => {
        await onStep(modes[0], "records");
        throw new Error("Next step failed");
      },
    );
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const response = await POST(request(["records", "analysis"]));
    expect(response.status).toBe(400);
    expect(
      vi
        .mocked(fetch)
        .mock.calls.map(
          ([, options]) => JSON.parse(String(options?.body)).text,
        ),
    ).toEqual(["✅ 1/3 done გიურზა (records)", "❌ workflow failed გიურზა"]);
  });

  it("returns the PR and completed steps when a later step fails", async () => {
    vi.mocked(runSpeciesWorkflow).mockImplementationOnce(
      async (_id, modes, onStep) => {
        await onStep(modes[0], "records");
        return {
          error: "Invalid YAML frontmatter",
          failedStep: modes[1],
          pullRequestUrl: "https://github.com/reptiles-ge/web/pull/999",
        };
      },
    );
    const response = await POST(request(["records", "analysis"]));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      error: "Invalid YAML frontmatter",
      failedStep: "analysis",
      pullRequestUrl: "https://github.com/reptiles-ge/web/pull/999",
      steps: [{ mode: "records", report: "records" }],
    });
    expect(
      vi
        .mocked(fetch)
        .mock.calls.map(
          ([, options]) => JSON.parse(String(options?.body)).text,
        ),
    ).toEqual([
      "✅ 1/3 done გიურზა (records)",
      "⚠️ workflow stopped გიურზა (analysis) — https://github.com/reptiles-ge/web/pull/999",
    ]);
  });

  it("reports a failed step without a PR when nothing was committed", async () => {
    vi.mocked(runSpeciesWorkflow).mockResolvedValueOnce({
      error: "Invalid YAML frontmatter",
      failedStep: "analysis",
      pullRequestUrl: null,
    });
    const response = await POST(request(["analysis"]));
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      error: "Invalid YAML frontmatter",
      failedStep: "analysis",
      pullRequestUrl: null,
      steps: [],
    });
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
