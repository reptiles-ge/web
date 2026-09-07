import { describe, expect, it } from "vitest";

import {
  AI_CITATION_USER_AGENTS,
  buildLlmsFullText,
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
    expect(body).toContain("Published species cards: 125");
    expect(body.length).toBeGreaterThan(50_000);
    expect(body.length).toBeLessThan(1_500_000);
  });

  it("keeps bite pages educational and omits medical schema claims", () => {
    const body = buildLlmsFullText();

    expect(body).toContain("Not a medical protocol");
    expect(body).not.toContain("MedicalWebPage");
  });
});
