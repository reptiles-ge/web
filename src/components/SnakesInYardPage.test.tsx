import type { ComponentProps, ReactNode } from "react";

import { render, screen, within } from "@testing-library/react";
import { createTranslator } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import { SnakesInYardPage } from "@/components/SnakesInYardPage";

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
    locale: keyof typeof messages;
    namespace: string;
  }) =>
    createTranslator({
      locale,
      messages: messages[locale],
      namespace: namespace as never,
    }),
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    children,
    href,
    ...props
  }: Omit<ComponentProps<"a">, "href"> & {
    children: ReactNode;
    href: string | { pathname: string };
  }) => (
    <a href={typeof href === "string" ? href : href.pathname} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/components/CoverImage", () => ({ CoverImage: () => null }));
vi.mock("@/components/ContentAttribution", () => ({
  ContentAttribution: () => null,
}));
vi.mock("@/components/SnakeBiteCallChip", () => ({
  SnakeBiteCallChip: () => null,
}));
vi.mock("@/components/SnakesInYardHero", () => ({
  SnakesInYardHero: () => null,
}));
vi.mock("@/components/RelatedGuideCards", () => ({
  RelatedGuideGrid: () => null,
}));
vi.mock("@/components/SnakesInYardSections", () => ({
  SnakesInYardSections: () => <h2>sections</h2>,
}));

async function renderPage(locale: keyof typeof messages) {
  return render(
    await SnakesInYardPage({
      coverSrc: "/images/cover.jpg",
      heroSrc: "/images/hero.jpg",
      locale,
      publishedAt: "2026-01-01",
      updatedAt: "2026-10-25",
    }),
  );
}

function sectionTitles() {
  return screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
}

describe("SnakesInYardPage", () => {
  it.each(["ka", "en", "ru", "tr"] as const)(
    "answers the snake-already-in-the-yard question first in %s",
    async (locale) => {
      await renderPage(locale);
      expect(sectionTitles().slice(0, 2)).toEqual([
        messages[locale].snakesInYard.appearTitle,
        "sections",
      ]);
    },
  );

  it("points the hero action button at the urgent section", async () => {
    const { SnakesInYardHero } = await vi.importActual<
      typeof import("@/components/SnakesInYardHero")
    >("@/components/SnakesInYardHero");
    render(<>{await SnakesInYardHero({ heroSrc: "/b.jpg", locale: "ka" })}</>);
    expect(
      screen.getByRole("link", { name: ka.snakesInYard.ctaActions }),
    ).toHaveAttribute("href", "#appear");
  });

  it("gives the urgent section the anchor the hero links to", async () => {
    const { container } = await renderPage("ka");
    expect(container.querySelector("#appear")).toHaveTextContent(
      ka.snakesInYard.appearTitle,
    );
  });

  it("lists sources the site already cites", async () => {
    const { container } = await renderPage("en");
    const sources = container.querySelector("#sources")!.closest("section")!;
    expect(
      within(sources)
        .getAllByRole("link")
        .map((link) => link.getAttribute("href")),
    ).toEqual([
      "https://doi.org/10.3897/caucasiana.5.e189214",
      "https://112.gov.ge/?page_id=1686&lang=en",
      "https://www.who.int/teams/control-of-neglected-tropical-diseases/snakebite-envenoming/treatment",
      "https://www.cdc.gov/niosh/outdoor-workers/about/venomous-snakes.html",
    ]);
  });

  it.each([
    ["ka", /პირველი ნაბიჯები/],
    ["en", /first steps/i],
    ["ru", /первые шаги/i],
    ["tr", /ilk adımlar/i],
  ] as const)(
    "does not label the %s bite card as first steps",
    (locale, protocol) => {
      expect(messages[locale].groupHubShared.cluster.bite.body).not.toMatch(
        protocol,
      );
    },
  );
});
