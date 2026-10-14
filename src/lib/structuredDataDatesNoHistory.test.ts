import { describe, expect, it, vi } from "vitest";

vi.mock("@/data/contentDates.generated", () => ({
  guideArticleModifiedAt: {},
  messageNamespaceModifiedAt: {},
  pageFileModifiedAt: {},
}));

import { sitemapPathDatePublished } from "@/data/pageLastModified";
import { routing } from "@/i18n/routing";
import { pageDateFields, pageModifiedDate } from "@/lib/structuredDataDates";

describe("page dates without git history", () => {
  it.each(routing.locales)(
    "leaves %s static pages without a modification date",
    (locale) => {
      for (const path of ["/about", "/contact", "/risk-to-humans"]) {
        expect(pageModifiedDate(path, locale), path).toBeNull();
        expect(pageDateFields(path, locale).dateModified, path).toBe(
          sitemapPathDatePublished(path),
        );
      }
    },
  );
});
