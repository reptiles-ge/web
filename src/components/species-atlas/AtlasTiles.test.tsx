import { fireEvent, render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import { AtlasTiles } from "@/components/species-atlas/AtlasTiles";
import { defaultAtlasFilters } from "@/data/atlasFilters";
import { type AnimalGroup } from "@/data/speciesAtlasMeta";
import { GROUP_HUBS } from "@/lib/groupHubs";

import ka from "../../../messages/ka.json";

const TOTALS: Record<"all" | AnimalGroup, number> = {
  all: 125,
  amphibian: 12,
  bird: 45,
  insect: 0,
  lizard: 29,
  mammal: 17,
  scorpion: 4,
  snake: 22,
  spider: 8,
  turtle: 4,
};

function renderTiles(
  overrides: Partial<Parameters<typeof AtlasTiles>[0]> = {},
) {
  const props = {
    filters: defaultAtlasFilters,
    groupTotals: TOTALS,
    onPickGroup: vi.fn(),
    onPickRegion: vi.fn(),
    onPickVenomous: vi.fn(),
    regionCount: 12,
    venomousCount: 11,
    venomousImage: "https://cdn.reptiles.ge/hero-img.webp",
    ...overrides,
  };
  render(
    <NextIntlClientProvider locale="ka" messages={ka}>
      <AtlasTiles {...props} />
    </NextIntlClientProvider>,
  );
  return props;
}

describe("AtlasTiles", () => {
  it("links every non-empty group to its hub page with a crawlable anchor", () => {
    renderTiles();
    const nav = screen.getByRole("navigation", {
      name: ka.speciesAtlas.hubLinksLabel,
    });
    const hrefs = within(nav)
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));

    expect(hrefs).toEqual([
      GROUP_HUBS.snakes.path,
      GROUP_HUBS.lizards.path,
      GROUP_HUBS.turtles.path,
      GROUP_HUBS.amphibians.path,
      GROUP_HUBS.birds.path,
      GROUP_HUBS.mammals.path,
      GROUP_HUBS.spiders.path,
      GROUP_HUBS.scorpions.path,
    ]);
    expect(
      within(nav).getByRole("link", { name: ka.speciesAtlas.groups.snake }),
    ).toBeInTheDocument();
  });

  it("keeps group tiles as filter buttons", () => {
    const props = renderTiles({
      filters: { ...defaultAtlasFilters, group: "lizard" },
    });
    const lizards = screen.getByRole("button", {
      name: `${ka.speciesAtlas.groups.lizard} 29`,
    });
    expect(lizards).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(lizards);
    expect(props.onPickGroup).toHaveBeenCalledWith("lizard");
  });

  it("places the venomous tile after snakes on mobile and after the groups on desktop", () => {
    renderTiles();
    const venomous = screen.getAllByRole("button", {
      hidden: true,
      name: `${ka.speciesAtlas.danger.venomous} 11`,
    });
    expect(venomous).toHaveLength(2);
    expect(venomous[0]).toHaveClass("lg:hidden");
    expect(venomous[1]).toHaveClass("max-lg:hidden");
    expect(venomous[0]?.previousElementSibling).toHaveAccessibleName(
      `${ka.speciesAtlas.groups.snake} 22`,
    );
  });

  it("shows the region tile on every viewport", () => {
    const props = renderTiles();
    const region = screen.getByRole("button", {
      name: `${ka.speciesAtlas.filters.region} 12`,
    });
    expect(region.className).not.toMatch(/(^|\s)max-lg:hidden/);
    fireEvent.click(region);
    expect(props.onPickRegion).toHaveBeenCalledOnce();
  });
});
