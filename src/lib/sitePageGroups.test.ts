import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { findSitePageGroup, SITE_PAGE_GROUPS } from "./sitePageGroups";

const APP = path.resolve(import.meta.dirname, "../app");

describe("SITE_PAGE_GROUPS", () => {
  it("has unique ids and at least one route per group", () => {
    const ids = SITE_PAGE_GROUPS.map(({ id }) => id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const group of SITE_PAGE_GROUPS) {
      expect(group.routes.length, group.id).toBeGreaterThan(0);
    }
  });

  it("points every route at an existing app folder", () => {
    for (const group of SITE_PAGE_GROUPS) {
      for (const route of group.routes) {
        const folder = path.join(APP, route.path);
        expect(existsSync(folder), `${group.id}: ${route.path}`).toBe(true);
        if (route.type === "page") {
          expect(
            existsSync(path.join(folder, "page.tsx")),
            `${group.id}: ${route.path}/page.tsx`,
          ).toBe(true);
        }
      }
    }
  });

  it("covers the whole site with the root layout", () => {
    expect(findSitePageGroup("site")?.routes).toEqual([
      { path: "/", type: "layout" },
    ]);
    expect(findSitePageGroup("nope")).toBeUndefined();
  });
});
