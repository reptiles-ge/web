import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import type { AppLocale } from "@/i18n/routing";

import { recordRequests, server } from "../../tests/msw/server";
import { getContributorDirectory, getContributors } from "./authorsApi";
import { contributorDirectory } from "./contributorCredits";

const LIST_URL = "https://api.reptiles.ge/v1/authors?contributor=true";
const LOCALES: AppLocale[] = ["ka", "en", "ru", "tr"];

function isProfileRequest(url: string) {
  return /\/v1\/authors\/[^/?]+$/.test(new URL(url).pathname);
}

describe("getContributors", () => {
  it("loads every contributor profile", async () => {
    const contributors = await getContributors("en");
    expect(contributors).toHaveLength(17);
    expect(contributors.every((author) => author.isContributor)).toBe(true);
    expect(
      contributors.find(({ id }) => id === "sandro-khakhva"),
    ).toMatchObject({ bio: expect.any(String), name: "Sandro Khakhva" });
  });

  it("fails loudly when the list errors", async () => {
    server.use(
      http.get("https://api.reptiles.ge/v1/authors", () =>
        HttpResponse.json(
          { error: { code: "internal_error" } },
          { status: 500 },
        ),
      ),
    );
    await expect(getContributors("ka")).rejects.toThrow(
      "Authors API answered 500",
    );
  });

  it("fails loudly when a profile errors", async () => {
    server.use(
      http.get("https://api.reptiles.ge/v1/authors/:id", () =>
        HttpResponse.json(
          { error: { code: "internal_error" } },
          { status: 500 },
        ),
      ),
    );
    await expect(getContributors("ka")).rejects.toThrow(
      /Authors API answered 500 for /,
    );
  });
});

describe("getContributorDirectory", () => {
  it.each(LOCALES)(
    "builds the directory from the list call alone (%s)",
    async (locale) => {
      const requests = recordRequests();
      const directory = await getContributorDirectory(locale);
      requests.stop();
      expect(requests.urls).toEqual([LIST_URL]);
      expect(directory).toStrictEqual(
        contributorDirectory(await getContributors(locale)),
      );
      expect(Object.keys(directory.byId)).toHaveLength(17);
      expect(directory.byAlias["Sandro Khakhva"]).toBe("sandro-khakhva");
    },
  );

  it("falls back to the profiles while the list has no aliases", async () => {
    const contributors = await getContributors("en");
    const expected = contributorDirectory(contributors);
    const oldList = contributors.map(
      ({ id, isContributor, kind, name, photoCount, role }) => ({
        id,
        isContributor,
        kind,
        name,
        photoCount,
        role,
      }),
    );
    server.use(
      http.get("https://api.reptiles.ge/v1/authors", () =>
        HttpResponse.json({ data: oldList, locale: "en", total: 17 }),
      ),
    );
    const requests = recordRequests();
    const directory = await getContributorDirectory("en");
    requests.stop();
    expect(directory).toStrictEqual(expected);
    expect(requests.urls.filter(isProfileRequest)).toHaveLength(17);
  });
});
