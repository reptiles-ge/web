import { describe, expect, it } from "vitest";

import type { RegionSpeciesCardItem } from "@/data/regions";

import { groupRegionSpecies } from "@/lib/regionSpeciesGroups";

function card(id: string, commonName: string): RegionSpeciesCardItem {
  return {
    commonName,
    id,
    image: `/${id}.jpg`,
    location: "Georgia",
    scientificName: id,
  };
}

describe("groupRegionSpecies", () => {
  it("orders the groups as the atlas does and names each hub", () => {
    const groups = groupRegionSpecies(
      [
        card("mantis-religiosa", "Mantis"),
        card("ursus-arctos", "Brown bear"),
        card("argiope-bruennichi", "Wasp spider"),
        card("emys-orbicularis", "Pond turtle"),
        card("natrix-natrix", "Grass snake"),
      ],
      "en",
    );
    expect(groups.map((item) => [item.group, item.hub])).toEqual([
      ["snake", "snakes"],
      ["turtle", "turtles"],
      ["mammal", "mammals"],
      ["spider", "spiders"],
      ["insect", "insects"],
    ]);
  });

  it("sorts the species of a group by name in the page language", () => {
    const [snakes] = groupRegionSpecies(
      [
        card("natrix-tessellata", "წყლის ანკარა"),
        card("coronella-austriaca", "სპილენძა"),
        card("zamenis-longissimus", "ესკულაპის მცურავი"),
      ],
      "ka",
    );
    expect(snakes?.items.map((item) => item.id)).toEqual([
      "zamenis-longissimus",
      "coronella-austriaca",
      "natrix-tessellata",
    ]);
  });

  it("returns no groups for a region with no species", () => {
    expect(groupRegionSpecies([], "en")).toEqual([]);
  });
});
