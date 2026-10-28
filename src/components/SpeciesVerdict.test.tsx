import { render, screen } from "@testing-library/react";
import { createTranslator } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import { SpeciesVerdict } from "@/components/SpeciesVerdict";
import { getSpeciesAtlasMeta } from "@/data/speciesAtlasMeta";
import { speciesShareMessage } from "@/lib/speciesShareText";

import en from "../../messages/en.json";
import ka from "../../messages/ka.json";
import ru from "../../messages/ru.json";
import tr from "../../messages/tr.json";
import { speciesFixture } from "../../tests/fixtures/speciesCatalog";

const messages = { en, ka, ru, tr };

vi.mock("next-intl/server", () => ({
  getTranslations: async ({
    locale,
    namespace,
  }: {
    locale: keyof typeof messages;
    namespace:
      "card" | "danger" | "groupHubShared" | "profile" | "riskToHumans";
  }) => createTranslator({ locale, messages: messages[locale], namespace }),
}));

vi.mock("@/components/SpeciesMobileHeroCredit", () => ({
  SpeciesMobileHeroCredit: () => <span>Photo credit</span>,
}));

describe("SpeciesVerdict", () => {
  it.each(["ka", "en", "ru", "tr"] as const)(
    "keeps the false widow's risk, verdict and share wording consistent in %s",
    async (locale) => {
      const species = speciesFixture("steatoda-paykulliana")!;
      const copy = messages[locale].profile;
      expect(species.danger).toBe("Moderate");
      render(
        await SpeciesVerdict({
          credits: [],
          guideLinks: [],
          level: species.danger,
          locale,
          speciesId: species.id,
        }),
      );
      expect(
        screen.getByText(copy.verdictSpiderModerateTitle),
      ).toBeInTheDocument();
      expect(
        screen.getByText(copy.verdictSpiderModerateBody),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(copy.verdictHarmlessBody),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(messages[locale].riskToHumans.scaleModerateBody),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("link", {
          name: messages[locale].home.safetyStrip.call,
        }),
      ).not.toBeInTheDocument();
      const share = speciesShareMessage({
        commonName: species.commonName,
        danger: species.danger,
        group: getSpeciesAtlasMeta(species.id).group,
        id: species.id,
        labels: {
          details: copy.copyShareDetails,
          harmless: copy.copyShareHarmless,
          rearFanged: copy.copyShareRearFanged,
          venomous: copy.copyShareVenomous,
        },
        locale,
        scientificName: species.scientificName,
      });
      expect(share).toContain(copy.copyShareVenomous);
      expect(share).not.toContain(copy.copyShareHarmless);
    },
  );

  it.each([
    ["malpolon-insignitus", "Moderate"],
    ["macrovipera-lebetina", "High"],
    ["natrix-tessellata", "Harmless"],
  ] as const)("preserves the verdict for %s", async (speciesId, level) => {
    render(
      await SpeciesVerdict({
        credits: [],
        guideLinks: [],
        level,
        locale: "en",
        speciesId,
      }),
    );
    expect(
      screen.getByText(en.riskToHumans[`scale${level}Title`]),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        level === "Harmless"
          ? en.profile.verdictHarmlessBody
          : en.riskToHumans[`scale${level}Body`],
      ),
    ).toBeInTheDocument();
  });

  it.each([
    ["macrovipera-lebetina", "High"],
    ["malpolon-insignitus", "Moderate"],
    ["natrix-tessellata", "Harmless"],
  ] as const)(
    "places the %s verdict after the interaction section on mobile",
    async (speciesId, level) => {
      const { container } = render(
        await SpeciesVerdict({
          credits: [],
          guideLinks: [],
          level,
          locale: "en",
          speciesId,
        }),
      );
      expect(
        container
          .querySelector("section")
          ?.classList.contains("max-lg:order-2"),
      ).toBe(true);
    },
  );

  it("keeps the photo credit when the risk is unknown", async () => {
    render(
      await SpeciesVerdict({
        credits: [],
        guideLinks: [],
        locale: "en",
        speciesId: "accipiter-nisus",
      }),
    );
    expect(screen.getByText("Photo credit")).toBeInTheDocument();
    expect(screen.queryByText(en.card.dangerLevel)).not.toBeInTheDocument();
  });
});
