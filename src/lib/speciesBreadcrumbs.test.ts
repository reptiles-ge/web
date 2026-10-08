import { describe, expect, it } from "vitest";

import { getSpeciesById } from "@/data/species";
import {
  buildSpeciesBreadcrumbs,
  getSpeciesParentHub,
} from "@/lib/speciesBreadcrumbs";

function species(id: string) {
  const item = getSpeciesById(id);
  if (!item) throw new Error(`Missing species ${id}`);
  return item;
}

const labels = {
  groupLabel: "Snakes",
  homeLabel: "Home",
  indexLabel: "Species",
  venomousLabel: "Venomous",
};

describe("getSpeciesParentHub", () => {
  it("puts a venomous snake under the venomous guide", () => {
    expect(getSpeciesParentHub(species("macrovipera-lebetina"))).toEqual({
      href: "/venomous-snakes",
      hubId: "snakes",
      kind: "venomous",
    });
  });

  it("puts a harmless snake under its group hub", () => {
    expect(getSpeciesParentHub(species("natrix-natrix"))).toMatchObject({
      href: "/snakes",
      hubId: "snakes",
      kind: "group",
    });
  });

  it("puts a non-snake under its own hub", () => {
    expect(getSpeciesParentHub(species("testudo-graeca")).hubId).toBe(
      "turtles",
    );
  });
});

describe("buildSpeciesBreadcrumbs", () => {
  it("ends with the current species, without a link", () => {
    const crumbs = buildSpeciesBreadcrumbs({
      ...labels,
      species: species("macrovipera-lebetina"),
    });
    const last = crumbs.at(-1);
    expect(last?.href).toBeUndefined();
    expect(last?.name).toBeTruthy();
  });

  it("goes Home > group > venomous guide for a venomous snake", () => {
    const crumbs = buildSpeciesBreadcrumbs({
      ...labels,
      species: species("macrovipera-lebetina"),
    });
    expect(crumbs.map((crumb) => crumb.href)).toEqual([
      "/",
      "/snakes",
      "/venomous-snakes",
      undefined,
    ]);
  });

  it("starts with Home and the group for any species", () => {
    const crumbs = buildSpeciesBreadcrumbs({
      ...labels,
      species: species("testudo-graeca"),
    });
    expect(crumbs[0]).toEqual({ href: "/", name: "Home" });
    expect(crumbs[1]).toEqual({ href: "/turtles", name: "Snakes" });
  });
});
