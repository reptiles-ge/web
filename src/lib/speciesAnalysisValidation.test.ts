import matter from "gray-matter";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";

import {
  buildSpeciesAnalysisContext,
  type SpeciesAnalysisContext,
} from "@/lib/speciesAnalysisInventory";
import {
  AnalysisEvidenceError,
  analysisLookalikes,
  applyAnalysisEdits,
  applyAnalysisLookalikes,
  validateSuperAnalysisResult,
} from "@/lib/speciesAnalysisValidation";
import {
  ANALYSIS_LOCALES,
  type SuperAnalysisResult,
  type SuperAnalysisStage,
} from "@/lib/speciesSuperAnalysisSchema";

let context: SpeciesAnalysisContext;
const values = (text: string) => ({ en: text, ka: text, ru: text, tr: text });
const result = (
  stage: SuperAnalysisStage = "analysis",
): SuperAnalysisResult => ({
  coverage: context.surfaces.map((surface) => surface.id),
  edits: [],
  evidence: [],
  findings: [],
  lookalikes: [],
  sources: [],
  stage,
  summary: "Reviewed",
});
const prior = () => [result("analysis"), result("lookalikes"), result("links")];
const edit = (before: string, after: string, field = "overview") => ({
  after: values(after),
  before: values(before),
  evidenceIds: [] as string[],
  field,
  reason: "Clearer",
});
const check = (
  value: SuperAnalysisResult,
  previous: SuperAnalysisResult[] = [],
) => validateSuperAnalysisResult(value, value.stage, context, previous);

beforeAll(async () => {
  context = await buildSpeciesAnalysisContext(
    "phasianus-colchicus",
    process.cwd(),
  );
  for (const locale of ANALYSIS_LOCALES)
    Object.assign(context.content[locale], {
      description: "A bird.",
      overview: "Natrix natrix is 20–40 cm.",
      stats: [{ label: "Conservation", value: "LC" }],
    });
});

describe("Super Analysis ownership and evidence gates", () => {
  it("inventories new editable and generated surfaces with existing source owners", () => {
    expect(context.editableFields).toEqual(
      expect.arrayContaining([
        "description",
        "identification.coloration",
        "interaction",
        "faq.0.question",
        "faq.0.answer",
        "stats.0.value",
      ]),
    );
    expect(context.sourceFiles.filter((file) => !file.hash)).toEqual([]);
    expect(context.templates).toHaveProperty("ka.riskVerdict.scaleHighBody");
    expect(context.occurrenceSummary.totalRecords).toBeGreaterThan(0);
    expect(context.surfaces.map((surface) => surface.id)).toEqual(
      expect.arrayContaining([
        "verdict",
        "facts",
        "range",
        "sources",
        "quiz",
        "metadata",
      ]),
    );
  });

  it("requires full coverage and three completed stages before text editing", () => {
    expect(() => check(result("texts"))).toThrow("three validated");
    const value = result();
    value.coverage = value.coverage.filter((id) => id !== "verdict");
    expect(() => check(value)).toThrow("coverage");
    expect(check(result("texts"), prior()).stage).toBe("texts");
  });

  it("rejects unknown findings and blocking issues, but retains review findings", () => {
    const value = result();
    value.findings = [
      {
        evidenceIds: [],
        message: "Needs human review",
        severity: "review",
        surface: "verdict",
      },
    ];
    expect(check(value).findings).toHaveLength(1);
    value.findings[0].severity = "blocking";
    expect(() => check(value)).toThrow("Blocking");
    value.findings[0].surface = "made-up";
    expect(() => check(value)).toThrow("Unknown");
  });

  it.each([
    "danger",
    "commonName",
    "dateModified",
    "stats.0.label",
    "fieldRecords.0.locality",
    "__proto__.polluted",
  ])("protects %s", (field) => {
    const value = result();
    value.edits = [edit("", "Changed", field)];
    expect(() => check(value)).toThrow("Unsupported");
  });

  it("requires inspected evidence and an actual profile reference for factual edits", () => {
    const value = result();
    value.edits = [
      {
        ...edit("Natrix natrix is 20–40 cm.", "Natrix natrix is 20–45 cm."),
        evidenceIds: ["analysis-size"],
      },
    ];
    expect(() => check(value)).toThrow("verified");
    value.evidence = [
      {
        claim: "Size",
        excerpt: "20–45 cm",
        id: "analysis-size",
        locator: "Table 1",
        scope: "Species",
        status: "unresolved",
        taxon: "Natrix natrix",
        url: "https://example.org/paper",
      },
    ];
    expect(() => check(value)).toThrow("verified");
    value.evidence[0].status = "verified";
    expect(() => check(value)).toThrow(AnalysisEvidenceError);
    expect(() => check(value)).toThrow("profile reference");
    value.sources = [
      {
        evidenceIds: ["analysis-size"],
        name: "Study",
        url: "https://example.org/paper",
      },
    ];
    expect(check(value).edits).toHaveLength(1);
    expect(() => check(value, [value])).toThrow("Duplicate evidence");
  });

  it("requires verified evidence and locale-consistent codes for coloration additions", () => {
    for (const locale of ANALYSIS_LOCALES)
      (
        context.content[locale].identification as Record<string, unknown>
      ).colors = [];
    const value = result();
    value.edits = [edit("", "brown", "identification.colors.0")];
    expect(() => check(value)).toThrow("verified source evidence");
    value.evidence = [
      {
        claim: "Brown plumage",
        excerpt: "Brown feathers",
        id: "analysis-color",
        locator: "Description",
        scope: "Species",
        status: "verified",
        taxon: "Phasianus colchicus",
        url: "https://example.org/color",
      },
    ];
    value.sources = [
      {
        evidenceIds: ["analysis-color"],
        name: "Description",
        url: "https://example.org/color",
      },
    ];
    value.edits[0].evidenceIds = ["analysis-color"];
    expect(check(value).edits[0].after.ka).toBe("brown");
    value.edits[0].after.en = "gray";
    expect(() => check(value)).toThrow("inconsistent color");
    value.edits[0].after = values("#7d5f43");
    expect(() => check(value)).toThrow("color palette code");
    value.edits[0].after = values("brown");
    value.edits[0].evidenceIds = [];
    value.stage = "texts";
    value.evidence = [];
    value.sources = [];
    expect(() => check(value, prior())).toThrow("factual analysis");
  });

  it("rejects stale input and missing locale output", () => {
    const value = result("texts");
    value.edits = [edit("Outdated", "Better")];
    expect(() => check(value, prior())).toThrow("Stale");
    const partial = {
      ...result(),
      edits: [
        { ...edit("A bird.", "Bird.", "description"), after: { ka: "Bird." } },
      ],
    };
    expect(() =>
      validateSuperAnalysisResult(partial, "analysis", context, []),
    ).toThrow();
  });

  it("rejects stage, evidence, index, palette-owner and lookalike violations", () => {
    const verified = {
      claim: "Brown plumage",
      excerpt: "Brown feathers",
      id: "analysis-color",
      locator: "Description",
      scope: "Species",
      status: "verified" as const,
      taxon: "Phasianus colchicus",
      url: "https://example.org/color",
    };
    const pair = (
      id: string,
      action: "add" | "keep" | "remove" | "review" = "keep",
    ) => ({
      action,
      difference: "Visible",
      evidenceIds: [] as string[],
      id,
      scenario: "Similar",
    });
    expect(() =>
      validateSuperAnalysisResult(result("links"), "analysis", context, []),
    ).toThrow("Wrong analysis stage");
    const facts = result("links");
    facts.sources = [
      {
        evidenceIds: ["analysis-color"],
        name: "Description",
        url: "https://example.org/color",
      },
    ];
    expect(() => check(facts)).toThrow("cannot introduce facts");
    const misplaced = result();
    misplaced.lookalikes = [pair("natrix-natrix")];
    expect(() => check(misplaced)).toThrow("Lookalikes belong");
    const finding = result();
    finding.findings = [
      {
        evidenceIds: ["missing"],
        message: "Needs a source",
        severity: "review",
        surface: "verdict",
      },
    ];
    expect(() => check(finding)).toThrow("Unknown finding evidence");
    const huge = result();
    huge.edits = [edit("", "Question?", "faq.101.question")];
    expect(() => check(huge)).toThrow("too large");
    const linked = result();
    linked.evidence = [verified];
    linked.edits = [edit("A bird.", "[A bird](natrix-natrix).", "description")];
    linked.edits[0].evidenceIds = ["analysis-color"];
    expect(() => check(linked)).toThrow("not rendered");
    const mismatch = result();
    mismatch.evidence = [verified];
    mismatch.sources = [
      {
        evidenceIds: ["analysis-color"],
        name: "Description",
        url: "https://example.org/other",
      },
    ];
    expect(() => check(mismatch)).toThrow("does not match evidence");
    const coded = result("texts");
    coded.edits = [edit("LC", "NT", "stats.0.value")];
    expect(() => check(coded, prior())).toThrow("conservation");
    const cited = result("texts");
    cited.edits = [
      edit("Natrix natrix is 20–40 cm.", "Natrix natrix measures 20–40 cm."),
    ];
    cited.edits[0].evidenceIds = ["missing"];
    expect(() => check(cited, prior())).toThrow("Unknown edit evidence");
    const previous = prior();
    previous[0].evidence = [verified];
    cited.edits[0].evidenceIds = ["analysis-color"];
    expect(check(cited, previous).edits).toHaveLength(1);
    const lookalikes = result("lookalikes");
    lookalikes.lookalikes = [pair(context.id)];
    expect(() => check(lookalikes)).toThrow("Invalid lookalike");
    lookalikes.lookalikes = [pair("not-a-species")];
    expect(() => check(lookalikes)).toThrow("Invalid lookalike");
    lookalikes.lookalikes = [pair("natrix-natrix"), pair("natrix-natrix")];
    expect(() => check(lookalikes)).toThrow("Invalid lookalike");
    lookalikes.lookalikes = [
      { ...pair("natrix-natrix"), evidenceIds: ["missing"] },
    ];
    expect(() => check(lookalikes)).toThrow("Unknown lookalike evidence");
    lookalikes.lookalikes = [pair("natrix-natrix", "add")];
    expect(() => check(lookalikes)).toThrow("verified source evidence");
    const savedId = context.id;
    const savedBehavior = ANALYSIS_LOCALES.map(
      (locale) => context.content[locale].behavior,
    );
    const savedStats = ANALYSIS_LOCALES.map(
      (locale) => context.content[locale].stats,
    );
    try {
      context.id = "macrovipera-lebetina";
      for (const locale of ANALYSIS_LOCALES)
        context.content[locale].behavior = "Nest\n\nYoung";
      const behavior = result("texts");
      behavior.edits = [edit("Nest\n\nYoung", "Nest", "behavior")];
      expect(() => check(behavior, prior())).toThrow("reproduction");
      for (const locale of ANALYSIS_LOCALES)
        context.content[locale].stats = [{ label: "Conservation", value: 1 }];
      const numeric = result("texts");
      numeric.edits = [edit("", "LC", "stats.0.value")];
      expect(() => check(numeric, prior())).toThrow("Not a text field");
    } finally {
      context.id = savedId;
      for (const [index, locale] of ANALYSIS_LOCALES.entries()) {
        context.content[locale].behavior = savedBehavior[index];
        context.content[locale].stats = savedStats[index];
      }
    }
  });

  it("records palette rows and a missing range-map hash", async () => {
    const [spider, newt] = await Promise.all([
      buildSpeciesAnalysisContext(
        "latrodectus-tredecimguttatus",
        process.cwd(),
      ),
      buildSpeciesAnalysisContext("lissotriton-lantzi", process.cwd()),
    ]);
    expect(spider.editableFields).toEqual(
      expect.arrayContaining([
        "identification.colors.0",
        "identification.colors.1",
        "identification.colors.2",
      ]),
    );
    expect(
      newt.sourceFiles.some((file) =>
        file.file.endsWith("lissotriton-lantzi.ts"),
      ),
    ).toBe(false);
  });
});

describe("links and final language editing", () => {
  it("adds only renderable published links without changing prose", () => {
    const value = result("links");
    value.edits = [
      edit(
        "Natrix natrix is 20–40 cm.",
        "[Natrix natrix](natrix-natrix) is 20–40 cm.",
      ),
    ];
    expect(check(value).edits).toHaveLength(1);
    value.edits[0].after = values(
      "[Natrix natrix](natrix-natrix) is harmless.",
    );
    expect(() => check(value)).toThrow("changed prose");
  });

  it.each([
    "missing-species",
    "phasianus-colchicus",
    "/en/snakes",
    "/missing",
    "https://example.org",
  ])("rejects invalid new destination %s", (target) => {
    const value = result("links");
    value.edits = [
      edit(
        "Natrix natrix is 20–40 cm.",
        `[Natrix natrix](${target}) is 20–40 cm.`,
      ),
    ];
    expect(() => check(value)).toThrow("link");
  });

  it("does not insert Markdown into hero description", () => {
    const value = result("links");
    value.edits = [edit("A bird.", "[A bird](natrix-natrix).", "description")];
    expect(() => check(value)).toThrow("non-link field");
  });

  it("locks link destinations, quantities and scientific names in the final stage", () => {
    const value = result("texts");
    value.edits = [
      edit("Natrix natrix is 20–40 cm.", "Natrix natrix measures 20–40 cm."),
    ];
    expect(check(value, prior()).edits).toHaveLength(1);
    value.edits[0].after = values("Natrix\u00a0natrix measures 20–40 cm.");
    expect(check(value, prior()).edits).toHaveLength(1);
    value.edits[0].after = values("Natrix natrix measures 25–40 cm.");
    expect(() => check(value, prior())).toThrow("numbers");
    value.edits[0].after = values("Natrix tessellata measures 20–40 cm.");
    expect(() => check(value, prior())).toThrow("scientific name");
    value.edits[0].after = values(
      "[Natrix natrix](natrix-natrix) measures 20–40 cm.",
    );
    expect(() => check(value, prior())).toThrow("inline links");
  });

  it("rejects mismatched translated links and duplicate fields", () => {
    const value = result("links");
    value.edits = [
      edit(
        "Natrix natrix is 20–40 cm.",
        "[Natrix natrix](natrix-natrix) is 20–40 cm.",
      ),
    ];
    value.edits[0].after.tr = "Natrix natrix is 20–40 cm.";
    expect(() => check(value)).toThrow("differ between locales");
    value.edits[0].after.tr = value.edits[0].after.ka;
    value.edits.push(value.edits[0]);
    expect(() => check(value)).toThrow("duplicate field");
  });
});

describe("deterministic mutations", () => {
  const raw =
    '---\nid: test-species\ncommonName: Test\nscientificName: Test species\noverview: "Before"\ndanger: High\ngallery:\n  - src: photo.jpg\n    credit:\n      photographer: Name\nsources:\n  - name: Original\n    url: https://example.org/original\n---\nKeep the MDX body.\n';

  it("round-trips YAML while preserving all protected content, sources and body", () => {
    const value = result("texts");
    value.edits = [edit("Before", "After: quoted \'text\'\nSecond paragraph.")];
    const updated = matter(applyAnalysisEdits(raw, "ka", value));
    expect(updated.data.overview).toBe(value.edits[0].after.ka);
    expect(updated.data.danger).toBe("High");
    expect(updated.data.gallery).toEqual(matter(raw).data.gallery);
    expect(updated.data.sources).toEqual(matter(raw).data.sources);
    expect(updated.data.dateModified).toBeTruthy();
    expect(updated.content).toBe(matter(raw).content);
    expect(applyAnalysisEdits(raw, "ka", result())).toBe(raw);
  });

  it("rejects incomplete structural additions and stale application", () => {
    const value = result();
    value.edits = [edit("", "Question?", "faq.0.question")];
    expect(() => applyAnalysisEdits(raw, "ka", value)).toThrow();
    value.edits = [edit("Stale", "After")];
    expect(() => applyAnalysisEdits(raw, "ka", value)).toThrow("changed");
  });

  it("does not append an empty MDX body or accumulate EOF blank lines", () => {
    const emptyBody = raw.slice(0, raw.indexOf("Keep the MDX body."));
    const value = result("texts");
    value.edits = [edit("Before", "After")];
    const updated = applyAnalysisEdits(emptyBody, "en", value);
    expect(updated.endsWith("\n---\n")).toBe(true);
    expect(matter(updated).content).toBe("");
    value.edits = [edit("After", "Next")];
    const rerun = applyAnalysisEdits(updated, "en", value);
    expect(rerun.endsWith("\n---\n")).toBe(true);
    expect(matter(rerun).content).toBe("");
    const directory = fs.mkdtempSync(
      path.join(os.tmpdir(), "super-mdx-whitespace-"),
    );
    const git = (args: string[]) =>
      execFileSync("git", args, { cwd: directory, stdio: "pipe" });
    try {
      git(["init", "-q"]);
      const file = path.join(directory, "en.mdx");
      fs.writeFileSync(file, emptyBody);
      git(["add", "--", "en.mdx"]);
      fs.writeFileSync(file, rerun);
      expect(() => git(["diff", "--check", "--", "en.mdx"])).not.toThrow();
    } finally {
      fs.rmSync(directory, { force: true, recursive: true });
    }
  });

  it("removes both lookalike directions without changing unrelated code or pairs", () => {
    const source =
      'const LOOKALIKES: Record<string, string[]> = {"target": ["peer"], "peer": ["target", "third"], "reverse": ["target"]};\nexport const sentinel = 1;';
    expect(analysisLookalikes(source, "target")).toEqual([
      { direct: true, id: "peer", reverse: true },
      { direct: false, id: "reverse", reverse: true },
    ]);
    const decisions: SuperAnalysisResult["lookalikes"] = [
      {
        action: "remove",
        difference: "Visible",
        evidenceIds: ["e1"],
        id: "peer",
        scenario: "Different",
      },
      {
        action: "keep",
        difference: "Visible",
        evidenceIds: [],
        id: "reverse",
        scenario: "Similar",
      },
    ];
    const updated = applyAnalysisLookalikes(source, "target", decisions);
    expect(analysisLookalikes(updated, "target")).toEqual([
      { direct: false, id: "reverse", reverse: true },
    ]);
    expect(analysisLookalikes(updated, "peer").map((peer) => peer.id)).toEqual([
      "third",
    ]);
    expect(updated).toContain("export const sentinel = 1;");
    expect(() => applyAnalysisLookalikes(source, "target", [])).toThrow(
      "not reviewed",
    );
  });

  it("appends new Georgian sources and adds a missing lookalike", () => {
    const value = result("texts");
    value.edits = [edit("Before", "After")];
    value.sources = [
      {
        evidenceIds: ["kept"],
        name: "Original",
        url: "https://example.org/original",
      },
      {
        evidenceIds: ["added"],
        name: "Study",
        url: "https://example.org/study",
      },
    ];
    const updated = matter(applyAnalysisEdits(raw, "ka", value));
    expect(updated.data.sources).toEqual([
      { name: "Original", url: "https://example.org/original" },
      { name: "Study", url: "https://example.org/study" },
    ]);
    const source = "const LOOKALIKES: Record<string, string[]> = {};\n";
    const pair = {
      action: "add" as const,
      difference: "Visible",
      evidenceIds: ["e1"],
      id: "peer",
      scenario: "Similar",
    };
    expect(applyAnalysisLookalikes(source, "target", [pair])).toContain(
      '"peer"',
    );
    expect(() =>
      applyAnalysisLookalikes(
        'const LOOKALIKES: Record<string, string[]> = {"target": ["peer"]};\n',
        "target",
        [
          { ...pair, action: "keep", id: "peer" },
          { ...pair, action: "remove", id: "ghost" },
        ],
      ),
    ).toThrow("does not match");
    expect(() => analysisLookalikes("const OTHER = {};", "target")).toThrow(
      "unavailable",
    );
    expect(() =>
      analysisLookalikes('const LOOKALIKES = { "peer": 1 };', "target"),
    ).toThrow("Unsupported lookalike registry");
    expect(() =>
      analysisLookalikes('const LOOKALIKES = { "peer": [1] };', "target"),
    ).toThrow("Unsupported lookalike candidate");
  });
});
