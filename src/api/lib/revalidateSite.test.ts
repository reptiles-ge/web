import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ApiBindings } from "../env";

import {
  revalidateAuthorPages,
  revalidateContributorPage,
  revalidateMergedSpecies,
  revalidateNewsArticle,
  revalidatePageGroup,
  revalidateSpeciesPage,
  revalidateSpeciesSite,
} from "./revalidateSite";
import { warmWorkflowUrl } from "./siteWarm";

const WARM_WORKFLOW_URL = warmWorkflowUrl("reptiles-ge/web");

const WARM = [
  "/gvelebi/giurza",
  "/en/snakes/macrovipera-lebetina",
  "/ru/snakes/macrovipera-lebetina",
  "/tr/snakes/macrovipera-lebetina",
];

let env: ApiBindings;
let siteFetch: ReturnType<
  typeof vi.fn<(request: Request) => Promise<Response>>
>;
let github: ReturnType<typeof vi.fn<(url: string) => Promise<Response>>>;
let tasks: Array<Promise<unknown>>;

const defer = (task: Promise<unknown>) => {
  tasks.push(task);
};

beforeEach(() => {
  tasks = [];
  vi.spyOn(console, "error").mockImplementation(() => {});
  siteFetch = vi.fn(async (request: Request) =>
    request.url.endsWith("/api/revalidate")
      ? Response.json({ warm: WARM })
      : new Response("<html></html>"),
  );
  github = vi.fn(async () => new Response(null, { status: 204 }));
  vi.stubGlobal("fetch", github);
  env = {
    REVALIDATE_TOKEN: "site-secret",
    SITE: { fetch: siteFetch },
    WARM_DISPATCH_REPOSITORY: "reptiles-ge/web",
    WARM_DISPATCH_TOKEN: "gh-token",
  } as unknown as ApiBindings;
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function warmedUrls() {
  return siteFetch.mock.calls
    .map(([request]) => request.url)
    .filter((url) => !url.endsWith("/api/revalidate"));
}

describe("cache warm after a clear", () => {
  it("warms only the four URLs of a cleared species, in the background", async () => {
    expect(
      await revalidateSpeciesPage(env, "macrovipera-lebetina", defer),
    ).toBe(true);
    expect(tasks).toHaveLength(1);
    await Promise.all(tasks);
    expect(warmedUrls().sort()).toEqual(
      WARM.flatMap((path) => [
        `https://reptiles.ge${path}`,
        `https://reptiles.ge${path}?_rsc`,
      ]).sort(),
    );
    expect(github).not.toHaveBeenCalled();
  });

  it("warms the paths the site returns for a news article", async () => {
    siteFetch.mockImplementation(async (request) =>
      request.url.endsWith("/api/revalidate")
        ? Response.json({ warm: ["/news/a", "https://evil.example/", 3] })
        : new Response("ok"),
    );
    expect(await revalidateNewsArticle(env, "a", defer)).toBe(true);
    await Promise.all(tasks);
    expect(warmedUrls()).toEqual([
      "https://reptiles.ge/news/a",
      "https://reptiles.ge/news/a?_rsc",
    ]);
  });

  it("warms the merged species instead of the whole site", async () => {
    expect(await revalidateMergedSpecies(env, ["a", "b"], defer)).toBe(true);
    await Promise.all(tasks);
    expect(github).not.toHaveBeenCalled();
    expect(warmedUrls()).toHaveLength(WARM.length * 2);
  });

  it("warms an author's contributor page only, and nothing for other authors", async () => {
    const contributor = { id: "sandro", isContributor: true };
    expect(await revalidateAuthorPages(env, contributor, defer)).toBe(true);
    expect(await revalidateContributorPage(env, contributor, defer)).toBe(true);
    expect(tasks).toHaveLength(2);
    const photographer = { id: "someone", isContributor: false };
    expect(await revalidateAuthorPages(env, photographer, defer)).toBe(true);
    expect(await revalidateContributorPage(env, photographer, defer)).toBe(
      true,
    );
    expect(tasks).toHaveLength(2);
    await Promise.all(tasks);
    expect(github).not.toHaveBeenCalled();
  });

  it("warms nothing when the API purge fails", async () => {
    env = {
      ...env,
      CACHE_PURGE_TOKEN: "purge-token",
      CACHE_PURGE_ZONE_ID: "zone",
    } as ApiBindings;
    github.mockResolvedValue(new Response(null, { status: 500 }));
    expect(
      await revalidateSpeciesPage(env, "macrovipera-lebetina", defer),
    ).toBe(false);
    expect(await revalidateSpeciesSite(env, ["a"], defer)).toBe(false);
    expect(await revalidateMergedSpecies(env, ["a"], defer)).toBe(false);
    expect(tasks).toEqual([]);
  });

  it("dispatches the full warm for a page group and a species batch", async () => {
    expect(await revalidatePageGroup(env, "site", defer)).toBe(true);
    expect(await revalidateSpeciesSite(env, ["a", "b"], defer)).toBe(true);
    await Promise.all(tasks);
    expect(github.mock.calls.map(([url]) => url)).toEqual([
      WARM_WORKFLOW_URL,
      WARM_WORKFLOW_URL,
    ]);
    expect(warmedUrls()).toEqual([]);
  });

  it("warms nothing without a defer or when the site refuses the clear", async () => {
    expect(await revalidateSpeciesPage(env, "macrovipera-lebetina")).toBe(true);
    expect(warmedUrls()).toEqual([]);
    siteFetch.mockResolvedValue(new Response(null, { status: 500 }));
    expect(
      await revalidateSpeciesPage(env, "macrovipera-lebetina", defer),
    ).toBe(false);
    expect(await revalidatePageGroup(env, "site", defer)).toBe(false);
    expect(tasks).toEqual([]);
    expect(github).not.toHaveBeenCalled();
  });

  it("treats a site answer without a body as nothing to warm", async () => {
    siteFetch.mockResolvedValue(new Response(null, { status: 204 }));
    expect(
      await revalidateSpeciesPage(env, "macrovipera-lebetina", defer),
    ).toBe(true);
    expect(tasks).toEqual([]);
  });
});
