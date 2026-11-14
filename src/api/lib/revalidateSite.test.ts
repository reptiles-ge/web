import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ApiBindings } from "../env";

import { createSpeciesTestDatabase } from "../testing/sqliteDatabase";
import {
  revalidateAuthorPages,
  revalidateContributorPage,
  revalidateMergedSpecies,
  revalidateNewsArticle,
  revalidatePageGroup,
  revalidateSpeciesPage,
  revalidateSpeciesSite,
} from "./revalidateSite";

let env: ApiBindings;
let siteFetch: ReturnType<
  typeof vi.fn<(request: Request) => Promise<Response>>
>;

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  siteFetch = vi.fn(async () => new Response(null, { status: 200 }));
  env = {
    DB: createSpeciesTestDatabase().db,
    REVALIDATE_TOKEN: "site-secret",
    SITE: { fetch: siteFetch },
  };
});

afterEach(() => {
  vi.restoreAllMocks();
});

async function sentPayloads() {
  return Promise.all(
    siteFetch.mock.calls.map(
      async ([request]) => (await request.json()) as unknown,
    ),
  );
}

describe("site cache clear", () => {
  it("clears one species, one news article and one contributor by tag", async () => {
    expect(await revalidateSpeciesPage(env, "macrovipera-lebetina")).toBe(true);
    expect(await revalidateNewsArticle(env, "a")).toBe(true);
    expect(await revalidateContributorPage(env, "sandro")).toBe(true);
    expect(await revalidateAuthorPages(env, "sandro")).toBe(true);
    expect(await sentPayloads()).toEqual([
      { tags: ["species", "species:macrovipera-lebetina"] },
      { tags: ["news:a"] },
      { tags: ["author:sandro"] },
      { tags: ["authors", "author:sandro", "species", "news"] },
    ]);
    const [request] = siteFetch.mock.calls[0]!;
    expect(request.url).toBe("https://reptiles.ge/api/revalidate");
    expect(request.headers.get("Authorization")).toBe("Bearer site-secret");
  });

  it("sends species batches 20 tags at a time", async () => {
    const ids = Array.from({ length: 25 }, (_, index) => `s${index}`);
    expect(await revalidateMergedSpecies(env, ids)).toBe(true);
    const payloads = (await sentPayloads()) as Array<{ tags: string[] }>;
    expect(payloads.map(({ tags }) => tags.length)).toEqual([20, 6]);
  });

  it("fails when the API purge fails", async () => {
    env = {
      ...env,
      DB: {
        batch: async () => [],
        prepare: () => {
          throw new Error("D1 unavailable");
        },
      },
    };
    expect(await revalidateSpeciesPage(env, "macrovipera-lebetina")).toBe(
      false,
    );
    expect(await revalidateSpeciesSite(env, ["a"])).toBe(false);
    expect(await revalidateMergedSpecies(env, ["a"])).toBe(false);
  });

  it("fails when the site refuses the clear or is not configured", async () => {
    siteFetch.mockResolvedValue(new Response(null, { status: 500 }));
    expect(await revalidateSpeciesPage(env, "macrovipera-lebetina")).toBe(
      false,
    );
    expect(await revalidatePageGroup(env, "site")).toBe(false);
    siteFetch.mockRejectedValue(new Error("down"));
    expect(await revalidateSpeciesSite(env, ["a"])).toBe(false);
    expect(
      await revalidatePageGroup(
        { ...env, REVALIDATE_TOKEN: undefined },
        "site",
      ),
    ).toBe(false);
  });

  it("clears a page group by id", async () => {
    expect(await revalidatePageGroup(env, "site")).toBe(true);
    expect(await sentPayloads()).toEqual([{ groups: ["site"] }]);
  });
});
