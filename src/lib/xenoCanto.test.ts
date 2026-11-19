import { describe, expect, it } from "vitest";

import {
  licenceName,
  parseDuration,
  parseXenoCantoPage,
  sortXenoCantoRecordings,
  xenoCantoAudioKey,
  xenoCantoLocation,
  xenoCantoQueries,
} from "./xenoCanto";

describe("xeno-canto helpers", () => {
  it("builds the species tag queries", () => {
    expect(xenoCantoQueries(" Picus  viridis ")).toStrictEqual([
      'sp:"picus viridis"',
      'gen:"picus" sp:"viridis"',
    ]);
  });

  it("parses a page and skips broken recordings", () => {
    const page = parseXenoCantoPage({
      numPages: "3",
      numRecordings: "120",
      page: "2",
      recordings: [
        {
          cnt: "Georgia",
          date: "2020-00-00",
          file: "https://xeno-canto.org/5/download",
          fileName: "XC5.WAV",
          gen: "Picus",
          id: "5",
          lat: "",
          length: "0:47",
          lic: "//creativecommons.org/publicdomain/zero/1.0/",
          lng: "44.8",
          loc: "Tbilisi",
          q: "no score",
          rec: "Ana",
          sono: "broken",
          sp: "viridis",
          type: "call",
        },
        { id: "x" },
        "nope",
      ],
    });
    expect(page).toMatchObject({ page: 2, pages: 3, total: 120 });
    expect(page?.recordings).toHaveLength(1);
    expect(page?.recordings[0]).toMatchObject({
      date: "2020",
      durationSeconds: 47,
      format: "wav",
      licence: "CC0",
      lng: "44.8",
      pageUrl: "https://xeno-canto.org/5",
      scientificName: "Picus viridis",
    });
    expect(page?.recordings[0]?.lat).toBeUndefined();
    expect(page?.recordings[0]?.sonogram).toBeUndefined();
    expect(parseXenoCantoPage({ error: "x" })).toBeNull();
  });

  it("puts Georgia first, then quality", () => {
    const base = { country: "Iran", quality: "A" };
    const sorted = sortXenoCantoRecordings([
      { ...base, id: "1", quality: "" },
      { ...base, id: "2", quality: "C" },
      { ...base, country: "Georgia", id: "3", quality: "D" },
      { ...base, id: "4" },
    ] as never);
    expect(sorted.map((item) => item.id)).toStrictEqual(["3", "4", "2", "1"]);
  });

  it("names the CDN key, the place, the duration and the licence", () => {
    expect(xenoCantoAudioKey("picus-viridis", "42")).toBe(
      "audio/picus-viridis-xc42.mp3",
    );
    expect(
      xenoCantoLocation({ country: "Italy", location: "Tuscany, Italy" }),
    ).toBe("Tuscany, Italy");
    expect(xenoCantoLocation({ country: "Italy", location: "Tuscany" })).toBe(
      "Tuscany, Italy",
    );
    expect(xenoCantoLocation({ country: "Italy", location: "" })).toBe("Italy");
    expect(parseDuration("1:02:03")).toBe(3723);
    expect(parseDuration("x")).toBeNull();
    expect(licenceName("https://creativecommons.org/licenses/by-sa/4.0/")).toBe(
      "CC BY-SA 4.0",
    );
    expect(licenceName("")).toBe("");
  });
});
