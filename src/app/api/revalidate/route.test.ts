import { revalidatePath, revalidateTag } from "next/cache";
import { afterEach, describe, expect, it, vi } from "vitest";

import { refreshSpeciesApiCache } from "@/lib/speciesApiRefresh";

import { POST } from "./route";

vi.mock("@/i18n/navigation", async () => {
  const { pathnames } = await import("@/i18n/pathnames");
  return {
    getPathname: ({
      href,
      locale,
    }: {
      href: string | { params?: Record<string, string>; pathname: string };
      locale: string;
    }) => {
      const key = typeof href === "string" ? href : href.pathname;
      const entry = pathnames[key as keyof typeof pathnames];
      const pattern =
        typeof entry === "string" ? entry : entry[locale as keyof typeof entry];
      const path =
        typeof href === "string"
          ? pattern
          : pattern.replace(
              /\[(\w+)\]/g,
              (_match, name: string) => href.params?.[name] ?? name,
            );
      return locale === "ka" ? path : `/${locale}${path}`;
    },
  };
});
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));
vi.mock("@/lib/speciesApiRefresh", () => ({
  refreshSpeciesApiCache: vi.fn(),
}));

function request(body: unknown, token?: string) {
  return new Request("https://reptiles.ge/api/revalidate", {
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    method: "POST",
  });
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe("POST /api/revalidate", () => {
  it("revalidates species tags with the shared token", async () => {
    vi.stubEnv("REVALIDATE_TOKEN", "secret");
    const response = await POST(
      request({ tags: ["species", "species:macrovipera-lebetina"] }, "secret"),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");
    expect(revalidateTag).toHaveBeenCalledWith("species", { expire: 0 });
    expect(revalidateTag).toHaveBeenCalledWith("species:macrovipera-lebetina", {
      expire: 0,
    });
    expect(refreshSpeciesApiCache).toHaveBeenCalledWith([
      "species",
      "species:macrovipera-lebetina",
    ]);
    expect(await response.json()).toEqual({
      warm: [
        "/gvelebi/giurza",
        "/en/snakes/macrovipera-lebetina",
        "/ru/snakes/macrovipera-lebetina",
        "/tr/snakes/macrovipera-lebetina",
      ],
    });
    expect(
      vi.mocked(refreshSpeciesApiCache).mock.invocationCallOrder[0],
    ).toBeLessThan(vi.mocked(revalidateTag).mock.invocationCallOrder[0]!);
  });

  it("warms a species published after the deploy at its live slug", async () => {
    vi.stubEnv("REVALIDATE_TOKEN", "secret");
    vi.mocked(refreshSpeciesApiCache).mockResolvedValueOnce({
      hubById: { "new-bird": "birds" },
      idByAnySlug: { "akhali-chiti": "new-bird", "new-bird": "new-bird" },
      kaSlugById: { "new-bird": "akhali-chiti" },
    });
    const response = await POST(
      request({ tags: ["species", "species:new-bird"] }, "secret"),
    );
    expect(await response.json()).toEqual({
      warm: [
        "/prinvelebi/akhali-chiti",
        "/en/birds/new-bird",
        "/ru/birds/new-bird",
        "/tr/birds/new-bird",
      ],
    });
  });

  it("rejects a missing or wrong token, and a missing secret", async () => {
    vi.stubEnv("REVALIDATE_TOKEN", "secret");
    expect((await POST(request({ tags: ["species"] }))).status).toBe(401);
    expect((await POST(request({ tags: ["species"] }, "nope"))).status).toBe(
      401,
    );
    vi.stubEnv("REVALIDATE_TOKEN", "");
    expect((await POST(request({ tags: ["species"] }, ""))).status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
    expect(refreshSpeciesApiCache).not.toHaveBeenCalled();
  });

  it("revalidates news tags", async () => {
    vi.stubEnv("REVALIDATE_TOKEN", "secret");
    const response = await POST(
      request({ tags: ["news", "news:lagodekhi-iucn-mwvane-sia"] }, "secret"),
    );
    expect(response.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith("news", { expire: 0 });
    expect(revalidateTag).toHaveBeenCalledWith(
      "news:lagodekhi-iucn-mwvane-sia",
      { expire: 0 },
    );
    expect(await response.json()).toEqual({
      warm: [
        "/news/lagodekhi-iucn-mwvane-sia",
        "/en/news/lagodekhi-iucn-mwvane-sia",
        "/ru/news/lagodekhi-iucn-mwvane-sia",
        "/tr/news/lagodekhi-iucn-mwvane-sia",
      ],
    });
  });

  it("revalidates author tags", async () => {
    vi.stubEnv("REVALIDATE_TOKEN", "secret");
    const tags = ["authors", "author:sandro-khakhva", "species", "news"];
    const response = await POST(request({ tags }, "secret"));
    expect(response.status).toBe(200);
    for (const tag of tags) {
      expect(revalidateTag).toHaveBeenCalledWith(tag, { expire: 0 });
    }
    expect(refreshSpeciesApiCache).toHaveBeenCalledWith(tags);
    expect(await response.json()).toEqual({
      warm: [
        "/kontributorebi/sandro-khakhva",
        "/en/contributors/sandro-khakhva",
        "/ru/contributors/sandro-khakhva",
        "/tr/contributors/sandro-khakhva",
      ],
    });
  });

  it("only accepts species, news and author tags", async () => {
    vi.stubEnv("REVALIDATE_TOKEN", "secret");
    for (const tags of [
      [],
      ["author"],
      ["authors:sandro-khakhva"],
      ["author:Bad Id"],
      ["contributors"],
      ["species:Bad Id"],
      ["news:Bad Slug"],
      "species",
    ]) {
      expect((await POST(request({ tags }, "secret"))).status).toBe(400);
    }
    expect((await POST(request(null, "secret"))).status).toBe(400);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("revalidates the routes of page groups by path", async () => {
    vi.stubEnv("REVALIDATE_TOKEN", "secret");
    const response = await POST(
      request({ groups: ["about", "legal", "snakes"] }, "secret"),
    );
    expect(response.status).toBe(200);
    expect(vi.mocked(revalidatePath).mock.calls).toEqual([
      ["/[locale]/about", "page"],
      ["/[locale]/privacy", "page"],
      ["/[locale]/terms-and-conditions", "page"],
      ["/[locale]/photo-use", "page"],
      ["/[locale]/snakes", "layout"],
    ]);
    expect(revalidateTag).not.toHaveBeenCalled();
    expect(refreshSpeciesApiCache).not.toHaveBeenCalled();
  });

  it("revalidates the whole site from the root layout", async () => {
    vi.stubEnv("REVALIDATE_TOKEN", "secret");
    const response = await POST(request({ groups: ["site"] }, "secret"));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ warm: [] });
    expect(revalidatePath).toHaveBeenCalledExactlyOnceWith("/", "layout");
  });

  it("refuses unknown groups, free paths and an empty body", async () => {
    vi.stubEnv("REVALIDATE_TOKEN", "secret");
    for (const value of [
      { groups: ["nope"] },
      { groups: ["/[locale]/about"] },
      { groups: [] },
      {},
      { paths: ["/"] },
    ]) {
      expect((await POST(request(value, "secret"))).status).toBe(400);
    }
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
