import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { routing } from "@/i18n/routing";
import { findPageReferences } from "@/lib/pageTalkProse";

// Interface labels that name the page on purpose, plus the published-profile
// scope note on the mammal index.
const ALLOWED = new Set([
  "errorPage.title",
  "mammalIndex.guideP3",
  "pageAnalysis.linksProcessing",
  "profile.contents",
  "profile.sourcesProfileTitle",
]);

describe.each(routing.locales)("%s messages", (locale) => {
  it("state facts instead of talking about the page", () => {
    const messages: unknown = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), "messages", `${locale}.json`),
        "utf8",
      ),
    );
    const hits = findPageReferences(messages, locale, locale).filter(
      ({ field }) => !ALLOWED.has(field.slice(locale.length + 1)),
    );
    expect(hits).toEqual([]);
  });
});
