import { fireEvent, render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { RegionAtlasEntry } from "@/data/regions";

import { RegionsIndex } from "@/components/RegionsIndex";
import { trackEvent } from "@/lib/analytics";

import en from "../../messages/en.json";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: unknown }) => (
    <a href={JSON.stringify(href)}>{children}</a>
  ),
}));

vi.mock("@/lib/analytics", () => ({ trackEvent: vi.fn() }));

const regions: RegionAtlasEntry[] = [
  {
    biome: "Colchic · coastal",
    description: "Humid forests and the Black Sea coast.",
    groupCounts: [2, 1, 1, 0, 0],
    id: "adjara",
    name: "Adjara",
    speciesCount: 4,
    venomousCount: 1,
  },
  {
    biome: "Alazani · semi-desert",
    description: "The Alazani valley and dry foothills.",
    groupCounts: [3, 2, 1, 2, 1],
    id: "kakheti",
    name: "Kakheti",
    speciesCount: 9,
    venomousCount: 2,
  },
  {
    biome: null,
    description: "Karst hills and the Rioni basin.",
    groupCounts: [1, 0, 0, 0, 0],
    id: "imereti",
    name: "Imereti",
    speciesCount: 1,
    venomousCount: 0,
  },
];

const stats = { regionCount: 12, speciesCount: 105, venomousCount: 10 };

function directoryOrder() {
  return [...document.querySelectorAll("ul li a")].map((link) =>
    link.getAttribute("href"),
  );
}

function regionLink(id: string) {
  return JSON.stringify({ params: { id }, pathname: "/regions/[id]" });
}

function renderIndex(list = regions) {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      <RegionsIndex regions={list} stats={stats} />
    </NextIntlClientProvider>,
  );
}

function selectedPanel() {
  return within(screen.getByRole("complementary", { name: "Selected region" }));
}

beforeEach(() => {
  vi.mocked(trackEvent).mockClear();
});

describe("RegionsIndex", () => {
  it("shows the page title and the three atlas totals", () => {
    renderIndex();

    expect(
      screen.getByRole("heading", { level: 1, name: "Regions of Georgia" }),
    ).toBeInTheDocument();
    const totals = [...document.querySelectorAll("dl")][0];
    expect(totals?.textContent).toBe("Regions12Species105Venomous10");
  });

  it("opens on the region with the most species", () => {
    renderIndex();
    const panel = selectedPanel();

    expect(
      panel.getByRole("heading", { level: 2, name: "Kakheti" }),
    ).toBeInTheDocument();
    expect(panel.getByText("Alazani · semi-desert")).toBeInTheDocument();
    expect(panel.getByText("02")).toBeInTheDocument();
    expect(panel.getByRole("link", { name: "View 9 species" })).toHaveAttribute(
      "href",
      regionLink("kakheti"),
    );
  });

  it("selects a region from its map label and reports it", () => {
    renderIndex();

    fireEvent.click(screen.getByRole("button", { name: "Adjara — 4 species" }));

    const panel = selectedPanel();
    expect(
      panel.getByRole("heading", { level: 2, name: "Adjara" }),
    ).toBeInTheDocument();
    expect(panel.getByRole("link", { name: "View 4 species" })).toHaveAttribute(
      "href",
      regionLink("adjara"),
    );
    expect(
      screen.getByRole("button", { name: "Adjara — 4 species" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(trackEvent).toHaveBeenCalledWith("map_region_select", {
      action: "panel",
      map_context: "region_page",
      region_id: "adjara",
    });
  });

  it("previews a region under the mouse without selecting it", () => {
    renderIndex();
    const label = screen.getByRole("button", { name: "Imereti — 1 species" });

    fireEvent.pointerEnter(label, { pointerType: "mouse" });
    expect(
      selectedPanel().getByRole("heading", { level: 2, name: "Imereti" }),
    ).toBeInTheDocument();
    expect(label).toHaveAttribute("aria-pressed", "false");

    fireEvent.pointerLeave(
      screen.getByRole("button", { name: "Imereti — 1 species" }),
    );
    expect(
      selectedPanel().getByRole("heading", { level: 2, name: "Kakheti" }),
    ).toBeInTheDocument();
    expect(trackEvent).not.toHaveBeenCalled();
  });

  it("ignores touch pointers for the preview", () => {
    renderIndex();

    fireEvent.pointerEnter(
      screen.getByRole("button", { name: "Imereti — 1 species" }),
      { pointerType: "touch" },
    );

    expect(
      selectedPanel().getByRole("heading", { level: 2, name: "Kakheti" }),
    ).toBeInTheDocument();
  });

  it("lists every region and sorts the directory", () => {
    renderIndex();

    expect(directoryOrder()).toEqual(
      ["adjara", "kakheti", "imereti"].map(regionLink),
    );

    fireEvent.click(screen.getByRole("button", { name: "By species" }));
    expect(directoryOrder()).toEqual(
      ["kakheti", "adjara", "imereti"].map(regionLink),
    );
    expect(screen.getByRole("button", { name: "By species" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    fireEvent.click(screen.getByRole("button", { name: "A–Z" }));
    expect(directoryOrder()).toEqual(
      ["adjara", "imereti", "kakheti"].map(regionLink),
    );
  });

  it("selects a region from the comparison and sizes its bars by group", () => {
    renderIndex();
    const row = screen.getByRole("button", {
      name: "Adjara — 4 species; select on the map",
    });

    expect(
      [...row.querySelectorAll<HTMLElement>("span[style]")].map(
        (bar) => bar.style.width,
      ),
    ).toEqual(["22.22%", "11.11%", "11.11%"]);

    fireEvent.click(row);
    expect(row).toHaveAttribute("aria-pressed", "true");
    expect(
      selectedPanel().getByRole("heading", { level: 2, name: "Adjara" }),
    ).toBeInTheDocument();
  });

  it("names the five compared groups in the legend", () => {
    renderIndex();
    const legend = within(screen.getByRole("list", { name: "Legend" }));

    expect(
      legend.getAllByRole("listitem").map((item) => item.textContent),
    ).toEqual([
      "Snakes",
      "Lizards and turtles",
      "Amphibians",
      "Birds",
      "Other",
    ]);
  });

  it("links to the group indexes and the venomous snakes guide", () => {
    renderIndex();

    expect(screen.getByRole("link", { name: "Snake range" })).toHaveAttribute(
      "href",
      JSON.stringify("/snakes/gavrtseleba"),
    );
    expect(
      screen
        .getAllByRole("link", { name: /Venomous snakes of Georgia/ })
        .map((link) => link.getAttribute("href")),
    ).toEqual([
      JSON.stringify("/venomous-snakes"),
      JSON.stringify("/venomous-snakes"),
    ]);
  });

  it("renders nothing without regions", () => {
    const { container } = renderIndex([]);

    expect(container).toBeEmptyDOMElement();
  });
});
