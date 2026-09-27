import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/speciesTextProcessing", () => ({
  processSpeciesTexts: vi.fn(async () => ({
    pullRequestUrl: "https://github.com/reptiles-ge/web/pull/999",
    report: "overview\nდამუშავებული ტექსტი",
  })),
}));

import { POST } from "@/app/api/admin/species-texts/route";
import { processSpeciesTexts } from "@/lib/speciesTextProcessing";

const request = (origin = "http://localhost") =>
  new Request("http://localhost/api/admin/species-texts", {
    body: JSON.stringify({ id: "zamenis-hohenackeri" }),
    headers: { "Content-Type": "application/json", origin },
    method: "POST",
  });

describe("POST /api/admin/species-texts", () => {
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

  it("returns the edited texts and sends a success notification", async () => {
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      pullRequestUrl: "https://github.com/reptiles-ge/web/pull/999",
      report: "overview\nდამუშავებული ტექსტი",
    });
    expect(processSpeciesTexts).toHaveBeenCalledWith(
      "zamenis-hohenackeri",
      expect.any(String),
    );
    expect(fetch).toHaveBeenCalledWith(
      "https://api.telegram.org/bottest-token/sendMessage",
      expect.objectContaining({
        body: JSON.stringify({
          chat_id: "test-chat",
          text: "✅ texts done ამიერკავკასიური მცურავი",
        }),
      }),
    );
  });

  it("sends a short failure notification", async () => {
    vi.mocked(processSpeciesTexts).mockRejectedValueOnce(
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
          text: "❌ texts failed ამიერკავკასიური მცურავი",
        }),
      }),
    );
  });

  it("rejects a cross-origin request", async () => {
    const response = await POST(request("http://example.com"));
    expect(response.status).toBe(404);
    expect(processSpeciesTexts).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });
});
