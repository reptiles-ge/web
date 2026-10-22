import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { beforeAll, describe, expect, it, vi } from "vitest";

import type { SpeciesListItem } from "@/data/speciesListItem";

import { LocaleSwitchProvider } from "@/components/LocaleSwitchProvider";
import {
  AtlasSpeciesCard,
  AtlasSpeciesRow,
} from "@/components/species-atlas/AtlasSpeciesCard";
import { getSpeciesAtlasMeta } from "@/data/speciesAtlasMeta";
import { getAtlasListItems } from "@/lib/atlasList";
import { getLocaleSwitchIndex } from "@/lib/localeSwitchData";

import ka from "../../../messages/ka.json";
import { speciesCatalogFixture } from "../../../tests/fixtures/speciesCatalog";

vi.mock("@/lib/speciesCatalogApi", () => ({
  getSpeciesCatalog: async (locale: "en" | "ka" | "ru" | "tr") =>
    speciesCatalogFixture(locale),
}));

let items: SpeciesListItem[];

beforeAll(async () => {
  items = await getAtlasListItems("ka");
});

function renderWith(node: React.ReactNode) {
  render(
    <NextIntlClientProvider locale="ka" messages={ka}>
      <LocaleSwitchProvider
        index={getLocaleSwitchIndex(speciesCatalogFixture("ka"))}
      >
        {node}
      </LocaleSwitchProvider>
    </NextIntlClientProvider>,
  );
}

function species(id: string) {
  const item = items.find((entry) => entry.id === id);
  if (!item) throw new Error(`missing ${id}`);
  return item;
}

describe("AtlasSpeciesCard", () => {
  it("names the link by common name, scientific name and risk only", () => {
    const viper = species("macrovipera-lebetina");
    renderWith(
      <AtlasSpeciesCard locale="ka" regionNames={[]} species={viper} />,
    );
    expect(screen.getByRole("link")).toHaveAccessibleName(
      `${viper.commonName} ${viper.scientificName} ${ka.danger.High}`,
    );
  });

  it("leaves the risk out of the name when the group has no risk scale", () => {
    const bird = items.find(
      (entry) => getSpeciesAtlasMeta(entry.id).group === "bird",
    );
    expect(bird).toBeDefined();
    if (!bird) return;
    renderWith(
      <AtlasSpeciesCard locale="ka" regionNames={[]} species={bird} />,
    );
    expect(screen.getByRole("link")).toHaveAccessibleName(
      `${bird.commonName} ${bird.scientificName}`,
    );
  });

  it("does not request any card image at high priority", () => {
    renderWith(
      <AtlasSpeciesCard
        locale="ka"
        regionNames={[]}
        species={species("macrovipera-lebetina")}
      />,
    );
    const image = screen.getByRole("link").querySelector("img");
    expect(image).toHaveAttribute("loading", "lazy");
    expect(image).not.toHaveAttribute("fetchpriority", "high");
  });

  it("uses the same concise name in the list view", () => {
    const viper = species("macrovipera-lebetina");
    renderWith(
      <AtlasSpeciesRow locale="ka" regionNames={[]} species={viper} />,
    );
    expect(screen.getByRole("link")).toHaveAccessibleName(
      `${viper.commonName} ${viper.scientificName} ${ka.danger.High}`,
    );
  });

  it("lists the first two region names and counts the rest", () => {
    renderWith(
      <AtlasSpeciesRow
        locale="ka"
        regionNames={["კახეთი", "იმერეთი", "გურია"]}
        species={species("macrovipera-lebetina")}
      />,
    );
    expect(screen.getByText("კახეთი, იმერეთი +1")).toBeInTheDocument();
  });

  it("shows the pending range text when no region is listed", () => {
    renderWith(
      <AtlasSpeciesRow
        locale="ka"
        regionNames={[]}
        species={species("macrovipera-lebetina")}
      />,
    );
    expect(screen.getByText(ka.speciesAtlas.rangePending)).toBeInTheDocument();
  });
});
