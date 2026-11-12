import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import type { AppLocale } from "@/i18n/routing";

import {
  findUnresolvedInternalLinks,
  resolveInternalLinkTarget,
} from "@/lib/internalLinkTargets";
import { speciesHrefFromIndex } from "@/lib/localeSwitch";
import { getLocaleSwitchIndex } from "@/lib/localeSwitchData";
import proxy from "@/proxy";

import { speciesCatalogFixture } from "../../tests/fixtures/speciesCatalog";
import { compilePathname as compile } from "../../tests/support/compilePathname";

const LOCALES = ["ka", "en", "ru", "tr"] as const satisfies AppLocale[];
const INDEX = getLocaleSwitchIndex(speciesCatalogFixture("ka"));

function internalTargets(locale: AppLocale) {
  const targets = new Set<string>();
  for (const item of speciesCatalogFixture(locale)) {
    for (const match of JSON.stringify(item).matchAll(/\]\((\/[^)\s"]*)\)/g)) {
      targets.add(match[1]);
    }
  }
  return [...targets];
}

function localizedHref(target: string, locale: AppLocale) {
  const resolved = resolveInternalLinkTarget(target);
  if (!resolved) return null;
  if (resolved.type === "route") return compile(resolved.href, locale);
  const id = INDEX.idBySlug[resolved.slug];
  if (!id || INDEX.hubById[id] !== resolved.hub) return null;
  return compile(speciesHrefFromIndex(INDEX, id, locale), locale);
}

describe("resolveInternalLinkTarget", () => {
  it("turns a species path into a species slug in any locale form", () => {
    expect(resolveInternalLinkTarget("/birds/apus-apus")).toEqual({
      hub: "birds",
      slug: "apus-apus",
      type: "species",
    });
    expect(resolveInternalLinkTarget("/prinvelebi/namgala")).toEqual({
      hub: "birds",
      slug: "namgala",
      type: "species",
    });
    expect(resolveInternalLinkTarget("/gvelebi/giurza")).toEqual({
      hub: "snakes",
      slug: "giurza",
      type: "species",
    });
  });

  it("maps a public locale path back to its internal pathname", () => {
    expect(resolveInternalLinkTarget("/snakes-in-the-yard")).toEqual({
      href: "/snakes/gveli-ezoshi",
      type: "route",
    });
    expect(resolveInternalLinkTarget("/gvelebi/gveli-ezoshi")).toEqual({
      href: "/snakes/gveli-ezoshi",
      type: "route",
    });
    expect(resolveInternalLinkTarget("/snakes/bite")).toEqual({
      href: "/snakes/gvelis-nakbeni",
      type: "route",
    });
    expect(resolveInternalLinkTarget("/birds/saxeoebebi")).toEqual({
      href: "/birds/saxeoebebi",
      type: "route",
    });
  });

  it("keeps parameters of other dynamic pages", () => {
    expect(resolveInternalLinkTarget("/regions/kakheti")).toEqual({
      href: { params: { id: "kakheti" }, pathname: "/regions/[id]" },
      type: "route",
    });
  });

  it("drops a locale prefix and resolves in the page locale", () => {
    expect(resolveInternalLinkTarget("/en/snakes/bite")).toEqual({
      href: "/snakes/gvelis-nakbeni",
      type: "route",
    });
    expect(resolveInternalLinkTarget("/ru/birds/apus-apus")).toEqual({
      hub: "birds",
      slug: "apus-apus",
      type: "species",
    });
    expect(resolveInternalLinkTarget("/en")).toEqual({
      href: "/",
      type: "route",
    });
  });

  it("keeps queries and fragments on page links", () => {
    expect(resolveInternalLinkTarget("/species?danger=harmless")).toEqual({
      href: { pathname: "/species", query: { danger: "harmless" } },
      type: "route",
    });
    expect(resolveInternalLinkTarget("/regions/kakheti#map")).toEqual({
      href: {
        hash: "map",
        params: { id: "kakheti" },
        pathname: "/regions/[id]",
      },
      type: "route",
    });
    expect(resolveInternalLinkTarget("/birds/apus-apus#range")).toBeNull();
  });

  it("leaves unknown, external and malformed paths alone", () => {
    expect(resolveInternalLinkTarget("/no-such-page")).toBeNull();
    expect(resolveInternalLinkTarget("https://reptiles.ge/")).toBeNull();
    expect(resolveInternalLinkTarget("//example.com/x")).toBeNull();
    expect(resolveInternalLinkTarget("/regions/100%")).toBeNull();
    expect(resolveInternalLinkTarget("/birds/a%zz")).toBeNull();
  });

  it("lists link targets that match no page", () => {
    expect(
      findUnresolvedInternalLinks(
        "[a](/birds/apus-apus) [b](/no-such-page) [c](https://x.org) [d](/regions/100%)",
      ),
    ).toEqual([
      { label: "unresolved link", match: "/no-such-page" },
      { label: "unresolved link", match: "/regions/100%" },
    ]);
  });

  it("gives the audited Georgian links their Georgian URLs", () => {
    expect(localizedHref("/birds/apus-apus", "ka")).toBe(
      `/prinvelebi/${INDEX.kaSlugById["apus-apus"]}`,
    );
    expect(localizedHref("/snakes-in-the-yard", "ka")).toBe(
      "/gvelebi/gveli-ezoshi",
    );
    expect(localizedHref("/snakes-in-the-yard", "en")).toBe(
      "/en/snakes-in-the-yard",
    );
    expect(localizedHref("/gvelebi/giurza", "en")).toBe(
      "/en/snakes/macrovipera-lebetina",
    );
  });

  it("never renders a species text link that redirects", () => {
    for (const locale of LOCALES) {
      const targets = internalTargets(locale);
      expect(targets.length, locale).toBeGreaterThan(0);
      for (const target of targets) {
        const href = localizedHref(target, locale);
        expect(href, `${locale} ${target}`).not.toBeNull();
        const response = proxy(new NextRequest(`https://reptiles.ge${href}`));
        expect(
          response.headers.get("location"),
          `${locale} ${target} → ${href}`,
        ).toBeNull();
      }
    }
  });
});
