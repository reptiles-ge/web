import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import { AtlasToolbar } from "@/components/species-atlas/AtlasToolbar";
import { defaultAtlasFilters } from "@/data/atlasFilters";
import { getAtlasListItems } from "@/lib/atlasList";

import ka from "../../../messages/ka.json";

function renderToolbar(query = "") {
  const props = {
    catalog: getAtlasListItems("ka"),
    facetCount: 0,
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
    fireEvent.click(snakes);
    expect(props.onUpdateFilter).toHaveBeenCalledWith("group", "snake");
    fireEvent.click(
      screen.getByRole("button", { name: ka.speciesAtlas.view.list }),
    );
    expect(props.onChangeView).toHaveBeenCalledWith("list");
  });
});
