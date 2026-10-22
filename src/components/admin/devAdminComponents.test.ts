import { afterEach, describe, expect, it, vi } from "vitest";

import {
  loadSelectionContentEditor,
  loadSpeciesPageAnalysis,
} from "@/components/admin/devAdminComponents";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("dev admin component loaders", () => {
  it("loads the admin components outside production", async () => {
    expect(await loadSelectionContentEditor()).toBeTypeOf("function");
    expect(await loadSpeciesPageAnalysis()).toBeTypeOf("function");
  });

  it("loads nothing in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(await loadSelectionContentEditor()).toBeNull();
    expect(await loadSpeciesPageAnalysis()).toBeNull();
  });

  it("loads nothing on Vercel", async () => {
    vi.stubEnv("VERCEL", "1");
    expect(await loadSelectionContentEditor()).toBeNull();
    expect(await loadSpeciesPageAnalysis()).toBeNull();
  });
});
