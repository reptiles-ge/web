import { revalidatePath, revalidateTag } from "next/cache";
import { afterEach, describe, expect, it, vi } from "vitest";

import { refreshSpeciesApiCache } from "@/lib/speciesApiRefresh";

import { POST } from "./route";

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
    expect(response.status).toBe(204);
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");
    expect(revalidateTag).toHaveBeenCalledWith("species", "max");
    expect(revalidateTag).toHaveBeenCalledWith(
      "species:macrovipera-lebetina",
      "max",
    );
    expect(refreshSpeciesApiCache).toHaveBeenCalledWith([
      "species",
      "species:macrovipera-lebetina",
    ]);
    expect(
      vi.mocked(refreshSpeciesApiCache).mock.invocationCallOrder[0],
    ).toBeLessThan(vi.mocked(revalidateTag).mock.invocationCallOrder[0]!);
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
    expect(response.status).toBe(204);
    expect(revalidateTag).toHaveBeenCalledWith("news", "max");
    expect(revalidateTag).toHaveBeenCalledWith(
      "news:lagodekhi-iucn-mwvane-sia",
      "max",
    );
  });

  it("revalidates author tags", async () => {
    vi.stubEnv("REVALIDATE_TOKEN", "secret");
    const tags = ["authors", "author:sandro-khakhva", "species", "news"];
    const response = await POST(request({ tags }, "secret"));
    expect(response.status).toBe(204);
    for (const tag of tags) {
      expect(revalidateTag).toHaveBeenCalledWith(tag, "max");
    }
    expect(refreshSpeciesApiCache).toHaveBeenCalledWith(tags);
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
    expect(response.status).toBe(204);
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
    expect((await POST(request({ groups: ["site"] }, "secret"))).status).toBe(
      204,
    );
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
