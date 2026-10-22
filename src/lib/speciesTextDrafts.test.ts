import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  listAdminSpeciesDrafts,
  readAdminSpecies,
} from "@/lib/adminSpeciesApi";
import { transformWithAgent } from "@/lib/contentEditorAgent";

import {
  REPTILES_API_TEST_TOKEN,
  reptilesApi,
  resetReptilesApi,
} from "../../tests/msw/reptilesApi";
import { server } from "../../tests/msw/server";
import { processSpeciesTexts } from "./speciesTextProcessing";

vi.mock("@/lib/contentEditorAgent", () => ({ transformWithAgent: vi.fn() }));

const ID = "testudo-graeca";

beforeEach(() => {
  resetReptilesApi();
  server.use(reptilesApi);
  vi.stubEnv("API_WRITE_TOKEN", REPTILES_API_TEST_TOKEN);
  vi.mocked(transformWithAgent).mockImplementation(async (selection) => ({
    en: selection.existingTranslations?.en ?? "",
    ka:
      selection.field === "diet"
        ? `${selection.selected} განახლებული`
        : selection.selected,
    ru: selection.existingTranslations?.ru ?? "",
    tr: selection.existingTranslations?.tr ?? "",
  }));
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("processSpeciesTexts", () => {
  it("rewrites the page texts into one draft for review", async () => {
    const before = await readAdminSpecies(ID);
    const { report, reviewUrl } = await processSpeciesTexts(ID);
    expect(reviewUrl).toMatch(new RegExp(`^/admin/${ID}#draft-\\d+$`));
    expect(report).toContain("diet");
    const [draft] = await listAdminSpeciesDrafts(ID);
    expect(draft!.summary).toMatch(/^Rewrite \d+ page texts$/);
    expect(draft!.record.base.diet).toBe(
      `${before.record.base.diet} განახლებული`,
    );
    expect(draft!.record.base.overview).toBe(before.record.base.overview);
    expect((await readAdminSpecies(ID)).record.base.diet).toBe(
      before.record.base.diet,
    );
  });
});
