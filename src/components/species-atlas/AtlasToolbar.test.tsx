import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import { AtlasToolbar } from "@/components/species-atlas/AtlasToolbar";
import { type AtlasFacets, defaultAtlasFilters } from "@/data/atlasFilters";

import ka from "../../../messages/ka.json";

const facets = {
  danger: { all: 145, harmless: 68, venomous: 11 },
  group: { all: 145, snake: 22 },
  habitat: { all: 145 },
  region: { all: 145 },
} as unknown as AtlasFacets;

function renderToolbar(query = "") {
  const props = {
    facetCount: 0,
    facets,
    filters: { ...defaultAtlasFilters, query },
    onChangeSort: vi.fn(),
    onChangeView: vi.fn(),
    onOpenFilters: vi.fn(),
    onRegionMenuChange: vi.fn(),
    onUpdateFilter: vi.fn(),
    regionMenuOpen: false,
    regionOptions: [{ count: 1, id: "all", label: "all" }],
    sort: "featured" as const,
    view: "grid" as const,
  };
  const { container } = render(
    <NextIntlClientProvider locale="ka" messages={ka}>
      <AtlasToolbar {...props} />
    </NextIntlClientProvider>,
  );
  return { container, props };
}

describe("AtlasToolbar", () => {
  it("wraps the search field in a native search landmark", () => {
    const { container, props } = renderToolbar();
    const search = container.querySelector("search");
    expect(search).not.toBeNull();
    expect(search?.getAttribute("role")).toBeNull();
    fireEvent.change(screen.getByLabelText(ka.speciesAtlas.searchPlaceholder), {
      target: { value: "გიურზა" },
    });
    expect(props.onUpdateFilter).toHaveBeenCalledWith("query", "გიურზა");
  });

  it("exposes the search as the search_species WebMCP tool", () => {
    const { container } = renderToolbar();
    const form = container.querySelector("form");
    expect(form).toHaveAttribute("toolname", "search_species");
    expect(form).toHaveAttribute("tooldescription", ka.search.toolDescription);
    expect(
      screen.getByLabelText(ka.speciesAtlas.searchPlaceholder),
    ).toHaveAttribute("name", "q");
    expect(
      screen.getByLabelText(ka.speciesAtlas.searchPlaceholder),
    ).toHaveAttribute("toolparamdescription", ka.search.toolParamDescription);
  });

  it("submits only for an agent, not on a visitor's Enter", () => {
    const { container } = renderToolbar("გიურზა");
    const form = container.querySelector("form")!;
    const visitor = new Event("submit", { bubbles: true, cancelable: true });
    form.dispatchEvent(visitor);
    expect(visitor.defaultPrevented).toBe(true);
    const agent = Object.assign(
      new Event("submit", { bubbles: true, cancelable: true }),
      { agentInvoked: true },
    );
    form.dispatchEvent(agent);
    expect(agent.defaultPrevented).toBe(false);
  });

  it("clears the query from the clear button", () => {
    const { props } = renderToolbar("გველი");
    fireEvent.click(
      screen.getByRole("button", { name: ka.speciesAtlas.clearSearch }),
    );
    expect(props.onUpdateFilter).toHaveBeenCalledWith("query", "");
  });

  it("filters by group and switches the view", () => {
    const { props } = renderToolbar();
    const snakes = screen.getByRole("button", {
      name: new RegExp(`^${ka.speciesAtlas.groups.snake}`),
    });
    expect(snakes).toHaveTextContent("22");
    fireEvent.click(snakes);
    expect(props.onUpdateFilter).toHaveBeenCalledWith("group", "snake");
    fireEvent.click(
      screen.getByRole("button", { name: ka.speciesAtlas.view.list }),
    );
    expect(props.onChangeView).toHaveBeenCalledWith("list");
  });
});
