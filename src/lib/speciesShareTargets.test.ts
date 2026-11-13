import { describe, expect, it } from "vitest";

import { speciesShareTargets } from "@/lib/speciesShareTargets";

const URL = "https://reptiles.ge/gvelebi/giurza";
const TEXT = "გიურზა (Macrovipera lebetinus) - შხამიანი სახეობაა.";

describe("speciesShareTargets", () => {
  const targets = speciesShareTargets({ text: TEXT, url: URL });
  const byId = Object.fromEntries(targets.map((t) => [t.id, t.href]));

  it("lists the six targets in the design order", () => {
    expect(targets.map((t) => t.label)).toEqual([
      "Facebook",
      "Messenger",
      "WhatsApp",
      "Telegram",
      "Viber",
      "X",
    ]);
  });

  it("encodes the page url for every target", () => {
    const encoded = encodeURIComponent(URL);
    expect(byId.facebook).toBe(
      `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
    );
    expect(byId.messenger).toBe(`fb-messenger://share/?link=${encoded}`);
    expect(byId.telegram).toContain(`url=${encoded}&text=`);
    expect(byId.x).toContain(`url=${encoded}&text=`);
  });

  it("sends text and url together to WhatsApp and Viber", () => {
    const message = encodeURIComponent(`${TEXT}\n${URL}`);
    expect(byId.whatsapp).toBe(`https://wa.me/?text=${message}`);
    expect(byId.viber).toBe(`viber://forward?text=${message}`);
  });
});
