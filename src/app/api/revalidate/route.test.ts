import { revalidateTag } from "next/cache";
import { afterEach, describe, expect, it, vi } from "vitest";

import { refreshSpeciesApiCache } from "@/lib/speciesApiRefresh";

import { POST } from "./route";

vi.mock("next/cache", () => ({ revalidateTag: vi.fn() }));
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

  it("only accepts species tags", async () => {
    vi.stubEnv("REVALIDATE_TOKEN", "secret");
    for (const tags of [[], ["news"], ["species:Bad Id"], "species"]) {
      expect((await POST(request({ tags }, "secret"))).status).toBe(400);
    }
    expect((await POST(request(null, "secret"))).status).toBe(400);
    expect(revalidateTag).not.toHaveBeenCalled();
  });
});
