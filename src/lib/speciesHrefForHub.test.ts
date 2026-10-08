import { describe, expect, it } from "vitest";

import { speciesHrefForHub } from "@/lib/localeSwitch";

describe("speciesHrefForHub", () => {
  it.each([
    ["birds", "/birds/[slug]"],
    ["insects", "/insects/[slug]"],
    ["lizards", "/lizards/[slug]"],
    ["mammals", "/mammals/[slug]"],
    ["scorpions", "/scorpions/[slug]"],
    ["snakes", "/snakes/[slug]"],
    ["spiders", "/spiders/[slug]"],
    ["turtles", "/turtles/[slug]"],
    ["amphibians", "/amphibians/[slug]"],
  ])("maps %s to %s", (hub, pathname) => {
    expect(speciesHrefForHub(hub, "some-slug")).toEqual({
      params: { slug: "some-slug" },
      pathname,
    });
  });

  it("falls back to amphibians for an unknown or missing hub", () => {
    expect(speciesHrefForHub(undefined, "x").pathname).toBe(
      "/amphibians/[slug]",
    );
    expect(speciesHrefForHub("unknown", "x").pathname).toBe(
      "/amphibians/[slug]",
    );
  });
});
