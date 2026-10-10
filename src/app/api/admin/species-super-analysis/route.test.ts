import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET, POST } from "@/app/api/admin/species-super-analysis/route.local";
import {
  getSpeciesSuperAnalysisJob,
  startSpeciesSuperAnalysisJob,
} from "@/lib/speciesSuperAnalysisJobs";

vi.mock("@/lib/speciesSuperAnalysisJobs", () => ({
  getSpeciesSuperAnalysisJob: vi.fn(),
  startSpeciesSuperAnalysisJob: vi.fn(),
}));
const runId = "12345678-1234-1234-1234-123456789012";
const url = "http://localhost/api/admin/species-super-analysis";
const job = {
  currentStage: "analysis",
  error: null,
  pullRequestUrl: null,
  runId,
  speciesId: "phasianus-colchicus",
  status: "running",
  steps: [],
} as const;
const request = (
  origin = "http://localhost",
  body: unknown = { id: job.speciesId, runId },
) =>
  new Request(url, {
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json", origin },
    method: "POST",
  });
beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getSpeciesSuperAnalysisJob).mockResolvedValue(null);
  vi.mocked(startSpeciesSuperAnalysisJob).mockReturnValue({
    ...job,
    steps: [],
  });
});

describe("local Super Analysis API", () => {
  it("starts one background job without waiting for four AI calls", async () => {
    const response = await POST(request());
    expect(response.status).toBe(202);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(await response.json()).toMatchObject(job);
    expect(startSpeciesSuperAnalysisJob).toHaveBeenCalledWith(
      job.speciesId,
      runId,
    );
  });
  it("returns an existing idempotency key, including completed runs", async () => {
    vi.mocked(getSpeciesSuperAnalysisJob).mockResolvedValue({
      ...job,
      status: "completed",
      steps: [],
    });
    expect((await POST(request())).status).toBe(202);
    expect(startSpeciesSuperAnalysisJob).not.toHaveBeenCalled();
  });
  it("supports ordinary browser GETs using the same-origin referrer", async () => {
    vi.mocked(getSpeciesSuperAnalysisJob).mockResolvedValue({
      ...job,
      steps: [],
    });
    const response = await GET(
      new Request(`${url}?id=${job.speciesId}`, {
        headers: { referer: "http://localhost/prinvelebi/xoxobi" },
      }),
    );
    expect(await response.json()).toMatchObject(job);
  });
  it("rejects cross-origin POSTs and reads, missing referrers, and traversal", async () => {
    expect((await POST(request("https://evil.test"))).status).toBe(404);
    expect((await GET(new Request(`${url}?id=${job.speciesId}`))).status).toBe(
      404,
    );
    expect(
      (
        await GET(
          new Request(`${url}?id=${job.speciesId}`, {
            headers: { referer: "https://evil.test/" },
          }),
        )
      ).status,
    ).toBe(404);
    expect(
      (await POST(request("http://localhost", { id: "../secret", runId })))
        .status,
    ).toBe(400);
    expect(startSpeciesSuperAnalysisJob).not.toHaveBeenCalled();
  });
});
