import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";

import { LocaleSwitchProvider } from "@/components/LocaleSwitchProvider";
import { PhoneLinkedText } from "@/components/PhoneLinkedText";
import { getLocaleSwitchIndex } from "@/lib/localeSwitchData";

import ka from "../../messages/ka.json";
import { speciesCatalogFixture } from "../../tests/fixtures/speciesCatalog";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: unknown }) => (
    <a href={JSON.stringify(href)}>{children}</a>
  ),
}));

const INDEX = getLocaleSwitchIndex(speciesCatalogFixture("ka"));

function hrefOf(name: string) {
  return JSON.parse(
    screen.getByRole("link", { name }).getAttribute("href") ?? "null",
  );
}

function renderKa(text: string) {
  render(
    <NextIntlClientProvider locale="ka" messages={ka}>
      <LocaleSwitchProvider index={INDEX}>
        <PhoneLinkedText>{text}</PhoneLinkedText>
      </LocaleSwitchProvider>
    </NextIntlClientProvider>,
  );
}

describe("PhoneLinkedText internal links", () => {
  it("links a species path to the species page in the page locale", () => {
    renderKa("Unlike the [common swift](/birds/apus-apus).");
    expect(hrefOf("common swift")).toEqual({
      params: { slug: INDEX.kaSlugById["apus-apus"] },
      pathname: "/birds/[slug]",
    });
  });

  it("maps a public English path to its internal pathname", () => {
    renderKa("Read [the yard guide](/snakes-in-the-yard).");
    expect(hrefOf("the yard guide")).toBe("/snakes/gveli-ezoshi");
  });

  it("keeps region parameters", () => {
    renderKa("Seen in [Kakheti](/regions/kakheti).");
    expect(hrefOf("Kakheti")).toEqual({
      params: { id: "kakheti" },
      pathname: "/regions/[id]",
    });
  });

  it("keeps the label as text when the species is not published", () => {
    renderKa("Unlike [a ghost](/birds/no-such-bird).");
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText(/a ghost/)).toBeInTheDocument();
  });

  it("keeps the label as text when the path names another group", () => {
    renderKa("Unlike [the swift](/snakes/apus-apus).");
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText(/the swift/)).toBeInTheDocument();
  });

  it("keeps the label as text outside the locale switch provider", () => {
    render(
      <NextIntlClientProvider locale="ka" messages={ka}>
        <PhoneLinkedText>Unlike [the swift](/birds/apus-apus).</PhoneLinkedText>
      </NextIntlClientProvider>,
    );
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText(/the swift/)).toBeInTheDocument();
  });

  it("localizes a locale-prefixed path and keeps its query", () => {
    renderKa(
      "See [the bite guide](/en/snakes/bite) and [all](/species?danger=harmless).",
    );
    expect(hrefOf("the bite guide")).toBe("/snakes/gvelis-nakbeni");
    expect(hrefOf("all")).toEqual({
      pathname: "/species",
      query: { danger: "harmless" },
    });
  });
});
