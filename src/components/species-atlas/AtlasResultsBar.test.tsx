import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import {
  AtlasEmptyPanel,
  AtlasResultsBar,
} from "@/components/species-atlas/AtlasResultsBar";

import ka from "../../../messages/ka.json";

function wrap(node: React.ReactNode) {
  return render(
    <NextIntlClientProvider locale="ka" messages={ka}>
      {node}
    </NextIntlClientProvider>,
  );
}

describe("AtlasResultsBar", () => {
  it("removes a filter token and resets all filters", () => {
    const clear = vi.fn();
    const onResetFilters = vi.fn();
    wrap(
      <AtlasResultsBar
        count={11}
        hasActiveFilters
        onChangeSort={vi.fn()}
        onResetFilters={onResetFilters}
        sort="featured"
        tokens={[{ clear, key: "danger", label: "შხამიანი" }]}
      />,
    );
    const remove = screen.getAllByRole("button", { name: /შხამიანი/ });
    expect(remove).toHaveLength(2);
    fireEvent.click(remove[0] as HTMLElement);
    expect(clear).toHaveBeenCalledOnce();
    fireEvent.click(
      screen.getByRole("button", { name: ka.speciesAtlas.resetFilters }),
    );
    expect(onResetFilters).toHaveBeenCalledOnce();
  });

  it("cycles the mobile sort order", () => {
    const onChangeSort = vi.fn();
    wrap(
      <AtlasResultsBar
        count={145}
        hasActiveFilters={false}
        onChangeSort={onChangeSort}
        onResetFilters={vi.fn()}
        sort="range"
        tokens={[]}
      />,
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: `${ka.speciesAtlas.sortLabel}: ${ka.speciesAtlas.sort.range}`,
      }),
    );
    expect(onChangeSort).toHaveBeenCalledWith("featured");
  });
});

describe("AtlasEmptyPanel", () => {
  it("names the group when one is selected", () => {
    wrap(<AtlasEmptyPanel group="turtle" onReset={vi.fn()} />);
    expect(
      screen.getByRole("heading", {
        name: new RegExp(ka.speciesAtlas.groups.turtle),
      }),
    ).toBeInTheDocument();
  });
});
