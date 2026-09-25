import { describe, expect, it } from "vitest";

import { getCatalogSpecies } from "@/data/species";
import {
  AI_CITATION_USER_AGENTS,
  buildLlmsFullText,
  buildLlmsIndexText,
  buildRobotsTxt,
} from "@/lib/llmsFiles";

describe("buildRobotsTxt", () => {
  it("allows core crawling and names AI citation bots", () => {
    const body = buildRobotsTxt();

    expect(body).toContain("User-agent: *");
    expect(body).toContain("Allow: /");
    expect(body).toContain("Disallow: /api/");
    expect(body).toContain("Sitemap: https://reptiles.ge/sitemap.xml");
    expect(body).toContain("llms.txt");
    expect(body).toContain("llms-full.txt");

    for (const agent of AI_CITATION_USER_AGENTS) {
      expect(body).toContain(`User-agent: ${agent}`);
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
      "This guide is educational and does not replace medical care.",
    );
    expect(body).not.toContain("MedicalWebPage");
  });
});
