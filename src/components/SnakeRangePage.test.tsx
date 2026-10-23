import type { ReactNode } from "react";

import { render, screen } from "@testing-library/react";
import { createTranslator } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import { SnakeRangePage } from "@/components/SnakeRangePage";

import en from "../../messages/en.json";
import ka from "../../messages/ka.json";
import ru from "../../messages/ru.json";
import tr from "../../messages/tr.json";
import {
  localizedFixture,
  speciesCatalogFixture,
  speciesFixture,
  speciesGroupFixture,
} from "../../tests/fixtures/speciesCatalog";

const messages = { en, ka, ru, tr };

vi.mock("next-intl/server", () => ({
  getTranslations: async ({
    locale,
    namespace,
  }: {
    locale: keyof typeof messages;
    namespace: "groupHubShared" | "snakeRange";
  }) => createTranslator({ locale, messages: messages[locale], namespace }),
}));

vi.mock("@/lib/speciesCatalogApi", () => ({
  getSpeciesCatalog: async (locale: keyof typeof messages) =>
    speciesCatalogFixture(locale),
}));

vi.mock("@/components/ClusterPageFrame", () => ({
  ClusterPageFrame: ({ children }: { children: ReactNode }) => (
    <main>{children}</main>
  ),
}));

vi.mock("@/components/ClusterGuideLead", () => ({
  ClusterGuideLead: () => null,
}));

vi.mock("@/components/map/GeorgiaMap", () => ({
  GeorgiaMap: () => null,
}));

const CAUCASUS_VIPER = speciesFixture("vipera-kaznakovi")!;

describe("SnakeRangePage", () => {
  it.each(["ka", "en", "ru", "tr"] as const)(
    "names the region snakes in %s",
    async (locale) => {
      render(
        await SnakeRangePage({
          guideId: "snake-range",
          heroSrc: "/images/test.jpg",
          locale,
          species: speciesGroupFixture("snake", locale),
        }),
      );
      const localized = localizedFixture(CAUCASUS_VIPER, locale).commonName;
      expect(screen.getAllByText(localized).length).toBeGreaterThan(0);
      if (locale !== "ka") {
        expect(screen.queryAllByText(CAUCASUS_VIPER.commonName)).toHaveLength(
          0,
        );
      }
    },
  );
});
