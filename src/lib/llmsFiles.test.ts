import { describe, expect, it } from "vitest";

import { getCatalogSpecies } from "@/data/species";
import { speciesEn } from "@/data/species-en";
import { getSpeciesAtlasMeta } from "@/data/speciesAtlasMeta";
import {
  AI_CITATION_USER_AGENTS,
  buildLlmsFullText,
  buildLlmsIndexText,
  buildRobotsTxt,
} from "@/lib/llmsFiles";
import { llmsLinkHeader } from "@/lib/llmsPaths";

const PREFIXED_LOCALES = ["en", "ru", "tr"] as const;
const DEEP_GROUPS = new Set([
  "amphibian",
  "insect",
  "lizard",
  "scorpion",
  "snake",
  "spider",
  "turtle",
]);
const GEORGIAN_SCRIPT = /[\u10A0-\u10FF\u1C90-\u1CBF\u2D00-\u2D2F]/;

function markdownLinks(body: string) {
  return [...body.matchAll(/\]\(([^)]*)\)/g)].map((match) => match[1]);
}

function speciesCards(body: string) {
  const cards = new Map<string, string>();
  for (const card of body.split("\n### ").slice(1)) {
    const id = card.match(/^- Catalog id: (.+)$/m)?.[1];
    if (id) cards.set(id, card);
  }
  return cards;
}

function translatedBlocks(card: string) {
  const start = card.indexOf("\nFacts:");
  const end = card.indexOf("\nSources:");
  return start === -1 ? "" : card.slice(start, end === -1 ? undefined : end);
}

describe("buildRobotsTxt", () => {
  it("allows core crawling and names AI citation bots", () => {
    const body = buildRobotsTxt();

    expect(body).toContain(
      "User-agent: *\nContent-Signal: search=yes, ai-input=yes, ai-train=yes\nAllow: /\n",
    );
    expect(body).toContain("Disallow: /api/");
    expect(body).toContain("Sitemap: https://reptiles.ge/sitemap.xml");
    expect(body).toContain("llms.txt");
    expect(body).toContain("llms-full.txt");
    for (const locale of PREFIXED_LOCALES) {
      expect(body).toContain(`https://reptiles.ge/${locale}/llms.txt`);
      expect(body).toContain(`https://reptiles.ge/${locale}/llms-full.txt`);
    }

    for (const agent of AI_CITATION_USER_AGENTS) {
      expect(body).toContain(
        `User-agent: ${agent}\nContent-Signal: search=yes, ai-input=yes, ai-train=yes\nAllow: /\nDisallow: /api/\nDisallow: /admin\nDisallow: /admin/\n`,
      );
    }
  });
});

describe("buildLlmsIndexText", () => {
  it("keeps the public llms index synced with current atlas data", () => {
    const body = buildLlmsIndexText();

    expect(body.startsWith("# Reptiles.ge")).toBe(true);
    expect(body).toContain(
      `Catalog of published profiles (${getCatalogSpecies().length} live pages)`,
    );
    expect(body).toContain("## News");
    expect(body).toContain("caucasian-toad-bufo-verrucosissimus-taxonomy-2026");
    expect(body).toContain("georgian-snakes-area-of-occupancy-2026");
    expect(body).toContain(
      "leatherback-turtle-first-turkish-black-sea-records-2026",
    );
    expect(body).toContain("## Scorpions species");
    expect(body).toContain("/morieli/chreli-morieli");
    expect(body).toContain("## Insects species");
    expect(body).toContain("/mtserebi/aziuri-farosana");
  });
});

describe("buildLlmsFullText", () => {
  it("cuts long passages at sentence ends, never mid-sentence or at an abbreviation", () => {
    const lines = (["ka", ...PREFIXED_LOCALES] as const).flatMap((locale) =>
      buildLlmsFullText(locale).split("\n"),
    );

    expect(lines.filter((line) => line.trimEnd().endsWith("…"))).toEqual([]);
    expect(
      lines.filter((line) =>
        /(?:\s[A-Z]|\b(?:e\.g|i\.e|cf|ssp|spp))\.$/.test(line.trimEnd()),
      ),
    ).toEqual([]);
  });

  it("builds an extractable corpus for published atlas pages", () => {
    const body = buildLlmsFullText();

    expect(body.startsWith("# Reptiles.ge — llms-full")).toBe(true);
    expect(body).toContain("call 112");
    expect(body).toContain("## Priority pages");
    expect(body).toContain("## Snakes");
    expect(body).toContain("Macrovipera lebetinus");
    expect(body).toContain("გიურზა");
    expect(body).toContain("/gvelebi/giurza");
    expect(body).toContain("/en/snakes/macrovipera-lebetina");
    expect(body).toContain("10.3897/caucasiana.5.e189214");
    expect(body).toContain(
      `Published species cards: ${getCatalogSpecies().length}`,
    );
    expect(body.length).toBeGreaterThan(50_000);
    expect(body.length).toBeLessThan(900_000);
    expect(body).toContain("fuller cards");
  });

  it("keeps bite pages educational and omits medical schema claims", () => {
    const body = buildLlmsFullText();

    expect(body).toContain(
      "Symptoms may be absent early; medical staff must assess the bite.",
    );
    expect(body).not.toContain("MedicalWebPage");
  });

  it("links only to absolute URLs", () => {
    const body = buildLlmsFullText();

    expect(body).not.toMatch(/\]\(\//);
    expect(body).toContain(
      "[შხამიანი გველგესლაა](https://reptiles.ge/gvelebi/shxamiani-gvelebi)",
    );
    expect(body).toContain(
      "[venomous viper](https://reptiles.ge/en/venomous-snakes)",
    );
    for (const [, href] of body.matchAll(
      /\]\((https:\/\/reptiles\.ge[^)]*)\)/g,
    )) {
      expect(href, href).not.toMatch(
        /^https:\/\/reptiles\.ge\/(snakes|lizards|turtles|amphibians|birds|mammals|spiders|scorpions|insects|venomous-snakes)(\/|$)/,
      );
    }
  });

  it("gives every species card its English name and summary", () => {
    const body = buildLlmsFullText();
    const cards = body.split("\n### ").slice(1);
    const macrovipera = cards.find((card) =>
      card.startsWith("Macrovipera lebetinus"),
    );

    expect(macrovipera).toContain("- English name: Levantine viper");
    expect(macrovipera).toMatch(
      /\nEnglish summary: The Levantine viper\b[^\n]*\(Macrovipera lebetinus\)/,
    );
    expect(body.match(/^English summary: /gm)?.length).toBe(
      getCatalogSpecies().length,
    );
    expect(body).toContain(
      "- English title: Georgia has 56 reptiles and 12 amphibians — the 2026 checklist",
    );
  });

  it("labels a lookalike comparison source instead of dropping it", () => {
    const card = speciesCards(buildLlmsFullText()).get("macrovipera-lebetina");

    expect(card).toContain(
      "- Jablonski et al. 2019 — Original description of Elaphe urartica (lookalike source: Elaphe urartica): https://doi.org/10.7717/peerj.6944",
    );
    expect(card).toContain(
      "- Tarkhnishvili et al. 2026 — Annotated checklist of Georgia's amphibians and reptiles: https://doi.org/10.3897/caucasiana.5.e189214",
    );
  });
});

describe("per-locale llms files", () => {
  it("serves an index for each prefixed locale with locale URLs", () => {
    for (const locale of PREFIXED_LOCALES) {
      const body = buildLlmsIndexText(locale);

      expect(body.startsWith("# Reptiles.ge (")).toBe(true);
      expect(body).toContain(
        `[llms-full.txt](https://reptiles.ge/${locale}/llms-full.txt)`,
      );
      expect(body).toContain(
        `(https://reptiles.ge/${locale}/snakes/macrovipera-lebetina)`,
      );
      expect(body).toContain(`(https://reptiles.ge/${locale}/venomous-snakes)`);
      expect(body).not.toContain("](https://reptiles.ge/gvelebi");
      expect(body).toContain("[llms.txt](https://reptiles.ge/llms.txt)");
    }
    expect(buildLlmsIndexText("en")).toContain(
      "(https://reptiles.ge/en/quiz/which-snake)",
    );
    expect(buildLlmsIndexText()).toContain(
      "[llms.txt](https://reptiles.ge/en/llms.txt)",
    );
  });

  it("gives every species with an English translation English Facts, Identification and FAQ", () => {
    const cards = speciesCards(buildLlmsFullText("en"));
    const catalog = getCatalogSpecies();

    expect(cards.size).toBe(catalog.length);
    for (const item of catalog) {
      const card = cards.get(item.id) ?? "";
      const english = speciesEn[item.id];
      expect(card, item.id).toMatch(/^- URL: https:\/\/reptiles\.ge\/en\//m);
      if (!english || !DEEP_GROUPS.has(getSpeciesAtlasMeta(item.id).group)) {
        continue;
      }
      expect(
        card.startsWith(`${item.scientificName} — ${english.commonName}`),
      ).toBe(true);
      if (english.stats.length > 0)
        expect(card, item.id).toContain("\nFacts:\n");
      if (english.identification?.summary) {
        expect(card, item.id).toContain("\nIdentification: ");
      }
      if ((english.faq ?? []).length > 0) {
        expect(card, item.id).toContain("\nFAQ:\n");
      }
    }
  });

  it("keeps Georgian script out of translated Facts, Identification and FAQ blocks", () => {
    for (const locale of PREFIXED_LOCALES) {
      for (const [id, card] of speciesCards(buildLlmsFullText(locale))) {
        const blocks = translatedBlocks(card);
        expect(blocks, `${locale} ${id}`).not.toMatch(GEORGIAN_SCRIPT);
        expect(card.split("\n")[0], `${locale} ${id}`).not.toMatch(
          GEORGIAN_SCRIPT,
        );
      }
    }
  });

  it("links every locale file only to absolute URLs", () => {
    for (const locale of ["ka", ...PREFIXED_LOCALES] as const) {
      for (const body of [
        buildLlmsFullText(locale),
        buildLlmsIndexText(locale),
      ]) {
        for (const href of markdownLinks(body)) {
          expect(href, `${locale} ${href}`).toMatch(/^https:\/\//);
        }
      }
    }
  });

  it("keeps each full file well below the Georgian corpus size", () => {
    const ka = buildLlmsFullText().length;
    for (const locale of PREFIXED_LOCALES) {
      const body = buildLlmsFullText(locale);
      expect(body.startsWith("# Reptiles.ge — llms-full (")).toBe(true);
      expect(body).toContain(`Index: https://reptiles.ge/${locale}/llms.txt`);
      expect(body.length).toBeLessThan(ka);
      expect(body.length).toBeGreaterThan(50_000);
    }
  });

  it("points the Link header at the locale files", () => {
    expect(llmsLinkHeader("ka")).toContain("</llms.txt>");
    expect(llmsLinkHeader("ka")).toContain("</llms-full.txt>");
    expect(llmsLinkHeader("en")).toContain("</en/llms.txt>");
    expect(llmsLinkHeader("en")).toContain("</en/llms-full.txt>");
  });
});
