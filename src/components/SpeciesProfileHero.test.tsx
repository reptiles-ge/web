import { render, screen } from "@testing-library/react";
import { createTranslator } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import type { AppLocale } from "@/i18n/routing";

import { SpeciesProfileHero } from "@/components/SpeciesProfileHero";
import { getSpeciesAtlasMeta } from "@/data/speciesAtlasMeta";

import en from "../../messages/en.json";
import ka from "../../messages/ka.json";
import ru from "../../messages/ru.json";
import tr from "../../messages/tr.json";
import {
  contributorDirectoryFixture,
  localizedFixture,
} from "../../tests/fixtures/speciesCatalog";

const messages = { en, ka, ru, tr };

vi.mock("next-intl/server", () => ({
  getTranslations: async ({
    locale,
    namespace,
  }: {
    locale: keyof typeof messages;
    namespace: "card" | "danger" | "home.safetyStrip" | "nav" | "profile";
  }) => createTranslator({ locale, messages: messages[locale], namespace }),
}));

vi.mock("@/lib/authorsApi", () => ({
  getContributorDirectory: async (locale: AppLocale) =>
    contributorDirectoryFixture(locale),
}));

vi.mock("@/components/SpeciesMobileHeroCarousel", () => ({
  SpeciesMobileHeroCarousel: () => null,
}));

vi.mock("@/components/SpeciesScientificNameCopy", () => ({
  SpeciesScientificNameCopy: () => null,
}));

vi.mock("@/components/SpeciesVoicePlayer", () => ({
  SpeciesVoicePlayer: () => null,
}));

async function renderHero(
  speciesId: string,
  locale: AppLocale,
  emergency: boolean,
) {
  const species = localizedFixture({ id: speciesId }, locale);
  return render(
    await SpeciesProfileHero({
      breadcrumbs: [],
      desktopHeroSrc: null,
      emergency,
      galleryCount: 0,
      galleryPreview: [],
      group: getSpeciesAtlasMeta(speciesId).group,
      heroDesktopSources: [],
      heroPrimarySources: [],
      imageAlt: species.commonName,
      locale,
      mobileGallery: [],
      mobileHeroSrc: null,
      mobileImageAlt: species.commonName,
      shareText: species.commonName,
      species,
    }),
  );
}

describe("SpeciesProfileHero", () => {
  it.each(["ka", "en", "ru", "tr"] as const)(
    "shows the 112 call in the mobile hero of a venomous snake in %s",
    async (locale) => {
      await renderHero("macrovipera-lebetina", locale, true);
      const calls = screen.getAllByRole("link", {
        name: messages[locale].home.safetyStrip.call,
      });
      expect(calls).toHaveLength(2);
      for (const call of calls) {
        expect(call).toHaveAttribute("href", "tel:112");
      }
      const mobile = calls.find((call) => call.classList.contains("lg:hidden"));
      expect(mobile).toBeDefined();
      expect(mobile).toHaveClass("pointer-events-auto");
      expect(mobile).toHaveTextContent(
        `112 · ${messages[locale].profile.emergencyShort}`,
      );
    },
  );

  it("shows no 112 call for a harmless snake", async () => {
    await renderHero("natrix-tessellata", "en", false);
    expect(
      screen.queryByRole("link", { name: en.home.safetyStrip.call }),
    ).not.toBeInTheDocument();
  });
});
