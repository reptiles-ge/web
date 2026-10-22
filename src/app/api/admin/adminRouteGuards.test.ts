import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, type Mock, vi } from "vitest";

const ADMIN_API_DIR = path.join(process.cwd(), "src/app/api/admin");
const GUARD_MODULES = new Set(["@/lib/adminAccess", "@/lib/adminRequest"]);
const HANDLER = /export async function (GET|POST|PUT|PATCH|DELETE)\b/g;
const IMPORT = /^import (?!type\b)[^;]*?from "(@\/[^"]+)";/gm;

const routes = readdirSync(ADMIN_API_DIR, { recursive: true })
  .map(String)
  .filter((file) => path.basename(file) === "route.local.ts")
  .sort()
  .map((file) => {
    const source = readFileSync(path.join(ADMIN_API_DIR, file), "utf8");
    return {
      file,
      handlers: [...source.matchAll(HANDLER)].map((match) => match[1]),
      modules: [...source.matchAll(IMPORT)]
        .map((match) => match[1])
        .filter((name) => !GUARD_MODULES.has(name)),
    };
  });

const cases = routes.flatMap((route) =>
  route.handlers.flatMap((method) =>
    [
      {
        attack: "a cross-site origin",
        origin: "http://evil.test",
        url: "http://localhost:3333/api/admin/x",
      },
      {
        attack: "a rebound host",
        origin: "http://rebound.test:3333",
        url: "http://rebound.test:3333/api/admin/x",
      },
    ].map((attack) => ({ ...route, ...attack, method })),
  ),
);

afterEach(() => {
  vi.restoreAllMocks();
  vi.resetModules();
});

async function loadWithMockedDependencies(file: string, modules: string[]) {
  const mocks: Mock[] = [];
  for (const name of modules) {
    vi.doMock(name, async (importOriginal) =>
      Object.fromEntries(
        Object.entries(await importOriginal<Record<string, unknown>>()).map(
          ([key, value]) => {
            if (typeof value !== "function") return [key, value];
            const mock = vi.fn();
            mocks.push(mock);
            return [key, mock];
          },
        ),
      ),
    );
  }
  const handlers = (await import(path.join(ADMIN_API_DIR, file))) as Record<
    string,
    (request: Request) => Promise<Response>
  >;
  return { handlers, mocks };
}

describe("admin API route guards", () => {
  it("finds the admin routes and their handlers", () => {
    expect(routes.length).toBeGreaterThan(0);
    for (const route of routes)
      expect(route.handlers.length).toBeGreaterThan(0);
  });

  it.each(cases)(
    "$file $method rejects $attack before any side effect",
    async ({ file, method, modules, origin, url }) => {
      const fetchSpy = vi.spyOn(globalThis, "fetch");
      const { handlers, mocks } = await loadWithMockedDependencies(
        file,
        modules,
      );
      const response = await handlers[method](
        new Request(url, {
          ...(method === "GET"
            ? {}
            : {
                body: "{}",
                headers: { "content-type": "text/plain", origin },
              }),
          ...(method === "GET" ? { headers: { origin, referer: url } } : {}),
          method,
        }),
      );

      expect(response.status).toBe(404);
      expect(fetchSpy).not.toHaveBeenCalled();
      for (const mock of mocks) expect(mock).not.toHaveBeenCalled();
    },
  );
});
