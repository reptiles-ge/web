import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";

import { LocaleSwitchProvider } from "@/components/LocaleSwitchProvider";
import {
  AtlasSpeciesCard,
  AtlasSpeciesRow,
} from "@/components/species-atlas/AtlasSpeciesCard";
import { getSpeciesAtlasMeta } from "@/data/speciesAtlasMeta";
import { getAtlasListItems } from "@/lib/atlasList";

import ka from "../../../messages/ka.json";

function renderWith(node: React.ReactNode) {
  render(
    <NextIntlClientProvider locale="ka" messages={ka}>
      <LocaleSwitchProvider>{node}</LocaleSwitchProvider>
    </NextIntlClientProvider>,
  );
}

function species(id: string) {
  const item = getAtlasListItems("ka").find((entry) => entry.id === id);
  if (!item) throw new Error(`missing ${id}`);
  return item;
}

describe("AtlasSpeciesCard", () => {
  it("names the link by common name, scientific name and risk only", () => {
    const viper = species("macrovipera-lebetina");
    renderWith(<AtlasSpeciesCard locale="ka" species={viper} />);
    expect(screen.getByRole("link")).toHaveAccessibleName(
      `${viper.commonName} ${viper.scientificName} ${ka.danger.High}`,
    );
  });

  it("leaves the risk out of the name when the group has no risk scale", () => {
    const bird = getAtlasListItems("ka").find(
      (entry) => getSpeciesAtlasMeta(entry.id).group === "bird",
    );
    expect(bird).toBeDefined();
    if (!bird) return;
    renderWith(<AtlasSpeciesCard locale="ka" species={bird} />);
    expect(screen.getByRole("link")).toHaveAccessibleName(
      `${bird.commonName} ${bird.scientificName}`,
    );
  });

  it("does not request any card image at high priority", () => {
    renderWith(
      <AtlasSpeciesCard
        locale="ka"
        species={species("macrovipera-lebetina")}
      />,
    );
    const image = screen.getByRole("link").querySelector("img");
    expect(image).toHaveAttribute("loading", "lazy");
    expect(image).not.toHaveAttribute("fetchpriority", "high");
  });

  it("uses the same concise name in the list view", () => {
    const viper = species("macrovipera-lebetina");
    renderWith(<AtlasSpeciesRow locale="ka" species={viper} />);
    expect(screen.getByRole("link")).toHaveAccessibleName(
      `${viper.commonName} ${viper.scientificName} ${ka.danger.High}`,
    );
  });
});
