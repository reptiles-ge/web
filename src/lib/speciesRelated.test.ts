import { describe, expect, it } from "vitest";

import { getSpeciesAtlasMeta } from "@/data/speciesAtlas";
import { getSpeciesCatalog } from "@/lib/speciesCatalogApi";
import {
  getLookalikeSpecies,
  getProfileRelatedSpecies,
} from "@/lib/speciesRelated";

import { speciesCatalogFixture } from "../../tests/fixtures/speciesCatalog";

const catalog = speciesCatalogFixture("ka");

describe("profile related species", () => {
  it("links every published species from another profile", () => {
    const linked = new Set<string>();
    for (const item of catalog) {
      for (const peer of [
        ...getLookalikeSpecies(item.id, catalog),
        ...getProfileRelatedSpecies(item.id, catalog),
      ]) {
        linked.add(peer.id);
      }
    }
    expect(catalog.filter((item) => !linked.has(item.id))).toEqual([]);
  });

  it("stays within the group without repeating a lookalike", () => {
    for (const item of catalog) {
      if (item.id === "macrovipera-lebetina") continue;
      const related = getProfileRelatedSpecies(item.id, catalog);
      const lookalikes = new Set(
        getLookalikeSpecies(item.id, catalog).map((peer) => peer.id),
      );
      const ids = related.map((peer) => peer.id);
      expect(ids.length, item.id).toBeLessThanOrEqual(4);
      expect(new Set(ids).size, item.id).toBe(ids.length);
      expect(ids, item.id).not.toContain(item.id);
      for (const peer of related) {
        expect(lookalikes.has(peer.id), `${item.id} ${peer.id}`).toBe(false);
        if (peer.family === item.family) continue;
        expect(
          getSpeciesAtlasMeta(peer.id).group,
          `${item.id} -> ${peer.id}`,
        ).toBe(getSpeciesAtlasMeta(item.id).group);
      }
    }
  });

  it("never offers the glass lizard as a related snake", () => {
    for (const item of catalog) {
      if (getSpeciesAtlasMeta(item.id).group !== "snake") continue;
      expect(
        getProfileRelatedSpecies(item.id, catalog).map((peer) => peer.id),
        item.id,
      ).not.toContain("pseudopus-apodus");
    }
  });

  it("keeps the curated related lists", () => {
    expect(
      getProfileRelatedSpecies("macrovipera-lebetina", catalog).map(
        (peer) => peer.id,
      ),
    ).toEqual([
      "vipera-transcaucasiana",
      "vipera-dinniki",
      "vipera-kaznakovi",
      "vipera-renardi",
    ]);
    expect(getProfileRelatedSpecies("alectoris-chukar", catalog)).toEqual([]);
  });

  it("ranks the API catalog cards like the compiled catalog", async () => {
    const cards = await getSpeciesCatalog("en");
    const ids = (items: readonly { id: string }[]) =>
      items.map((item) => item.id);
    for (const item of catalog) {
      expect(ids(getProfileRelatedSpecies(item.id, cards)), item.id).toEqual(
        ids(getProfileRelatedSpecies(item.id, catalog)),
      );
      expect(ids(getLookalikeSpecies(item.id, cards)), item.id).toEqual(
        ids(getLookalikeSpecies(item.id, catalog)),
      );
    }
  });
});

describe("profile related index cache", () => {
  it("reuses the index for a fresh catalog with the same content", () => {
    const first = speciesCatalogFixture("ka");
    const second = structuredClone(first);
    for (const item of first) {
      expect(
        getProfileRelatedSpecies(item.id, second).map((peer) => peer.id),
        item.id,
      ).toStrictEqual(
        getProfileRelatedSpecies(item.id, first).map((peer) => peer.id),
      );
    }
    expect(getProfileRelatedSpecies(first[0]!.id, second)[0]).toBe(
      second.find(
        (item) =>
          item.id === getProfileRelatedSpecies(first[0]!.id, first)[0]?.id,
      ),
    );
  });

  it("rebuilds the index when a lookalike changes", () => {
    const base = speciesCatalogFixture("ka");
    const target = base.find(
      (item) =>
        item.id !== "macrovipera-lebetina" &&
        getProfileRelatedSpecies(item.id, base).length > 0,
    )!;
    const peer = getProfileRelatedSpecies(target.id, base)[0]!;
    const changed = structuredClone(base).map((item) =>
      item.id === target.id
        ? { ...item, lookalikes: [...item.lookalikes, peer.id] }
        : item,
    );
    expect(
      getProfileRelatedSpecies(target.id, changed).map((item) => item.id),
    ).not.toContain(peer.id);
  });
});
