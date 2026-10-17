import { existsSync, globSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import config from "../../vitest.config";

const root = path.resolve(__dirname, "../..");
const exclude = (config.test?.coverage as { exclude: string[] }).exclude;
const sourceEntries = exclude.filter(
  (entry) => !/\.(test|d|generated)\./.test(entry),
);
const isGlob = (entry: string) => /[*{]/.test(entry);

function hasTest(file: string) {
  const base = file.replace(/\.tsx?$/, "");
  return [".test.ts", ".test.tsx"].some((suffix) =>
    existsSync(path.join(root, `${base}${suffix}`)),
  );
}

describe("coverage exclude list", () => {
  it.each(sourceEntries)("%s matches a source file", (entry) => {
    expect(globSync(entry, { cwd: root }).length).toBeGreaterThan(0);
  });

  it.each(sourceEntries.filter((entry) => !isGlob(entry)))(
    "%s has no test file",
    (entry) => {
      expect(hasTest(entry)).toBe(false);
    },
  );

  it("excludes components only by explicit path", () => {
    expect(
      sourceEntries.filter(
        (entry) => entry.startsWith("src/components/") && isGlob(entry),
      ),
    ).toEqual([]);
  });

  it("counts the Worker entry", () => {
    expect(exclude).not.toContain("src/worker.ts");
  });
});
