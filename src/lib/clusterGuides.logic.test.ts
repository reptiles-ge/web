import { describe, expect, it } from "vitest";

import type { GroupHubId } from "@/lib/groupHubs";

import { getRegionById } from "@/data/regions";
import {
  CATALOG_INDEX_MESSAGE_KEYS,
  CLUSTER_GUIDE_LIST,
  CLUSTER_GUIDES,
  dedupeGuideLinks,
  getHubIndexTitleKey,
  getHubPageRelatedGuides,
  getRegionSnakeSpecies,
  getRelatedGuideCards,
  getSpeciesGuideLinks,
  getViperSpecies,
  hasGuideSpecies,
  HUB_CLUSTER_CARDS,
  HUB_INDEX_PATH,
  isCatalogIndexGuide,
  isEmptyGuidePath,
  isFrogSpecies,
  isLizardSpecies,
  isNewtSpecies,
  LARGE_SNAKE_IDS,
  orderSpeciesByIds,
  splitHubSpecies,
} from "@/lib/clusterGuides";
import { GROUP_HUBS } from "@/lib/groupHubs";

import {
  catalogSpeciesFixture,
  speciesCatalogFixture,
  speciesFixture,
  speciesGroupFixture,
} from "../../tests/fixtures/speciesCatalog";

const HUB_IDS = Object.keys(GROUP_HUBS) as GroupHubId[];
const FIXTURE_GUIDES = CLUSTER_GUIDE_LIST.filter(
  (guide) => guide.parentHub !== "fish",
);

function keys(id: string) {
  return getSpeciesGuideLinks(species(id)).map((link) =>
    link.kind === "page" ? link.key : link.kind,
  );
}

function species(id: string) {
  const item = speciesFixture(id);
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
    for (const guide of FIXTURE_GUIDES) {
      expect(speciesFixture(guide.heroSpeciesId), guide.id).toBeDefined();
      expect(HUB_IDS, guide.id).toContain(guide.parentHub);
    }
  });

  it("matches at least one published species for every guide", () => {
    for (const guide of FIXTURE_GUIDES) {
      expect(
        catalogSpeciesFixture().filter(guide.matches).length,
        guide.id,
      ).toBeGreaterThan(0);
    }
  });

  it("matches no fixture species for the fish index, which has none", () => {
    expect(
      catalogSpeciesFixture().filter(CLUSTER_GUIDES["fish-index"].matches),
    ).toEqual([]);
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

describe("empty collection guides", () => {
  const fish = {
    ...species("natrix-natrix"),
    group: "fish" as const,
    id: CLUSTER_GUIDES["fish-index"].heroSpeciesId,
  };

  it("finds a collection guide empty only when no species matches it", () => {
    const fishIndex = CLUSTER_GUIDES["fish-index"];
    expect(hasGuideSpecies(fishIndex, catalogSpeciesFixture())).toBe(false);
    expect(hasGuideSpecies(fishIndex, [fish])).toBe(true);
    expect(hasGuideSpecies(CLUSTER_GUIDES["lizard-glass"], [])).toBe(true);
  });

  it("finds empty guide paths and ignores paths that are not guides", () => {
    const catalog = catalogSpeciesFixture();
    expect(isEmptyGuidePath("/fish/saxeoebebi", catalog)).toBe(true);
    expect(isEmptyGuidePath("/fish/saxeoebebi", [fish])).toBe(false);
    expect(isEmptyGuidePath("/birds/saxeoebebi", catalog)).toBe(false);
    expect(isEmptyGuidePath("/fish", [])).toBe(false);
  });

  it("gives every catalog index its own message key", () => {
    for (const [id, key] of Object.entries(CATALOG_INDEX_MESSAGE_KEYS)) {
      const guideId = id as keyof typeof CATALOG_INDEX_MESSAGE_KEYS;
      expect(isCatalogIndexGuide(guideId)).toBe(true);
      expect(CLUSTER_GUIDES[guideId].messageKey, id).toBe(key);
      expect(CLUSTER_GUIDES[guideId].schema, id).toBe("collection");
    }
    expect(isCatalogIndexGuide("snake-index")).toBe(false);
  });
});

describe("species predicates", () => {
  it("identifies frogs and newts by id", () => {
    expect(isFrogSpecies("pelophylax-ridibundus")).toBe(true);
    expect(isFrogSpecies("natrix-natrix")).toBe(false);
    expect(isNewtSpecies("natrix-natrix")).toBe(false);
  });

  it("keeps frog and newt sets disjoint", () => {
    for (const item of catalogSpeciesFixture()) {
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
    const vipers = getViperSpecies(speciesGroupFixture("snake"));
    expect(vipers.length).toBeGreaterThan(0);
    for (const item of vipers) expect(item.family).toBe("Viperidae");
  });
});

describe("getRegionSnakeSpecies", () => {
  it("returns only snakes", () => {
    const region = getRegionById("kakheti");
    expect(region).toBeDefined();
    for (const item of getRegionSnakeSpecies(
      region!,
      speciesCatalogFixture("ka"),
    )) {
      expect(item.id).not.toBe("pseudopus-apodus");
    }
  });
});

describe("splitHubSpecies", () => {
  it("never loses or duplicates a species in any hub", () => {
    for (const hub of HUB_IDS) {
      const list = catalogSpeciesFixture();
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
      for (const section of splitHubSpecies(hub, catalogSpeciesFixture())) {
        expect(section.items.length, `${hub}/${section.key}`).toBeGreaterThan(
          0,
        );
      }
    }
  });

  it("splits snakes into venomous, racers and harmless", () => {
    const sections = splitHubSpecies("snakes", speciesGroupFixture("snake"));
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
    const sections = splitHubSpecies("lizards", speciesGroupFixture("lizard"));
    expect(sections[0].key).toBe("featured");
    const darevskia = sections.find((section) => section.key === "darevskia");
    expect(darevskia?.items.every((item) => item.genus === "Darevskia")).toBe(
      true,
    );
  });

  it("separates the introduced slider from native turtles", () => {
    const sections = splitHubSpecies("turtles", speciesGroupFixture("turtle"));
    expect(
      sections
        .find((section) => section.key === "introduced")
        ?.items.map((item) => item.id),
    ).toEqual(["trachemys-scripta"]);
    expect(
      sections
        .find((section) => section.key === "native")
        ?.items.some((item) => item.id === "trachemys-scripta"),
    ).toBe(false);
  });

  it("splits amphibians into frogs and newts", () => {
    const sections = splitHubSpecies(
      "amphibians",
      speciesGroupFixture("amphibian"),
    );
    expect(sections.map((section) => section.key)).toEqual(["frogs", "newts"]);
  });

  it("uses one section for hubs without sub-groups", () => {
    const birds = speciesGroupFixture("bird");
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
    for (const item of speciesGroupFixture("snake")) {
      expect(keys(item.id).includes("largest"), item.id).toBe(
        large.has(item.id),
      );
    }
  });

  it("links Darevskia to its guide but other lizards not", () => {
    const darevskia = speciesGroupFixture("lizard").find(
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
    for (const item of catalogSpeciesFixture()) {
      expect(getSpeciesGuideLinks(item).length, item.id).toBeGreaterThan(0);
    }
  });

  it("never returns duplicate links for a species", () => {
    for (const item of catalogSpeciesFixture()) {
      const links = getSpeciesGuideLinks(item);
      expect(dedupeGuideLinks(links), item.id).toHaveLength(links.length);
    }
  });
});
