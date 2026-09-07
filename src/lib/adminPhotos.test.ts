import { describe, expect, it } from "vitest";

import { creditFromInput } from "@/lib/adminPhotos";

describe("creditFromInput", () => {
  it("stores the photographer url on both locales", () => {
    const input = {
      photographer: "ანა",
      photographerEn: "Ana",
      url: "https://example.com/ana",
    };
    expect(creditFromInput(input, "ka")).toEqual({
      photographer: "ანა",
      url: "https://example.com/ana",
    });
    expect(creditFromInput(input, "en")).toEqual({
      photographer: "Ana",
      url: "https://example.com/ana",
    });
  });

  it("omits a blank url", () => {
    expect(creditFromInput({ photographer: "ანა", url: "  " }, "ka")).toEqual({
      photographer: "ანა",
    });
  });

  it("rejects a non-http photographer url", () => {
    expect(() =>
      creditFromInput({ photographer: "ანა", url: "javascript:alert(1)" }, "ka"),
    ).toThrow(/http/);
  });

  it("sets georgia-field when marked and location is present", () => {
    expect(
      creditFromInput(
        {
          georgiaField: true,
          location: "ვაშლოვანი",
          photographer: "ანა",
        },
        "ka",
      ),
    ).toEqual({
      location: "ვაშლოვანი",
      photoConfidence: "georgia-field",
      photographer: "ანა",
    });
  });

  it("requires location for georgia-field photos", () => {
    expect(() =>
      creditFromInput({ georgiaField: true, photographer: "ანა" }, "ka"),
    ).toThrow(/ადგილი/);
  });

  it("omits photoConfidence when not georgia-field", () => {
    expect(
      creditFromInput(
        { location: "Armenia", photographer: "ანა" },
        "ka",
      ),
    ).toEqual({
      location: "Armenia",
      photographer: "ანა",
    });
  });
});
