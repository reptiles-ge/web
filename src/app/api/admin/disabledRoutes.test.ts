import { describe, expect, it } from "vitest";

import { POST as addFieldRecord } from "@/app/api/admin/field-records/route.local";
import { POST as uploadPhotos } from "@/app/api/admin/photos/route.local";
import { POST as analyzeSpecies } from "@/app/api/admin/species-analysis/route.local";
import { POST as createSpecies } from "@/app/api/admin/species-create/route.local";
import {
  POST as startSuperAnalysis,
  GET as superAnalysisStatus,
} from "@/app/api/admin/species-super-analysis/route.local";
import { POST as runWorkflow } from "@/app/api/admin/species-workflow/route.local";

const post = (origin: string) =>
  new Request("http://localhost/api/admin/x", {
    body: "{}",
    headers: { "Content-Type": "application/json", origin },
    method: "POST",
  });

describe("admin flows that edited species MDX", () => {
  it.each([
    ["field-records", addFieldRecord],
    ["photos", uploadPhotos],
    ["species-analysis", analyzeSpecies],
    ["species-create", createSpecies],
    ["species-super-analysis", startSuperAnalysis],
    ["species-workflow", runWorkflow],
  ])("%s answers 503 with an explanation", async (_, handler) => {
    const response = await handler(post("http://localhost"));
    expect(response.status).toBe(503);
    const { error } = (await response.json()) as { error: string };
    expect(error).toContain("MDX");
    expect((await handler(post("http://evil.test"))).status).toBe(404);
  });

  it("reports no super-analysis job to a local admin page", async () => {
    const response = await superAnalysisStatus(
      new Request("http://localhost/api/admin/species-super-analysis?id=a", {
        headers: { referer: "http://localhost/gvelebi/giurza" },
      }),
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toBeNull();
    expect(
      (
        await superAnalysisStatus(
          new Request("http://localhost/api/admin/species-super-analysis", {
            headers: { origin: "http://evil.test" },
          }),
        )
      ).status,
    ).toBe(404);
    expect(
      (
        await superAnalysisStatus(
          new Request("http://localhost/api/admin/species-super-analysis"),
        )
      ).status,
    ).toBe(404);
  });
});
