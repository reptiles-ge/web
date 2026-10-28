import { render, screen } from "@testing-library/react";
import { createTranslator } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import type { AppLocale } from "@/i18n/routing";

import { SpeciesFaqSection } from "@/components/SpeciesFaqSection";

import en from "../../messages/en.json";
import ka from "../../messages/ka.json";
import ru from "../../messages/ru.json";
import tr from "../../messages/tr.json";

const messages = { en, ka, ru, tr };

vi.mock("next-intl/server", () => ({
  getTranslations: async ({
    locale,
    namespace,
  }: {
    locale: AppLocale;
    namespace: "profile";
  }) => createTranslator({ locale, messages: messages[locale], namespace }),
}));

vi.mock("@/components/SpeciesFaqItems", () => ({
  SpeciesFaqItems: () => null,
}));

const items = [{ answer: "Answer", question: "Question?" }];

async function renderSection(locale: AppLocale, name: string) {
  const node = await SpeciesFaqSection({
    entityId: "macrovipera-lebetina",
    items,
    locale,
    name,
    pageType: "species",
  });
  return render(<>{node}</>);
}

describe("SpeciesFaqSection", () => {
  it("renders nothing without questions", async () => {
    const node = await SpeciesFaqSection({
      entityId: "macrovipera-lebetina",
      items: [],
      locale: "en",
      name: "Levantine viper",
      pageType: "species",
    });
    expect(node).toBeNull();
  });

  it.each([
    [
      "ka",
      "გიურზა",
      "მოკლე პასუხები გიურზასთან დაკავშირებულ ყველაზე მნიშვნელოვან კითხვებზე.",
    ],
    [
      "en",
      "Levantine viper",
      "Levantine viper: short answers to common questions.",
    ],
    ["ru", "Гюрза", "Гюрза: краткие ответы на главные вопросы."],
    ["tr", "Gürzə", "Gürzə: en önemli sorulara kısa yanıtlar."],
  ] as const)(
    "keeps the %s species name in a grammatical intro",
    async (locale, name, intro) => {
      await renderSection(locale, name);
      expect(screen.getByText(intro)).toBeInTheDocument();
    },
  );
});
