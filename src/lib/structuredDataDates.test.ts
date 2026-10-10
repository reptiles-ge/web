import { describe, expect, it } from "vitest";

import {
  atlasDateFields,
  authorDateFields,
  hasMeaningfulUpdate,
  pageDateFields,
  quizDateFields,
  regionDateFields,
} from "@/lib/structuredDataDates";

describe("atlasDateFields", () => {
  const page = pageDateFields("/species");

  it("keeps the page date when no species was updated after it", () => {
    expect(atlasDateFields("2020-01-01T00:00:00+04:00")).toEqual(page);
  });

  it("moves dateModified to the newest species update shown on the page", () => {
    const later = new Date(Date.parse(page.dateModified) + 86_400_000)
      .toISOString()
      .replace(".000Z", "Z");
    expect(atlasDateFields(later)).toEqual({
      dateModified: later,
      datePublished: page.datePublished,
    });
  });

  it("ignores a missing or unparseable species date", () => {
    expect(atlasDateFields(null)).toEqual(page);
    expect(atlasDateFields("not a date")).toEqual(page);
  });

  it("never dates the atlas before it was published", () => {
    const fields = atlasDateFields();
    expect(Date.parse(fields.dateModified)).toBeGreaterThanOrEqual(
      Date.parse(fields.datePublished),
    );
  });
});

describe("hasMeaningfulUpdate", () => {
  it("is false when either date is missing", () => {
    expect(hasMeaningfulUpdate(undefined, "2026-02-01")).toBe(false);
    expect(hasMeaningfulUpdate("2026-01-01", null)).toBe(false);
    expect(hasMeaningfulUpdate("", "2026-02-01")).toBe(false);
  });

  it("is true when the update is on a later calendar day", () => {
    expect(hasMeaningfulUpdate("2026-01-01", "2026-02-01")).toBe(true);
  });

  it("is false for the same day, or an update before publishing", () => {
    expect(hasMeaningfulUpdate("2026-01-01", "2026-01-01")).toBe(false);
    expect(hasMeaningfulUpdate("2026-02-01", "2026-01-01")).toBe(false);
  });

  it("falls back to string inequality for unparseable dates", () => {
    expect(hasMeaningfulUpdate("soon", "later")).toBe(true);
    expect(hasMeaningfulUpdate("same", "same")).toBe(false);
  });
});

describe.each([
  ["pageDateFields", () => pageDateFields("/species")],
  ["quizDateFields", () => quizDateFields("snake")],
  ["regionDateFields", () => regionDateFields("kakheti")],
  ["authorDateFields", () => authorDateFields("sandro-khakhva")],
])("%s", (_name, fields) => {
  it("returns a modified and a published date", () => {
    const result = fields();
    expect(Object.keys(result).sort()).toEqual([
      "dateModified",
      "datePublished",
    ]);
    expect(Number.isNaN(Date.parse(result.datePublished))).toBe(false);
    expect(Number.isNaN(Date.parse(result.dateModified))).toBe(false);
  });
});
