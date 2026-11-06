import { describe, expect, it } from "vitest";

import { isHerpetofaunaGroup } from "@/data/herpetofauna-checklist";

import { speciesCatalogFixture } from "../../tests/fixtures/speciesCatalog";

function status(id: string) {
  return speciesCatalogFixture("ka").find((item) => item.id === id)
    ?.checklistStatus;
}

describe("herpetofauna checklist status", () => {
  it("gives every published amphibian and reptile a status and no other group one", () => {
    for (const item of speciesCatalogFixture("ka")) {
      if (isHerpetofaunaGroup(item.group)) {
        expect(item.checklistStatus, item.id).not.toBeNull();
      } else {
        expect(item.checklistStatus, item.id).toBeNull();
      }
    }
  });

  it("never labels a candidate as confirmed", () => {
    for (const id of [
      "bufo-verrucosissimus",
      "elaphe-urartica",
      "malpolon-insignitus",
      "vipera-darevskii",
      "vipera-dinniki",
      "vipera-renardi",
    ])
      expect(status(id), id).toBe("candidate");
    expect(status("vipera-kaznakovi")).toBe("confirmed");
    expect(status("lacerta-agilis")).toBe("confirmed");
    expect(status("macrovipera-lebetina")).toBe("confirmed");
    expect(status("darevskia-raddei")).toBe("confirmed");
    expect(status("phoenicolacerta-laevis")).toBe("introduced");
    expect(status("trachemys-scripta")).toBe("introduced");
  });

  it("keeps the same status in every locale", () => {
    const ka = new Map(
      speciesCatalogFixture("ka").map((item) => [
        item.id,
        item.checklistStatus,
      ]),
    );
    for (const locale of ["en", "ru", "tr"] as const)
      for (const item of speciesCatalogFixture(locale))
        expect(item.checklistStatus, `${locale} ${item.id}`).toBe(
          ka.get(item.id),
        );
  });
});
