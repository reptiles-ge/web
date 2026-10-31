import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = path.resolve(__dirname, "../..");
const SRC = path.join(ROOT, "src");
const NEWS_DATA = path.join(SRC, "data/news.generated.ts");
const EXTENSIONS = [".ts", ".tsx", "/index.ts", "/index.tsx"];
const VALUE_IMPORT =
  /^(?:import|export)\s+(?!type\b)(?:[^'";]*?\sfrom\s+)?["']([^"']+)["']/gm;

function reachesNewsData(entry: string) {
  const seen = new Set<string>();
  const stack = [entry];
  while (stack.length > 0) {
    const file = stack.pop() as string;
    if (file === NEWS_DATA) return true;
    if (seen.has(file)) continue;
    seen.add(file);
    for (const match of readFileSync(file, "utf8").matchAll(VALUE_IMPORT)) {
      const resolved = resolveImport(file, match[1]);
      if (resolved) stack.push(resolved);
    }
  }
  return false;
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

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return sourceFiles(full);
    return /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) ? [full] : [];
  });
}

describe("client bundles", () => {
  it("never pull the generated news articles into a client component", () => {
    const clientFiles = sourceFiles(SRC).filter(
      (file) =>
        !file.startsWith(path.join(SRC, "admin")) &&
        !file.startsWith(path.join(SRC, "components/admin")) &&
        readFileSync(file, "utf8").startsWith('"use client"'),
    );
    expect(clientFiles.length).toBeGreaterThan(0);
    const offenders = clientFiles
      .filter((file) => reachesNewsData(file))
      .map((file) => path.relative(ROOT, file));
    expect(offenders).toEqual([]);
  });
});
