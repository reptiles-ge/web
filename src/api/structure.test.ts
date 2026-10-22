import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = path.resolve(import.meta.dirname, "../..");
const API_DIR = path.join(ROOT, "src/api");
const MIGRATIONS_DIR = path.join(ROOT, "migrations/api");
const SKILL_PATH = ".agents/skills/api/SKILL.md";

const TOP_LEVEL = new Set([
  "app.test.ts",
  "app.ts",
  "db",
  "env.ts",
  "factory.ts",
  "index.ts",
  "lib",
  "middleware",
  "routes",
  "schemas",
  "structure.test.ts",
  "testing",
]);

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const files = walk(API_DIR).map((full) => ({
  rel: path.relative(API_DIR, full),
  source: readFileSync(full, "utf8"),
}));
const checkedFiles = files.filter((file) => file.rel !== "structure.test.ts");
const sourceFiles = files.filter((file) => !file.rel.endsWith(".test.ts"));
const routeFiles = sourceFiles.filter((file) => file.rel.startsWith("routes/"));
const appSource = readFileSync(path.join(API_DIR, "app.ts"), "utf8");

function offenders(
  candidates: typeof files,
  pattern: RegExp,
  allowed: (rel: string) => boolean = () => false,
) {
  return candidates
    .filter((file) => !allowed(file.rel) && pattern.test(file.source))
    .map((file) => file.rel);
}

describe("api structure (see .agents/skills/api/SKILL.md)", () => {
  it("keeps only the agreed top-level entries in src/api", () => {
    const unknown = readdirSync(API_DIR).filter((name) => !TOP_LEVEL.has(name));
    expect(unknown).toEqual([]);
  });

  it("only uses TypeScript files", () => {
    expect(
      files.filter((file) => !file.rel.endsWith(".ts")).map((f) => f.rel),
    ).toEqual([]);
  });

  it("keeps SQL in db/", () => {
    expect(
      offenders(
        sourceFiles,
        /\.prepare\(|\bbatch\(/,
        (rel) => rel.startsWith("db/") || rel.startsWith("testing/"),
      ),
    ).toEqual([]);
    expect(offenders(checkedFiles, /SELECT\s+\*/i)).toEqual([]);
  });

  it("creates Hono instances only in app.ts and routes/", () => {
    expect(
      offenders(
        sourceFiles,
        /new Hono\b/,
        (rel) => rel === "app.ts" || rel.startsWith("routes/"),
      ),
    ).toEqual([]);
  });

  it("reads request input only through validators in routes", () => {
    expect(
      offenders(
        routeFiles,
        /c\.req\.(json|query|queries|param|parseBody|text|formData)\(/,
      ),
    ).toEqual([]);
  });

  it("builds error responses only through lib/errors.ts", () => {
    expect(
      offenders(
        sourceFiles,
        /c\.json\(\s*\{\s*error\b/,
        (rel) => rel === "lib/errors.ts",
      ),
    ).toEqual([]);
  });

  it("never reads process.env", () => {
    expect(offenders(checkedFiles, /process\.env/)).toEqual([]);
  });

  it("mounts every route module under /v1 and tests it", () => {
    for (const file of routeFiles) {
      const name = path.basename(file.rel, ".ts");
      expect(appSource, `${name} is not imported in app.ts`).toContain(
        `from "./routes/${name}"`,
      );
      expect(
        files.some((other) => other.rel === `routes/${name}.test.ts`),
        `routes/${name}.test.ts is missing`,
      ).toBe(true);
    }
    const mounts = [...appSource.matchAll(/\.route\("([^"]+)"/g)].map(
      (match) => match[1],
    );
    expect(mounts.length).toBe(routeFiles.length);
    expect(mounts.every((mount) => mount?.startsWith("/v1/"))).toBe(true);
  });

  it("names migrations NNNN_snake_case.sql with no gaps", () => {
    const names = readdirSync(MIGRATIONS_DIR).sort();
    expect(names.length).toBeGreaterThan(0);
    names.forEach((name, index) => {
      expect(name).toMatch(/^\d{4}_[a-z0-9_]+\.sql$/);
      expect(Number(name.slice(0, 4))).toBe(index + 1);
    });
  });

  it("keeps the global middleware in app.ts", () => {
    for (const call of [
      "secureHeaders(",
      "use(noindex)",
      "cors(",
      "bodyLimit(",
      "etag(",
      ".onError(handleError)",
    ]) {
      expect(appSource, `${call} is missing from app.ts`).toContain(call);
    }
  });

  it("lets the site reach the API only through src/lib/apiClient.ts", () => {
    const siteFiles = walk(path.join(ROOT, "src"))
      .map((full) => path.relative(ROOT, full))
      .filter(
        (rel) =>
          !rel.startsWith("src/api/") &&
          !/\.test\.tsx?$/.test(rel) &&
          rel !== "src/lib/apiClient.ts",
      );
    const leaking = siteFiles.filter((rel) =>
      /from "@\/api\/|api\.reptiles\.ge|reptiles-api/.test(
        readFileSync(path.join(ROOT, rel), "utf8"),
      ),
    );
    expect(leaking).toEqual([]);
    expect(
      readFileSync(path.join(ROOT, "src/lib/apiClient.ts"), "utf8"),
    ).toMatch(/import type \{ AppType \} from "@\/api\/app"/);
  });

  it("applies migrations only from the explicit db:migrate scripts", () => {
    const { scripts } = JSON.parse(
      readFileSync(path.join(ROOT, "package.json"), "utf8"),
    ) as { scripts: Record<string, string> };
    const appliers = Object.entries(scripts)
      .filter(([, command]) => /migrations apply|db:migrate/.test(command))
      .map(([name]) => name);
    expect(appliers.sort()).toEqual(["db:migrate", "db:migrate:remote"]);
    expect(scripts["db:migrate"]).toContain("--local");
    expect(scripts["db:migrate:remote"]).toContain("--remote");
    const automated = [".github/workflows", "scripts"]
      .flatMap((dir) => walk(path.join(ROOT, dir)))
      .filter((file) => /migrations apply/.test(readFileSync(file, "utf8")))
      .map((file) => path.relative(ROOT, file));
    expect(automated).toEqual([]);
  });

  it("pins Hono packages to exact versions", () => {
    const pkg = JSON.parse(
      readFileSync(path.join(ROOT, "package.json"), "utf8"),
    ) as {
      dependencies: Record<string, string>;
    };
    for (const name of ["hono", "@hono/zod-validator"]) {
      expect(pkg.dependencies[name]).toMatch(/^\d+\.\d+\.\d+$/);
    }
  });

  it("points the Worker config at this layout", () => {
    const config = readFileSync(path.join(ROOT, "wrangler.api.jsonc"), "utf8");
    expect(config).toContain('"main": "src/api/index.ts"');
    expect(config).toContain('"migrations_dir": "migrations/api"');
  });

  it("keeps the agent playbook wired into AGENTS.md", () => {
    expect(statSync(path.join(ROOT, SKILL_PATH)).isFile()).toBe(true);
    expect(readFileSync(path.join(ROOT, "AGENTS.md"), "utf8")).toContain(
      SKILL_PATH,
    );
  });
});
