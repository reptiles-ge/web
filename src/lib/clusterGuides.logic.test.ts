import { describe, expect, it } from "vitest";

import type { GroupHubId } from "@/lib/groupHubs";

import { getRegionById } from "@/data/regions";
import { getCatalogSpecies, getSpeciesById } from "@/data/species";
import { getCatalogSpeciesByGroup } from "@/data/speciesAtlas";
import {
  CLUSTER_GUIDE_LIST,
  CLUSTER_GUIDES,
  dedupeGuideLinks,
  getHubIndexTitleKey,
  getHubPageRelatedGuides,
  getRegionSnakeSpecies,
  getRelatedGuideCards,
  getSpeciesGuideLinks,
  getViperSpecies,
  HUB_CLUSTER_CARDS,
  HUB_INDEX_PATH,
  isFrogSpecies,
  isLizardSpecies,
  isNewtSpecies,
  LARGE_SNAKE_IDS,
  orderSpeciesByIds,
  splitHubSpecies,
} from "@/lib/clusterGuides";
import { GROUP_HUBS } from "@/lib/groupHubs";

const HUB_IDS = Object.keys(GROUP_HUBS) as GroupHubId[];

function keys(id: string) {
  return getSpeciesGuideLinks(id).map((link) =>
    link.kind === "page" ? link.key : link.kind,
  );
}

function species(id: string) {
  const item = getSpeciesById(id);
  if (!item) throw new Error(`Missing species ${id}`);
  return item;
}

describe("cluster guide configuration", () => {
  it("keys every guide by its own id and a unique pathname", () => {
    for (const [id, guide] of Object.entries(CLUSTER_GUIDES)) {
      expect(guide.id).toBe(id);
    }
    const paths = CLUSTER_GUIDE_LIST.map((guide) => guide.pathname);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("points every guide at an existing hero species and a real hub", () => {
    for (const guide of CLUSTER_GUIDE_LIST) {
      expect(getSpeciesById(guide.heroSpeciesId), guide.id).toBeDefined();
      expect(HUB_IDS, guide.id).toContain(guide.parentHub);
    }
  });

  it("matches at least one published species for every guide", () => {
    for (const guide of CLUSTER_GUIDE_LIST) {
      expect(
        getCatalogSpecies().filter(guide.matches).length,
        guide.id,
      ).toBeGreaterThan(0);
    }
  });

  it("has an index path and title key for every hub", () => {
    for (const hub of HUB_IDS) {
      expect(HUB_INDEX_PATH[hub], hub).toBeTruthy();
      expect(getHubIndexTitleKey(hub), hub).toMatch(/^cluster\./);
    }
  });

  it("uses distinct title keys for distinct hubs", () => {
    const titles = HUB_IDS.map((hub) => getHubIndexTitleKey(hub));
    expect(new Set(titles).size).toBe(titles.length);
  });
});

describe("species predicates", () => {
  it("identifies frogs and newts by id", () => {
    expect(isFrogSpecies("pelophylax-ridibundus")).toBe(true);
    expect(isFrogSpecies("natrix-natrix")).toBe(false);
    expect(isNewtSpecies("natrix-natrix")).toBe(false);
  });

  it("keeps frog and newt sets disjoint", () => {
    for (const item of getCatalogSpecies()) {
      expect(isFrogSpecies(item.id) && isNewtSpecies(item.id)).toBe(false);
    }
  });

  it("identifies lizards through the atlas group", () => {
    expect(isLizardSpecies(species("pseudopus-apodus"))).toBe(true);
    expect(isLizardSpecies(species("natrix-natrix"))).toBe(false);
  });
});

describe("orderSpeciesByIds", () => {
  it("returns species in the requested order and skips unknown ids", () => {
    const all = [species("natrix-natrix"), species("testudo-graeca")];
    expect(
      orderSpeciesByIds(all, [
        "testudo-graeca",
        "missing",
        "natrix-natrix",
      ]).map((item) => item.id),
    ).toEqual(["testudo-graeca", "natrix-natrix"]);
  });
});

describe("getViperSpecies", () => {
  it("returns only Viperidae", () => {
    const vipers = getViperSpecies(getCatalogSpeciesByGroup("snake"));
    expect(vipers.length).toBeGreaterThan(0);
    for (const item of vipers) expect(item.family).toBe("Viperidae");
  });
});

describe("getRegionSnakeSpecies", () => {
  it("returns only snakes", () => {
    const region = getRegionById("kakheti");
    expect(region).toBeDefined();
    for (const item of getRegionSnakeSpecies(region!)) {
      expect(item.id).not.toBe("pseudopus-apodus");
    }
  });
});

describe("splitHubSpecies", () => {
  it("never loses or duplicates a species in any hub", () => {
    for (const hub of HUB_IDS) {
      const list = getCatalogSpecies();
      const sample = list.slice(0, 40);
      const sections = splitHubSpecies(hub, sample);
      const ids = sections.flatMap((section) =>
        section.items.map((item) => item.id),
      );
      expect(new Set(ids).size, hub).toBe(ids.length);
      for (const id of ids) expect(sample.map((s) => s.id)).toContain(id);
    }
  });

  it("never returns an empty section", () => {
    for (const hub of HUB_IDS) {
      for (const section of splitHubSpecies(hub, getCatalogSpecies())) {
        expect(section.items.length, `${hub}/${section.key}`).toBeGreaterThan(
          0,
        );
      }
    }
  });

  it("splits snakes into venomous, racers and harmless", () => {
    const sections = splitHubSpecies(
      "snakes",
      getCatalogSpeciesByGroup("snake"),
    );
    expect(sections.map((section) => section.key)).toEqual([
      "venomous",
      "racers",
      "harmless",
    ]);
    const venomous = sections.find((section) => section.key === "venomous");
    expect(venomous?.items.map((item) => item.id)).toContain(
      "macrovipera-lebetina",
    );
  });

  it("puts the featured lizards first and keeps Darevskia together", () => {
    const sections = splitHubSpecies(
      "lizards",
      getCatalogSpeciesByGroup("lizard"),
    );
    expect(sections[0].key).toBe("featured");
    const darevskia = sections.find((section) => section.key === "darevskia");
    expect(darevskia?.items.every((item) => item.genus === "Darevskia")).toBe(
      true,
    );
  });

  it("separates the introduced slider from native turtles", () => {
    const sections = splitHubSpecies(
      "turtles",
      getCatalogSpeciesByGroup("turtle"),
    );
    expect(
      sections.find((section) => section.key === "introduced")?.items,
    ).toEqual([species("trachemys-scripta")]);
    expect(
      sections
        .find((section) => section.key === "native")
        ?.items.some((item) => item.id === "trachemys-scripta"),
    ).toBe(false);
  });

  it("splits amphibians into frogs and newts", () => {
    const sections = splitHubSpecies(
      "amphibians",
      getCatalogSpeciesByGroup("amphibian"),
    );
    expect(sections.map((section) => section.key)).toEqual(["frogs", "newts"]);
  });

  it("uses one section for hubs without sub-groups", () => {
    const birds = getCatalogSpeciesByGroup("bird");
    expect(splitHubSpecies("birds", birds)).toEqual([
      { items: birds, key: "all" },
    ]);
    expect(splitHubSpecies("spiders", [])).toEqual([]);
  });
});

describe("dedupeGuideLinks", () => {
  it("drops repeated pages and repeated species links", () => {
    const links = dedupeGuideLinks([
      { href: "/snakes", key: "snakesHub", kind: "page" },
      { href: "/snakes", key: "snakesHub", kind: "page" },
      { id: "snake", key: "quiz", kind: "quiz" },
      { id: "snake", key: "quiz", kind: "quiz" },
      { id: "snake", key: "quiz", kind: "quiz" },
    ] as never);
    expect(links).toHaveLength(2);
  });
});

describe("related guide cards", () => {
  it("excludes the page you are on but keeps quizzes", () => {
    for (const hub of HUB_IDS) {
      const pages = HUB_CLUSTER_CARDS[hub].filter(
        (card) => card.kind === "page",
      );
      if (pages.length === 0) continue;
      const exclude = (
        pages[0] as unknown as {
          href: Parameters<typeof getHubPageRelatedGuides>[1];
        }
      ).href;
      const related = getHubPageRelatedGuides(hub, exclude);
      expect(
        related.some((card) => card.kind === "page" && card.href === exclude),
        hub,
      ).toBe(false);
      expect(related.filter((card) => card.kind === "quiz").length).toBe(
        HUB_CLUSTER_CARDS[hub].filter((card) => card.kind === "quiz").length,
      );
    }
  });

  it("never lists a guide as related to itself", () => {
    for (const guide of CLUSTER_GUIDE_LIST) {
      const related = getRelatedGuideCards(guide.id);
      expect(
        related.some(
          (card) => card.kind === "page" && card.href === guide.pathname,
        ),
        guide.id,
      ).toBe(false);
    }
  });
});

describe("getSpeciesGuideLinks", () => {
  it("returns nothing for an unknown species", () => {
    expect(getSpeciesGuideLinks("no-such-species")).toEqual([]);
  });

  it("links a venomous snake to the venomous, bite and yard guides", () => {
    expect(keys("macrovipera-lebetina")).toEqual(
      expect.arrayContaining([
        "venomous",
        "index",
        "quiz",
        "identify",
        "bite",
        "yard",
      ]),
    );
    expect(keys("macrovipera-lebetina")).not.toContain("range");
  });

  it("links a harmless snake to identify, yard and range, not bite", () => {
    const harmless = keys("natrix-natrix");
    expect(harmless).toEqual(
      expect.arrayContaining(["index", "quiz", "identify", "yard", "range"]),
    );
    expect(harmless).not.toContain("bite");
    expect(harmless).not.toContain("venomous");
  });

  it("adds the largest-snakes guide exactly for the listed large snakes", () => {
    const large = new Set<string>(LARGE_SNAKE_IDS);
    for (const item of getCatalogSpeciesByGroup("snake")) {
      expect(keys(item.id).includes("largest"), item.id).toBe(
        large.has(item.id),
      );
    }
  });

  it("links Darevskia to its guide but other lizards not", () => {
    const darevskia = getCatalogSpeciesByGroup("lizard").find(
      (item) => item.genus === "Darevskia",
    )!;
    expect(keys(darevskia.id)).toContain("lizardDarevskia");
    expect(keys("pseudopus-apodus")).not.toContain("lizardDarevskia");
    expect(keys("pseudopus-apodus")).toContain("lizardsHub");
  });

  it("splits tortoises from water turtles", () => {
    expect(keys("testudo-graeca")).toContain("turtleLand");
    expect(keys("testudo-graeca")).not.toContain("turtleWater");
    expect(keys("emys-orbicularis")).toContain("turtleWater");
  });

  it("gives every published species at least one guide link", () => {
    for (const item of getCatalogSpecies()) {
      expect(getSpeciesGuideLinks(item.id).length, item.id).toBeGreaterThan(0);
    }
  });

  it("never returns duplicate links for a species", () => {
    for (const item of getCatalogSpecies()) {
      const links = getSpeciesGuideLinks(item.id);
      expect(dedupeGuideLinks(links), item.id).toHaveLength(links.length);
    }
  });
});
