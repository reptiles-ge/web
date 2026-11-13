import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { liveSpeciesRedirectPath } from "@/lib/liveSpeciesRedirect";

import { speciesCatalogFixture } from "../../tests/fixtures/speciesCatalog";
import { reptilesApi } from "../../tests/msw/reptilesApi";
import { server } from "../../tests/msw/server";

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

const NEW_BIRD = {
  ...speciesCatalogFixture("ka").find(
    (item) => item.id === "macrovipera-lebetina",
  )!,
  group: "bird" as const,
  id: "new-bird",
  slug: "akhali-chiti",
  slugAliases: ["dzveli-chiti"],
};

describe("liveSpeciesRedirectPath", () => {
  beforeEach(() => {
    server.use(
      http.get("https://api.reptiles.ge/v1/catalog", () =>
        HttpResponse.json({ data: [NEW_BIRD] }),
      ),
    );
  });

  it("sends a legacy /species URL to the live species page", async () => {
    expect(await liveSpeciesRedirectPath("ka", ["species", "new-bird"])).toBe(
      "/prinvelebi/akhali-chiti",
    );
    expect(
      await liveSpeciesRedirectPath("en", ["species", "akhali-chiti"]),
    ).toBe("/en/birds/new-bird");
  });

  it("sends a cross-locale hub URL to the species page of that locale", async () => {
    expect(
      await liveSpeciesRedirectPath("en", ["prinvelebi", "akhali-chiti"]),
    ).toBe("/en/birds/new-bird");
    expect(await liveSpeciesRedirectPath("ka", ["birds", "dzveli-chiti"])).toBe(
      "/prinvelebi/akhali-chiti",
    );
  });

  it("stays a 404 for the wrong hub, an unknown slug or a deeper path", async () => {
    expect(
      await liveSpeciesRedirectPath("ka", ["gvelebi", "akhali-chiti"]),
    ).toBeNull();
    expect(await liveSpeciesRedirectPath("ka", ["prinvelebi", "x"])).toBeNull();
    expect(
      await liveSpeciesRedirectPath("ka", ["prinvelebi", "akhali-chiti", "y"]),
    ).toBeNull();
    expect(await liveSpeciesRedirectPath("ka", ["about"])).toBeNull();
    expect(
      await liveSpeciesRedirectPath("ka", ["news", "new-bird"]),
    ).toBeNull();
  });

  it("reads the real catalog through the API", async () => {
    server.use(reptilesApi);
    expect(await liveSpeciesRedirectPath("en", ["species", "giurza"])).toBe(
      "/en/snakes/macrovipera-lebetina",
    );
  });
});
