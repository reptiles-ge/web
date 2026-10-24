import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import type { AppLocale } from "@/i18n/routing";

import { recordRequests, server } from "../../tests/msw/server";
import {
  getContributorDirectory,
  getContributors,
  getTopContributors,
} from "./authorsApi";
import { contributorDirectory } from "./contributorCredits";

const LIST_URL = "https://api.reptiles.ge/v1/authors?contributor=true";
const CONTRIBUTORS_URL = "https://api.reptiles.ge/v1/contributors";
const LOCALES: AppLocale[] = ["ka", "en", "ru", "tr"];

describe("getContributors", () => {
  it("loads every contributor profile in one request", async () => {
    const requests = recordRequests();
    const contributors = await getContributors("en");
    requests.stop();
    expect(requests.urls).toEqual([CONTRIBUTORS_URL]);
    expect(contributors).toHaveLength(17);
    expect(contributors.every((author) => author.isContributor)).toBe(true);
    expect(
      contributors.find(({ id }) => id === "sandro-khakhva"),
    ).toMatchObject({ bio: expect.any(String), name: "Sandro Khakhva" });
  });

  it("fails loudly when the API errors", async () => {
    server.use(
      http.get(CONTRIBUTORS_URL, () =>
        HttpResponse.json(
          { error: { code: "internal_error" } },
          { status: 500 },
        ),
      ),
    );
    await expect(getContributors("ka")).rejects.toThrow(
      "Contributors API answered 500",
    );
  });
});

describe("getTopContributors", () => {
  it("loads only the first contributors and the full count", async () => {
    const requests = recordRequests();
    const { contributors, total } = await getTopContributors("ka", 2);
    requests.stop();
    expect(requests.urls).toEqual([`${CONTRIBUTORS_URL}?limit=2`]);
    expect(total).toBe(17);
    expect(contributors).toHaveLength(2);
    expect(contributors[0]!.photoCount).toBeGreaterThanOrEqual(
      contributors[1]!.photoCount,
    );
    expect(contributors[0]).toMatchObject({
      portraitSrc: expect.any(String),
      speciesCount: expect.any(Number),
    });
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

  it("falls back to the contributor profiles while the list has no aliases", async () => {
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
    expect(requests.urls).toEqual([LIST_URL, CONTRIBUTORS_URL]);
  });
});
