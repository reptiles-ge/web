import { fireEvent, render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RegionProfile } from "@/components/RegionProfile";
import { getLocalizedRegionContent } from "@/data/regionContent";
import {
  getRegionById,
  getRegionSpecies,
  isRegionCardVenomous,
  type RegionSpeciesCardItem,
  toRegionSpeciesCard,
} from "@/data/regions";
import { trackEvent } from "@/lib/analytics";
import { groupRegionSpecies } from "@/lib/regionSpeciesGroups";

import en from "../../messages/en.json";
import {
  catalogSpeciesFixture,
  localizedFixture,
} from "../../tests/fixtures/speciesCatalog";

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    children,
    className,
    href,
    onClick,
  }: {
    children: React.ReactNode;
    className?: string;
    href: unknown;
    onClick?: () => void;
  }) => (
    <a
      className={className}
      href={typeof href === "string" ? href : JSON.stringify(href)}
      onClick={onClick}
    >
      {children}
    </a>
  ),
}));

vi.mock("@/components/LocaleSwitchProvider", () => ({
  useSpeciesHref: (id: string) => `/species/${id}`,
}));

vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
  trackSpeciesClick: vi.fn(),
}));

const region = getRegionById("kakheti")!;
const species = getRegionSpecies(
  region,
  catalogSpeciesFixture().map((item) => localizedFixture(item, "en")),
).map((item) => toRegionSpeciesCard(item));
const venomous = species.filter(isRegionCardVenomous);
const groups = groupRegionSpecies(species, "en");
const summary = ["First summary paragraph.", "Second summary paragraph."];
const content = getLocalizedRegionContent("kakheti", "en");

function regionLink(id: string) {
  return JSON.stringify({ params: { id }, pathname: "/regions/[id]" });
}

function renderProfile(
  props: Partial<React.ComponentProps<typeof RegionProfile>> = {},
) {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      <RegionProfile
        content={content}
        region={region}
        species={species}
        summary={summary}
        venomous={venomous}
        {...props}
      />
    </NextIntlClientProvider>,
  );
}

function speciesRows() {
  const list = screen
    .getByRole("heading", { level: 2, name: /species in Kakheti/ })
    .closest("section")!;
  return [...list.querySelectorAll("ul a")].map((link) =>
    link.getAttribute("href"),
  );
}

beforeEach(() => {
  vi.mocked(trackEvent).mockClear();
});

describe("RegionProfile hero", () => {
  it("names the region in the h1 and keeps the species line under it", () => {
    renderProfile();
    expect(
      screen.getByRole("heading", { level: 1, name: "Kakheti" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Species recorded in Kakheti").tagName).toBe("P");
    expect(screen.getByText(content.overview!)).toBeInTheDocument();
    expect(screen.getByText(content.biome!)).toBeInTheDocument();
  });

  it("links the breadcrumb to the home page and the regions index", () => {
    renderProfile();
    const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(
      within(breadcrumb).getByRole("link", { name: "Home" }),
    ).toHaveAttribute("href", "/");
    expect(
      within(breadcrumb).getByRole("link", { name: "Regions" }),
    ).toHaveAttribute("href", "/regions");
    expect(within(breadcrumb).getByText("Kakheti")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("counts species, venomous species, groups and habitats from the data", () => {
    const { container } = renderProfile();
    const stats = [...container.querySelectorAll("dl > div")].map((item) => [
      item.querySelector("dt")?.textContent,
      item.querySelector("dd")?.textContent,
    ]);
    expect(stats).toEqual([
      ["Species", String(species.length)],
      ["Venomous", String(venomous.length)],
      ["Groups", String(groups.length)],
      ["Habitats", String(content.habitats.length)],
    ]);
  });

  it("draws every region on the map and labels it for the region", () => {
    const { container } = renderProfile();
    const figure = screen.getByRole("figure", {
      name: "Kakheti on the map of Georgia",
    });
    expect(
      figure.querySelectorAll("svg")[0]?.querySelectorAll("use"),
    ).toHaveLength(12);
    expect(container.querySelector("#region-shape-kakheti")).not.toBeNull();
    expect(
      within(figure).getByRole("link", { name: "All regions" }),
    ).toHaveAttribute("href", "/regions");
  });

  it("jumps from the hero to the species and venomous sections", () => {
    renderProfile();
    expect(
      screen.getByRole("link", { name: `View ${species.length} species` }),
    ).toHaveAttribute("href", "#species");
    expect(
      screen.getByRole("link", { name: "Venomous snakes" }),
    ).toHaveAttribute("href", "#venomous");
  });
});

describe("RegionProfile section tabs", () => {
  it("links every tab to a section that exists on the page", () => {
    renderProfile({
      news: (
        <section>
          <h2 id="news">Related news</h2>
        </section>
      ),
      newsCount: 3,
    });
    const tabs = within(
      screen.getByRole("navigation", { name: "Page sections" }),
    ).getAllByRole("link");
    expect(tabs.map((tab) => tab.getAttribute("href"))).toEqual([
      "#venomous",
      "#species",
      "#habitats",
      "#faq",
      "#news",
      "#related",
    ]);
    for (const tab of tabs) {
      expect(
        document.getElementById(tab.getAttribute("href")!.slice(1)),
        tab.textContent,
      ).not.toBeNull();
    }
    expect(tabs[0]).toHaveAttribute("aria-current", "location");
    expect(tabs[0]).toHaveTextContent(`Venomous${venomous.length}`);
    expect(tabs[4]).toHaveTextContent("News3");
  });

  it("leaves out the tabs and sections a region has nothing for", () => {
    renderProfile({
      content: { ...content, faq: [], related: [] },
      venomous: [],
    });
    const tabs = within(
      screen.getByRole("navigation", { name: "Page sections" }),
    ).getAllByRole("link");
    expect(tabs.map((tab) => tab.getAttribute("href"))).toEqual([
      "#species",
      "#habitats",
    ]);
    expect(
      screen.queryByRole("heading", { name: /Venomous snakes in/ }),
    ).toBeNull();
    expect(screen.queryByRole("link", { name: "Venomous snakes" })).toBeNull();
    expect(
      screen.queryByRole("heading", { name: /^Frequently asked questions/ }),
    ).toBeNull();
    expect(
      screen.queryByRole("heading", { name: /^Related regions/ }),
    ).toBeNull();
  });
});

describe("RegionProfile outline", () => {
  it("keeps species names out of the heading outline", () => {
    const { container } = renderProfile();
    const headings = [...container.querySelectorAll("h1, h2, h3, h4")]
      .filter((node) => !node.querySelector("button[aria-expanded]"))
      .map((node) => node.textContent);
    for (const item of species) {
      expect(headings, item.id).not.toContain(item.commonName);
    }
    expect(headings).toHaveLength(7 + groups.length);
    expect(screen.getAllByText(species[0]!.commonName).length).toBeGreaterThan(
      0,
    );
  });

  it("links the region to the snake range guide", () => {
    renderProfile();
    expect(
      screen.getByRole("link", {
        name: "Where snakes occur in Georgia — map of 12 regions",
      }),
    ).toHaveAttribute("href", expect.stringContaining("/snakes/gavrtseleba"));
  });

  it("renders the summary under its own heading", () => {
    renderProfile();
    const heading = screen.getByRole("heading", {
      level: 2,
      name: /Kakheti at a glance/,
    });
    expect(heading.id).toBe("summary");
    for (const paragraph of summary) {
      expect(screen.getByText(paragraph).tagName).toBe("P");
    }
  });
});

describe("RegionProfile venomous section", () => {
  it("lists high-risk species first, each with its risk level and profile link", () => {
    renderProfile();
    const section = screen
      .getByRole("heading", { level: 2, name: /Venomous snakes in Kakheti/ })
      .closest("section")!;
    const cards = [...section.querySelectorAll("ul a")];
    const expected = venomous.toSorted(
      (a, b) => Number(b.danger === "High") - Number(a.danger === "High"),
    );
    expect(cards.map((card) => card.getAttribute("href"))).toEqual(
      expected.map((item) => `/species/${item.id}`),
    );
    expect(expected[0]?.danger).toBe("High");
    expect(
      within(cards[0] as HTMLElement).getAllByText("High risk").length,
    ).toBeGreaterThan(0);
    expect(
      within(section).getAllByRole("link", {
        name: "Snake bite — what to do",
      })[0],
    ).toHaveAttribute("href", "/snakes/gvelis-nakbeni");
  });
});

describe("RegionProfile species list", () => {
  it("groups every species under its animal group, in alphabetical order", () => {
    renderProfile();
    expect(speciesRows()).toEqual(
      groups.flatMap((group) =>
        group.items.map((item) => `/species/${item.id}`),
      ),
    );
    for (const group of groups) {
      const names = group.items.map((item) => item.commonName);
      expect(names).toEqual(names.toSorted((a, b) => a.localeCompare(b, "en")));
    }
    expect(
      screen
        .getAllByRole("heading", { level: 3 })
        .filter((node) => !node.querySelector("button"))
        .map((node) => node.textContent),
    ).toEqual(groups.map((group) => en.nav[group.hub]));
  });

  it("filters the list by group and reports the choice", () => {
    renderProfile();
    const filter = screen.getByRole("group", {
      name: "Filter species by group",
    });
    const buttons = within(filter).getAllByRole("button");
    expect(buttons.map((button) => button.textContent)).toEqual([
      `All${species.length}`,
      ...groups.map((group) => `${en.nav[group.hub]}${group.items.length}`),
    ]);
    expect(buttons[0]).toHaveAttribute("aria-pressed", "true");

    const target = groups[1]!;
    fireEvent.click(buttons[2]!);
    expect(buttons[2]).toHaveAttribute("aria-pressed", "true");
    expect(buttons[0]).toHaveAttribute("aria-pressed", "false");
    expect(speciesRows()).toEqual(
      target.items.map((item) => `/species/${item.id}`),
    );
    expect(trackEvent).toHaveBeenCalledWith("region_species_filter", {
      group_filter: target.group,
      page_type: "region",
      result_count: target.items.length,
    });

    fireEvent.click(buttons[2]!);
    expect(trackEvent).toHaveBeenCalledTimes(1);

    fireEvent.click(buttons[0]!);
    expect(speciesRows()).toHaveLength(species.length);
  });

  it("tags venomous and introduced species and no others", () => {
    const [first, second, third] = species as [
      RegionSpeciesCardItem,
      RegionSpeciesCardItem,
      RegionSpeciesCardItem,
    ];
    const list: RegionSpeciesCardItem[] = [
      { ...first, danger: "Moderate" },
      { ...second, danger: "Harmless", introduced: true },
      { ...third, danger: "Harmless" },
    ];
    renderProfile({ species: list, venomous: [] });
    const rows = new Map(
      [...document.querySelectorAll('a[href^="/species/"]')].map((row) => [
        row.getAttribute("href"),
        row,
      ]),
    );
    expect(rows.get(`/species/${first.id}`)).toHaveTextContent("Moderate risk");
    expect(rows.get(`/species/${second.id}`)).toHaveTextContent("Introduced");
    expect(rows.get(`/species/${third.id}`)?.textContent).toBe(
      `${third.commonName}${third.scientificName}`,
    );
  });

  it("says so when a region has no species yet", () => {
    renderProfile({ species: [], venomous: [] });
    expect(
      screen.getByText("Species data for this region has not been added yet."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("group")).toBeNull();
  });
});

describe("RegionProfile habitats", () => {
  it("lists each habitat without its final stop, next to the region note", () => {
    renderProfile({
      content: {
        ...content,
        habitatKinds: ["water", null],
        habitats: ["Black Sea coast.", "Caves"],
      },
    });
    const section = screen
      .getByRole("heading", { level: 2, name: /^Where they live/ })
      .closest("section")!;
    expect(
      [...section.querySelectorAll("li")].map((item) => item.textContent),
    ).toEqual(["Black Sea coast", "Caves"]);
    expect(
      within(section).getByText(region.description.en),
    ).toBeInTheDocument();
  });
});

describe("RegionProfile FAQ", () => {
  it("marks every question as a level-3 heading", () => {
    renderProfile();
    expect(content.faq.length).toBeGreaterThan(0);
    for (const item of content.faq) {
      expect(
        screen.getByRole("heading", { level: 3, name: item.question }),
      ).toBeInTheDocument();
    }
  });

  it("opens one answer at a time and reports the opened question", () => {
    renderProfile();
    const [first, second] = content.faq.map((item) =>
      screen.getByRole("button", { name: item.question }),
    );
    expect(first).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(second!);
    expect(first).toHaveAttribute("aria-expanded", "false");
    expect(second).toHaveAttribute("aria-expanded", "true");
    expect(trackEvent).toHaveBeenCalledWith("faq_open", {
      entity_id: "kakheti",
      faq_index: 1,
      page_type: "region",
    });
  });

  it("shows the attribution beside the questions", () => {
    renderProfile({ attribution: <p>Prepared by the editors.</p> });
    const section = screen
      .getByRole("heading", { level: 2, name: /^Frequently asked questions/ })
      .closest("section")!;
    expect(
      within(section).getByText("Prepared by the editors."),
    ).toBeInTheDocument();
  });
});

describe("RegionProfile related regions", () => {
  it("links each related region with its species count and the full list", () => {
    renderProfile();
    const section = screen
      .getByRole("heading", { level: 2, name: /^Related regions/ })
      .closest("section")!;
    expect(content.related.length).toBeGreaterThan(0);
    for (const item of content.related) {
      const card = section.querySelector(`a[href='${regionLink(item.id)}']`);
      expect(card, item.id).toHaveTextContent(item.name);
      expect(card, item.id).toHaveTextContent(String(item.speciesCount));
    }
    for (const link of within(section).getAllByRole("link", {
      name: "All 12 regions",
    })) {
      expect(link).toHaveAttribute("href", "/regions");
    }
  });
});
