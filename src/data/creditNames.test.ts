import { describe, expect, it } from "vitest";

import { localizeCreditPerson, localizeCreditPlace } from "@/data/creditNames";

describe("credit name localization", () => {
  it("translates a known place for non-Georgian locales", () => {
    expect(localizeCreditPlace("მცხეთა", "en")).toBe("Mtskheta");
    expect(localizeCreditPlace("მცხეთა", "ru")).toBe("Мцхета");
    expect(localizeCreditPlace("მცხეთა", "ka")).toBe("მცხეთა");
  });

  it("leaves unknown values unchanged", () => {
    expect(localizeCreditPlace("Somewhere new", "en")).toBe("Somewhere new");
    expect(localizeCreditPerson("Unknown Person", "tr")).toBe("Unknown Person");
  });

  it("does not rename registered contributors", () => {
    expect(localizeCreditPerson("ზაური ხაჩიძე", "en")).toBe("ზაური ხაჩიძე");
  });
});
