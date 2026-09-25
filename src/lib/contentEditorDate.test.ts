import { describe, expect, it } from "vitest";

import { editorDateChange } from "@/lib/contentEditorDate";
import { getSpeciesPublicSlug } from "@/lib/speciesSlugTable";

const root = process.cwd();
const now = new Date("2026-09-26T12:34:56Z");
const timestamp = "2026-09-26T16:34:56+04:00";

describe("content editor dateModified", () => {
  it("updates each content type's existing date source", async () => {
    const cases = [
      {
        file: "src/content/species/macrovipera-lebetina/ka.mdx",
        input: { id: "macrovipera-lebetina", kind: "species" as const },
        marker: `dateModified: "${timestamp}"`,
      },
      {
        file: "src/content/news/bezoar-goat-restoration-javakheti-2026.ts",
        input: {
          id: "bezoar-goat-restoration-javakheti-2026",
          kind: "news" as const,
        },
        marker: `  updatedAt: "${timestamp}",`,
      },
      {
        file: "src/data/pageLastModified.ts",
        input: { id: "bat-in-house", kind: "guide" as const },
        marker: `  "/mammals/ghamura-sakhlshi": "${timestamp}",`,
      },
      {
        file: "src/data/pageLastModified.ts",
        input: { id: "abkhazia", kind: "region" as const },
        marker: `  abkhazia: "${timestamp}",`,
      },
    ];
    for (const { file, input, marker } of cases) {
      const change = await editorDateChange(input, root, now);
      expect(change.file).toBe(file);
      expect(change.updated).toContain(marker);
    }
  });

  it("adds updatedAt to news that does not yet have it", async () => {
    const change = await editorDateChange(
      { id: "georgian-snakes-area-of-occupancy-2026", kind: "news" },
      root,
      now,
    );
    expect(change.updated.endsWith(`  updatedAt: "${timestamp}",\n};\n`)).toBe(
      true,
    );
  });

  it("updates the page selected for message text", async () => {
    const home = await editorDateChange(
      { id: "messages", kind: "message", pathname: "/" },
      root,
      now,
    );
    expect(home.updated).toContain(`  "/": "${timestamp}",`);
    const species = await editorDateChange(
      {
        id: "messages",
        kind: "message",
        pathname: `/snakes/${getSpeciesPublicSlug("macrovipera-lebetina", "ka")}`,
      },
      root,
      now,
    );
    expect(species.file).toBe("src/content/species/macrovipera-lebetina/ka.mdx");
    await expect(
      editorDateChange(
        { id: "messages", kind: "message", pathname: "/unknown" },
        root,
        now,
      ),
    ).rejects.toThrow("source unavailable");
  });
});
