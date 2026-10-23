import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/speciesTextProcessing", () => ({
  processSpeciesTexts: vi.fn(async () => ({
    report: "overview\nდამუშავებული ტექსტი",
    reviewUrl: "/admin/zamenis-hohenackeri#draft-7",
  })),
}));
vi.mock("@/lib/adminSpeciesApi", () => ({
  readAdminSpecies: vi.fn(async () => ({
    record: { base: { commonName: "ამიერკავკასიური მცურავი" } },
    version: 3,
  })),
}));

import { POST } from "@/app/api/admin/species-texts/route.local";
import { processSpeciesTexts } from "@/lib/speciesTextProcessing";

const request = (origin = "http://localhost", progress?: unknown) =>
  new Request("http://localhost/api/admin/species-texts", {
    body: JSON.stringify({ id: "zamenis-hohenackeri", progress }),
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
      report: "overview\nდამუშავებული ტექსტი",
      reviewUrl: "/admin/zamenis-hohenackeri#draft-7",
    });
    expect(processSpeciesTexts).toHaveBeenCalledWith("zamenis-hohenackeri");
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

  it("sends numbered progress for a workflow step", async () => {
    const response = await POST(
      request("http://localhost", { current: 1, total: 2 }),
    );
    expect(response.status).toBe(200);
    expect(fetch).toHaveBeenCalledWith(
      "https://api.telegram.org/bottest-token/sendMessage",
      expect.objectContaining({
        body: JSON.stringify({
          chat_id: "test-chat",
          text: "✅ 1/2 done ამიერკავკასიური მცურავი (texts)",
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
