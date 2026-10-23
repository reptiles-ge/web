import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  listAdminSpeciesDrafts,
  readAdminSpecies,
} from "@/lib/adminSpeciesApi";
import { editorFields } from "@/lib/contentEditor";

import {
  REPTILES_API_TEST_TOKEN,
  reptilesApi,
  resetReptilesApi,
} from "../../tests/msw/reptilesApi";
import { server } from "../../tests/msw/server";
import { proposeSpeciesEdit } from "./contentEditorSpecies";
import { readRecordField, writeRecordField } from "./speciesRecordFields";

const ID = "testudo-graeca";
const LOCALES = ["ka", "en", "ru", "tr"] as const;

beforeEach(() => {
  resetReptilesApi();
  server.use(reptilesApi);
  vi.stubEnv("API_WRITE_TOKEN", REPTILES_API_TEST_TOKEN);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

async function plainField() {
  const { record } = await readAdminSpecies(ID);
  const field = editorFields.find((candidate) =>
    LOCALES.every((locale) => {
      const text = readRecordField(record, locale, candidate);
      return text.trim() && !text.includes("](");
    }),
  )!;
  return { field, source: readRecordField(record, "ka", field) };
}

function request(field: string, renderedText: string) {
  return {
    end: renderedText.length,
    field,
    id: ID,
    kind: "species" as const,
    renderedText,
    start: 0,
  };
}

describe("proposeSpeciesEdit", () => {
  it("turns an AI edit into a draft and leaves the live page alone", async () => {
    const { field, source } = await plainField();
    const transform = vi.fn(async () => ({
      en: "New English text",
      ka: "ახალი ქართული ტექსტი",
      ru: "Новый текст",
      tr: "Yeni metin",
    }));
    const { reviewUrl } = await proposeSpeciesEdit(
      request(field, source),
      transform,
    );
    expect(reviewUrl).toMatch(new RegExp(`^/admin/${ID}#draft-\\d+$`));
    const [draft] = await listAdminSpeciesDrafts(ID);
    expect(draft).toMatchObject({ source: "ai", summary: `Edit ${field}` });
    expect(readRecordField(draft!.record, "ka", field)).toBe(
      "ახალი ქართული ტექსტი",
    );
    expect(readRecordField(draft!.record, "en", field)).toBe(
      "New English text",
    );
    const live = await readAdminSpecies(ID);
    expect(readRecordField(live.record, "ka", field)).toBe(source);
    expect(draft!.record.base.updatedAt).not.toBe(live.record.base.updatedAt);
  });

  it("refuses unsupported fields, stale selections and edits that change nothing", async () => {
    const { field, source } = await plainField();
    await expect(
      proposeSpeciesEdit(request("scientificName", "x"), vi.fn()),
    ).rejects.toThrow("Unsupported species field");
    await expect(
      proposeSpeciesEdit(request(field, `${source} extra`), vi.fn()),
    ).rejects.toThrow("Content changed");
    const { record } = await readAdminSpecies(ID);
    const same = Object.fromEntries(
      LOCALES.map((locale) => [locale, readRecordField(record, locale, field)]),
    );
    await expect(
      proposeSpeciesEdit(
        request(field, source),
        vi.fn(async () => same) as never,
      ),
    ).rejects.toThrow("The edit changed nothing");
    expect(await listAdminSpeciesDrafts(ID)).toEqual([]);
  });

  it("refuses a common name edit that would change the public URL", async () => {
    const { record } = await readAdminSpecies(ID);
    const name = record.base.commonName;
    await expect(
      proposeSpeciesEdit(
        request("commonName", name),
        vi.fn(async () => ({ en: "A", ka: "სხვა სახელი", ru: "Б", tr: "C" })),
      ),
    ).rejects.toThrow("Species name edit would change its public URL");
  });
});

describe("speciesRecordFields", () => {
  it("reads missing paths as empty and refuses to write through them", async () => {
    const { record } = await readAdminSpecies(ID);
    expect(readRecordField(record, "en", "faq.99.answer")).toBe("");
    expect(() => writeRecordField(record, "en", "faq.99.answer", "x")).toThrow(
      "Cannot write faq.99.answer for en",
    );
  });
});
