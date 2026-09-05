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
});
