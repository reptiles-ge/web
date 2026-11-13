import { describe, expect, it } from "vitest";

import { POST as addFieldRecord } from "@/app/api/admin/field-records/route.local";
import { POST as uploadPhotos } from "@/app/api/admin/photos/route.local";
import { POST as createSpecies } from "@/app/api/admin/species-create/route.local";

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
    ["species-create", createSpecies],
  ])("%s answers 503 with an explanation", async (_, handler) => {
    const response = await handler(post("http://localhost"));
    expect(response.status).toBe(503);
    const { error } = (await response.json()) as { error: string };
    expect(error).toContain("MDX");
    expect((await handler(post("http://evil.test"))).status).toBe(404);
  });
});
