import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import type { AppLocale } from "@/i18n/routing";

import { recordRequests, server } from "../../tests/msw/server";
import {
  getContributor,
  getContributorDirectory,
  getContributors,
} from "./authorsApi";
import { contributorDirectory } from "./contributorCredits";

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

describe("getContributor", () => {
  it("loads one contributor in one request", async () => {
    const requests = recordRequests();
    const author = await getContributor("zauri-khachidze", "en");
    requests.stop();
    expect(requests.urls).toEqual([`${CONTRIBUTORS_URL}/zauri-khachidze`]);
    expect(author).toMatchObject({
      id: "zauri-khachidze",
      name: "Zauri Khachidze",
      speciesCount: expect.any(Number),
    });
  });

  it("returns null for an unknown contributor", async () => {
    expect(await getContributor("nobody", "ka")).toBeNull();
  });

  it("fails loudly when the API errors", async () => {
    server.use(
      http.get(`${CONTRIBUTORS_URL}/:id`, () =>
        HttpResponse.json(
          { error: { code: "internal_error" } },
          { status: 500 },
        ),
      ),
    );
    await expect(getContributor("zauri-khachidze", "ka")).rejects.toThrow(
      "Contributors API answered 500 for zauri-khachidze",
    );
  });
});

describe("getContributorDirectory", () => {
  it.each(LOCALES)(
    "builds the directory from the contributors request (%s)",
    async (locale) => {
      const requests = recordRequests();
      const directory = await getContributorDirectory(locale);
      requests.stop();
      expect(requests.urls).toEqual([CONTRIBUTORS_URL]);
      expect(directory).toStrictEqual(
        contributorDirectory(await getContributors(locale)),
      );
      expect(Object.keys(directory.byId)).toHaveLength(17);
      expect(directory.byAlias["Sandro Khakhva"]).toBe("sandro-khakhva");
    },
  );
});
