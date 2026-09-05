import { describe, expect, it } from "vitest";

import {
  AGENCY_PHONE_DISPLAY,
  AGENCY_PHONE_TEL,
  EMERGENCY_PHONE,
  splitPhoneLinks,
} from "@/lib/phoneLinks";

function phones(text: string) {
  return splitPhoneLinks(text).filter((part) => part.type === "phone");
}

describe("splitPhoneLinks", () => {
  it("links standalone 112 in Georgian, English, Russian, and Turkish copy", () => {
    expect(phones("ნაკბენისას დარეკე 112-ზე.")).toEqual([
      { display: EMERGENCY_PHONE, tel: EMERGENCY_PHONE, type: "phone" },
    ]);
    expect(phones("If bitten, call 112.")).toEqual([
      { display: EMERGENCY_PHONE, tel: EMERGENCY_PHONE, type: "phone" },
    ]);
    expect(phones("При укусе звоните 112.")).toEqual([
      { display: EMERGENCY_PHONE, tel: EMERGENCY_PHONE, type: "phone" },
    ]);
    expect(phones("Isırıkta 112’yi arayın.")).toEqual([
      { display: EMERGENCY_PHONE, tel: EMERGENCY_PHONE, type: "phone" },
    ]);
  });

  it("links the animal monitoring agency number", () => {
    expect(phones(`სააგენტო: ${AGENCY_PHONE_DISPLAY}.`)).toEqual([
      {
        display: AGENCY_PHONE_DISPLAY,
        tel: AGENCY_PHONE_TEL,
        type: "phone",
      },
    ]);
  });

  it("does not treat ranges, IUCN ids, or 112.gov as phone numbers", () => {
    expect(phones("გესტაცია 112–130 დღე")).toEqual([]);
    expect(phones("pregnancy about 112-130 days")).toEqual([]);
    expect(phones("112.gov.ge — Georgia’s 112")).toEqual([
      { display: EMERGENCY_PHONE, tel: EMERGENCY_PHONE, type: "phone" },
    ]);
    expect(phones("https://112.gov.ge/?page_id=599")).toEqual([]);
    expect(phones("оценка e.T11120A114549788")).toEqual([]);
  });

  it("keeps surrounding copy as text parts", () => {
    expect(splitPhoneLinks("დარეკე 112-ზე")).toEqual([
      { type: "text", value: "დარეკე " },
      { display: EMERGENCY_PHONE, tel: EMERGENCY_PHONE, type: "phone" },
      { type: "text", value: "-ზე" },
    ]);
  });
});
