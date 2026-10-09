import { fireEvent, render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";

import { GroupHubSpeciesCatalog } from "@/components/GroupHubSpeciesCatalog";
import { type HubCatalogItem, matchesHubCatalog } from "@/lib/groupHubCatalog";

import ka from "../../messages/ka.json";

function item(
  id: string,
  name: string,
  risk: HubCatalogItem["risk"],
): HubCatalogItem {
  return {
    alt: name,
    href: { params: { slug: id }, pathname: "/snakes/[slug]" },
    id,
    image: `https://cdn.reptiles.ge/${id}.jpg`,
    name,
    risk,
    scientificName: `Genus ${id}`,
  };
}

const ITEMS: HubCatalogItem[] = [
  item("a", "გიურზა", "High"),
  item("b", "ველის გველგესლა", "Moderate"),
  ...Array.from({ length: 18 }, (_, index) =>
    item(`h${index}`, `ანკარა ${index}`, "Harmless"),
  ),
  item("u", "უცნობი", null),
];

function renderCatalog(items = ITEMS, showRisk = true) {
  render(
    <NextIntlClientProvider locale="ka" messages={ka}>
      <GroupHubSpeciesCatalog
        allLabel="ყველა"
        group="snake"
        items={items}
        showRisk={showRisk}
      />
    </NextIntlClientProvider>,
  );
}

describe("matchesHubCatalog", () => {
  it("filters by risk bucket and by common or scientific name", () => {
    const viper = item("vipera", "ველის გველგესლა", "Moderate");
    expect(matchesHubCatalog(viper, "all", "")).toBe(true);
    expect(matchesHubCatalog(viper, "High", "")).toBe(false);
    expect(matchesHubCatalog(viper, "Moderate", " გველგესლა ")).toBe(true);
    expect(matchesHubCatalog(viper, "all", "GENUS VIPERA")).toBe(true);
    expect(matchesHubCatalog(item("x", "x", null), "unrated", "")).toBe(true);
  });
});

describe("GroupHubSpeciesCatalog", () => {
  it("shows one chip per present risk level with counts", () => {
    renderCatalog();
    const group = screen.getByRole("group");
    const chips = within(group)
      .getAllByRole("button")
      .map((button) => button.textContent);
    expect(chips).toEqual([
      "ყველა21",
      "მაღალი რისკი1",
      "საშუალო რისკი1",
      "უვნებელი18",
      "მითითებული არ არის1",
    ]);
  });

  it("pages the full list and reveals everything on demand", () => {
    renderCatalog();
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(21);
    expect(items[8].className).toContain("max-lg:hidden");
    expect(items[16].className).toContain("lg:hidden");
    fireEvent.click(screen.getByRole("button", { expanded: false }));
    expect(
      screen
        .getAllByRole("listitem")
        .every((li) => !li.className.includes("hidden")),
    ).toBe(true);
  });

  it("narrows by filter and search without paging, and reports no match", () => {
    renderCatalog();
    fireEvent.click(screen.getByRole("button", { name: /მაღალი რისკი/ }));
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(
      screen.getByRole("button", { name: /მაღალი რისკი/ }),
    ).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: /ყველა/ }));
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "ანკარა 1" },
    });
    const names = screen.getAllByRole("listitem").map((li) => li.textContent);
    expect(names.every((name) => name?.includes("ანკარა 1"))).toBe(true);
    expect(screen.queryByRole("button", { expanded: false })).toBeNull();
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "zzz" },
    });
    expect(screen.getByRole("status")).toHaveTextContent(
      ka.groupHubShared.catalog.noResults,
    );
  });

  it("hides risk chips and labels for groups without a risk scale", () => {
    renderCatalog(ITEMS.slice(0, 4), false);
    expect(screen.queryByRole("group")).toBeNull();
    expect(screen.queryByText("მაღალი რისკი")).toBeNull();
    expect(screen.queryByRole("button", { expanded: false })).toBeNull();
  });
});
