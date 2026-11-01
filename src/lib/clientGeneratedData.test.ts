import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { walkFiles } from "../../tests/support/walkFiles";

const ROOT = path.resolve(import.meta.dirname, "../..");
const SRC = path.join(ROOT, "src");
const ADMIN_DIRS = ["admin", "components/admin"].map(
  (dir) => path.join(SRC, dir) + path.sep,
);
const CLIENT_GENERATED_ALLOWED = new Set([
  path.join(SRC, "data/georgia-paths.generated.ts"),
]);
const EXTENSIONS = [".ts", ".tsx", "/index.ts", "/index.tsx"];
const USE_CLIENT =
  /^\uFEFF?\s*(?:\/\/[^\n]*\n\s*|\/\*(?:[^*]|\*(?!\/))*\*\/\s*)*["']use client["']/;
const STATIC_IMPORT =
  /^(?:import|export)\s+(?!type\b)(?:[^'";]*?\sfrom\s+)?["']([^"']+)["']/gm;
const DYNAMIC_IMPORT = /\bimport\(\s*["'`]([^"'`]+)["'`]\s*\)/g;

const importsCache = new Map<string, string[]>();

function generatedModulesReachedFrom(entry: string) {
  const seen = new Set<string>();
  const stack = [entry];
  const reached: string[] = [];
  while (stack.length > 0) {
    const file = stack.pop() as string;
    if (seen.has(file)) continue;
    seen.add(file);
    if (file.endsWith(".generated.ts")) reached.push(file);
    else stack.push(...localImports(file));
  }
  return reached;
}

function localImports(file: string) {
  const cached = importsCache.get(file);
  if (cached) return cached;
  const source = readFileSync(file, "utf8");
  const imports = [
    ...source.matchAll(STATIC_IMPORT),
    ...source.matchAll(DYNAMIC_IMPORT),
  ]
    .map((match) => resolveImport(file, match[1]))
    .filter((resolved): resolved is string => resolved !== null);
  importsCache.set(file, imports);
  return imports;
}

function resolveImport(from: string, specifier: string) {
  let base: string;
  if (specifier.startsWith("@/")) base = path.join(SRC, specifier.slice(2));
  else if (specifier.startsWith(".")) {
    base = path.resolve(path.dirname(from), specifier);
  } else return null;
  if (existsSync(base) && statSync(base).isFile()) return base;
  for (const extension of EXTENSIONS) {
    if (existsSync(base + extension)) return base + extension;
  }
  return null;
}

describe("client bundles", () => {
  it.each([
    '"use client";\n',
    "'use client';\n",
    '\uFEFF"use client";\n',
    '\n// map widget\n"use client";\n',
    '/* map\n widget */\n"use client";\n',
  ])("detects the client directive in %j", (source) => {
    expect(USE_CLIENT.test(source)).toBe(true);
  });

  it("does not treat a quoted directive later in a file as a client file", () => {
    expect(USE_CLIENT.test('const note = "use client";\n')).toBe(false);
  });

  it("rejects unclosed comment runs without backtracking", () => {
    const started = performance.now();
    expect(USE_CLIENT.test(`/*${"*//*".repeat(50_000)}`)).toBe(false);
    expect(performance.now() - started).toBeLessThan(500);
  });

  it("never pull generated data modules into a client component", () => {
    const clientFiles = walkFiles(SRC).filter(
      (file) =>
        /\.tsx?$/.test(file) &&
        !/\.test\.tsx?$/.test(file) &&
        !ADMIN_DIRS.some((dir) => file.startsWith(dir)) &&
        USE_CLIENT.test(readFileSync(file, "utf8")),
    );
    expect(clientFiles.length).toBeGreaterThan(0);
    const offenders = clientFiles.flatMap((file) =>
      generatedModulesReachedFrom(file)
        .filter((generated) => !CLIENT_GENERATED_ALLOWED.has(generated))
        .map(
          (generated) =>
            `${path.relative(ROOT, file)} → ${path.relative(ROOT, generated)}`,
        ),
    );
    expect(offenders).toEqual([]);
  });
});
