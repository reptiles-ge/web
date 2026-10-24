import type { NewsArticle, NewsSection } from "@/data/newsTypes";
import type { NewsIssue } from "@/lib/newsRules";

import { locales } from "@/i18n/locales";

export function newsCopyIssues(
  current: Partial<NewsArticle["copy"]>,
  next: Partial<NewsArticle["copy"]>,
): NewsIssue[] {
  const issues: NewsIssue[] = [];
  for (const locale of locales) {
    const before = current[locale];
    const after = next[locale];
    if (!before && !after) continue;
    if (!before || !after) {
      issues.push({
        message: before
          ? `A text edit cannot remove the ${locale} text`
          : `A text edit cannot add a ${locale} text`,
        path: ["copy", locale],
      });
      continue;
    }
    if (before.sections.length !== after.sections.length) {
      issues.push({
        message: `${locale} has ${after.sections.length} sections, expected ${before.sections.length}`,
        path: ["copy", locale, "sections"],
      });
    }
    if (figures(before.sections) !== figures(after.sections)) {
      issues.push({
        message: `A text edit cannot add, remove or reorder ${locale} photos`,
        path: ["copy", locale, "sections"],
      });
    }
  }
  return issues;
}

function figures(sections: readonly NewsSection[]) {
  return sections
    .flatMap((section) =>
      section.blocks.flatMap((block) =>
        block.type === "figure" ? [block.src] : [],
      ),
    )
    .join("\n");
}
