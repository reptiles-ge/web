import { describe, expect, it } from "vitest";

import {
  getSpeciesFactVisual,
  parseMeasuredRange,
} from "@/lib/speciesFactVisuals";

describe("parseMeasuredRange", () => {
  it("reads a plain centimetre range in every locale", () => {
    expect(parseMeasuredRange("ჩვეულებრივ 70–90 სმ")).toEqual({
      max: 90,
      min: 70,
      unit: "სმ",
    });
    expect(parseMeasuredRange("typically 70–90 cm")).toEqual({
      max: 90,
      min: 70,
      unit: "cm",
    });
    expect(parseMeasuredRange("обычно 70-90 см")).toEqual({
      max: 90,
      min: 70,
      unit: "см",
    });
  });

  it("reads thousands separators used by each locale", () => {
    expect(parseMeasuredRange("0–1,500 მ")?.max).toBe(1500);
    expect(parseMeasuredRange("0–1 500 m")?.max).toBe(1500);
    expect(parseMeasuredRange("0–1.500 m")?.max).toBe(1500);
  });

  it("keeps millimetres apart from metres", () => {
    expect(parseMeasuredRange("12–18 მმ")?.unit).toBe("მმ");
    expect(parseMeasuredRange("12–18 mm")?.unit).toBe("mm");
  });

  it("returns null when there is no trustworthy range", () => {
    expect(parseMeasuredRange("1–1,5 მ")).toBeNull();
    expect(parseMeasuredRange("up to 2 metres")).toBeNull();
    expect(parseMeasuredRange("90–70 cm")).toBeNull();
    expect(parseMeasuredRange("მშრალი კლდოვანი ადგილები")).toBeNull();
  });
});

describe("getSpeciesFactVisual", () => {
  it("places a size range on a rounded scale", () => {
    expect(
      getSpeciesFactVisual(
        { label: "სიგრძე", value: "ჩვეულებრივ 70–90 სმ" },
        "ka",
      ),
    ).toEqual({
      end: 0.6,
      kind: "range",
      scaleLabel: "150 სმ",
      start: 70 / 150,
    });
  });

  it("places elevation on the fixed five kilometre scale", () => {
    expect(
      getSpeciesFactVisual({ label: "Elevation", value: "0–1,500 m" }, "en"),
    ).toEqual({ end: 0.3, kind: "range", scaleLabel: "5,000 m", start: 0 });
  });

  it("ignores elevation that is not in metres or is off the scale", () => {
    expect(
      getSpeciesFactVisual({ label: "Elevation", value: "0–900 cm" }, "en"),
    ).toBeNull();
    expect(
      getSpeciesFactVisual({ label: "Elevation", value: "0–6,000 m" }, "en"),
    ).toBeNull();
  });

  it("ignores a size too large for the scale", () => {
    expect(
      getSpeciesFactVisual({ label: "Size", value: "4,500–9,000 cm" }, "en"),
    ).toBeNull();
  });

  it("reads the IUCN code from any stat", () => {
    expect(
      getSpeciesFactVisual(
        { label: "კონსერვაცია", value: "ნაკლ. საფრთხე (LC)" },
        "ka",
      ),
    ).toEqual({ code: "LC", kind: "iucn" });
    expect(
      getSpeciesFactVisual({ label: "Global status", value: "(VU)" }, "en"),
    ).toEqual({ code: "VU", kind: "iucn" });
  });

  it.each(["LC", "NT", "VU", "EN", "CR"])(
    "reads the bare IUCN code %s in every locale",
    (code) => {
      for (const locale of ["ka", "en", "ru", "tr"]) {
        expect(
          getSpeciesFactVisual(
            { label: "Conservation", value: ` ${code} ` },
            locale,
          ),
        ).toEqual({ code, kind: "iucn" });
      }
    },
  );

  it("does not interpret a code embedded in other text as an IUCN status", () => {
    expect(
      getSpeciesFactVisual(
        { label: "Status", value: "LC nationally; VU globally" },
        "en",
      ),
    ).toBeNull();
  });

  it("returns null for stats without a visual", () => {
    expect(
      getSpeciesFactVisual({ label: "ოჯახი", value: "Viperidae" }, "ka"),
    ).toBeNull();
    expect(
      getSpeciesFactVisual({ label: "ჰაბიტატი", value: "0–1,500 მ" }, "ka"),
    ).toBeNull();
    expect(
      getSpeciesFactVisual({ label: "ზომა", value: "დიდი" }, "ka"),
    ).toBeNull();
  });
});
