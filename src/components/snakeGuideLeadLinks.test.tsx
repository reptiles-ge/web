import { render } from "@testing-library/react";
import { createTranslator } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import { snakeGuideLeadLinks } from "@/components/snakeGuideLeadLinks";

import en from "../../messages/en.json";
import ka from "../../messages/ka.json";
import ru from "../../messages/ru.json";
import tr from "../../messages/tr.json";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: unknown }) => (
    <a href={String(href)}>{children}</a>
  ),
}));

vi.mock("@/components/SpeciesInlineLink", () => ({
  SpeciesInlineLink: ({
    children,
    id,
  }: {
    children: React.ReactNode;
    id: string;
  }) => <a href={`/species/${id}`}>{children}</a>,
}));

const anchors = {
  en: "venomous snakes in Georgia",
  ka: "შხამიანი გველები საქართველოში",
  ru: "ядовитые змеи Грузии",
  tr: "Gürcistan’daki zehirli yılanlar",
};
const messages = { en, ka, ru, tr };
const cases = (Object.keys(anchors) as (keyof typeof anchors)[]).flatMap(
  (locale) =>
    (["snakeIndex", "snakeIdentify"] as const).map(
      (namespace) => [locale, namespace] as const,
    ),
);

describe("snakeGuideLeadLinks", () => {
  it.each(cases)(
    "links the %s %s lead to the venomous snakes guide",
    (locale, namespace) => {
      const t = createTranslator({
        locale,
        messages: messages[locale],
        namespace,
      });
      const { container } = render(
        <p>{t.rich("guideP2", snakeGuideLeadLinks)}</p>,
      );
      const guide = container.querySelector('a[href="/venomous-snakes"]');
      expect(guide?.textContent).toBe(anchors[locale]);
      expect(
        container.querySelector('a[href="/species/vipera-kaznakovi"]'),
      ).not.toBeNull();
    },
  );
});
