import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import { RegionProfile } from "@/components/RegionProfile";
import { RegionSpeciesCard } from "@/components/RegionSpeciesCard";
import {
  getRegionById,
  getRegionSpecies,
  isRegionCardVenomous,
  toRegionSpeciesCard,
} from "@/data/regions";

import en from "../../messages/en.json";

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    children,
    className,
    href,
  }: {
    children: React.ReactNode;
    className?: string;
    href: unknown;
  }) => (
    <a className={className} href={JSON.stringify(href)}>
      {children}
    </a>
  ),
}));

vi.mock("@/components/LocaleSwitchProvider", () => ({
  useSpeciesHref: (id: string) => `/species/${id}`,
}));

vi.mock("@/components/map/GeorgiaMap", () => ({
  GeorgiaMap: () => <div data-testid="map" />,
}));

const region = getRegionById("kakheti")!;
const species = getRegionSpecies(region).map((item) =>
  toRegionSpeciesCard(item, "en"),
);
const venomous = species.filter(isRegionCardVenomous);
const summary = ["First summary paragraph.", "Second summary paragraph."];

function renderWithMessages(node: React.ReactNode) {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      {node}
    </NextIntlClientProvider>,
  );
}

describe("RegionProfile outline", () => {
  it("keeps species names out of the heading outline", () => {
    const { container } = renderWithMessages(
      <RegionProfile
        editable={false}
        region={region}
        species={species}
        summary={summary}
        venomous={venomous}
      />,
    );
    const headings = [...container.querySelectorAll("h1, h2, h3, h4")].map(
      (node) => node.textContent ?? "",
    );
    for (const item of species) {
      expect(headings, item.id).not.toContain(item.commonName);
    }
    expect(headings.length).toBeLessThan(15);
    expect(screen.getAllByText(species[0]!.commonName).length).toBeGreaterThan(
      0,
    );
  });

  it("renders the summary under its own heading", () => {
    renderWithMessages(
      <RegionProfile
        editable={false}
        region={region}
        species={species}
        summary={summary}
        venomous={venomous}
      />,
    );
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

describe("RegionSpeciesCard", () => {
  it("renders the name as text, not a heading, with location or risk", () => {
    const item = venomous[0]!;
    const { container, rerender } = renderWithMessages(
      <RegionSpeciesCard species={item} />,
    );
    expect(container.querySelector("h1, h2, h3, h4, h5, h6")).toBeNull();
    expect(screen.getByText(item.commonName).tagName).toBe("P");
    expect(screen.getByText(item.location)).toBeTruthy();

    rerender(
      <NextIntlClientProvider locale="en" messages={en}>
        <RegionSpeciesCard showDanger species={item} />
      </NextIntlClientProvider>,
    );
    expect(screen.queryByText(item.location)).toBeNull();
    expect(container.querySelector("a")?.getAttribute("href")).toBe(
      JSON.stringify(`/species/${item.id}`),
    );
  });
});
