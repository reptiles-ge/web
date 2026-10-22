import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ADMIN_API_DIR = path.join(process.cwd(), "src/app/api/admin");
const GUARD =
  /\b(?:isLocalAdminOriginRequest|readLocalAdminFormData|readLocalAdminJsonBody)\(/;

const routes = readdirSync(ADMIN_API_DIR, { recursive: true })
  .map(String)
  .filter((file) => path.basename(file) === "route.local.ts")
  .sort();

describe("admin API route guards", () => {
  it("finds the admin routes", () => {
    expect(routes.length).toBeGreaterThan(0);
  });

  it.each(routes)("%s checks origin and host in every handler", (file) => {
    const source = readFileSync(path.join(ADMIN_API_DIR, file), "utf8");
    const handlers = source
      .split(/(?=export async function (?:GET|POST|PUT|PATCH|DELETE)\b)/)
      .slice(1);
    expect(handlers.length).toBeGreaterThan(0);
    for (const handler of handlers) {
      expect(handler).toMatch(GUARD);
    }
  });
});
