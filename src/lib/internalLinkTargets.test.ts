import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import type { AppLocale } from "@/i18n/routing";

import { pathnames } from "@/i18n/pathnames";
import { resolveInternalLinkTarget } from "@/lib/internalLinkTargets";
import { speciesHrefFromIndex } from "@/lib/localeSwitch";
import { getLocaleSwitchIndex } from "@/lib/localeSwitchData";
import proxy from "@/proxy";

import { speciesCatalogFixture } from "../../tests/fixtures/speciesCatalog";

const LOCALES = ["ka", "en", "ru", "tr"] as const satisfies AppLocale[];
const INDEX = getLocaleSwitchIndex(speciesCatalogFixture("ka"));

function compile(
  href: string | { params?: Record<string, string>; pathname: string },
  locale: AppLocale,
) {
  const { params = {}, pathname } =
    typeof href === "string" ? { pathname: href } : href;
  const mapped = pathnames[pathname as keyof typeof pathnames];
  const template = typeof mapped === "string" ? mapped : mapped[locale];
  const path = template.replace(/\[(\w+)\]/g, (_, name: string) =>
    encodeURIComponent(params[name] ?? ""),
  );
  return locale === "ka" ? path : `/${locale}${path === "/" ? "" : path}`;
}

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
  if (!id) return null;
  return compile(speciesHrefFromIndex(INDEX, id, locale), locale);
}

describe("resolveInternalLinkTarget", () => {
  it("turns a species path into a species slug in any locale form", () => {
    expect(resolveInternalLinkTarget("/birds/apus-apus")).toEqual({
      slug: "apus-apus",
      type: "species",
    });
    expect(resolveInternalLinkTarget("/prinvelebi/namgala")).toEqual({
      slug: "namgala",
      type: "species",
    });
    expect(resolveInternalLinkTarget("/gvelebi/giurza")).toEqual({
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
    expect(resolveInternalLinkTarget("/en/snakes/bite")).toBeNull();
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

  it("leaves unknown paths, queries and fragments alone", () => {
    expect(resolveInternalLinkTarget("/no-such-page")).toBeNull();
    expect(resolveInternalLinkTarget("/species?danger=harmless")).toBeNull();
    expect(resolveInternalLinkTarget("https://reptiles.ge/")).toBeNull();
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
