import type { AppLocale } from "@/i18n/routing";

import type { AuthorTextsInput } from "./authors";

import { EDIT_LOCALES } from "./textEdits";

export type AuthorDraft = {
  bio: string;
  metaDescription: string;
  name: string;
};

export type AuthorDrafts = Record<AppLocale, AuthorDraft>;

const LOCALES = EDIT_LOCALES.map(({ value }) => value);

export function authorTextIssues(drafts: AuthorDrafts) {
  return LOCALES.flatMap((locale) => {
    const draft = drafts[locale];
    if (draft.name.trim()) return [];
    if (locale === "ka") return ["ka: the Georgian name is required."];
    return draft.bio.trim() || draft.metaDescription.trim()
      ? [`${locale}: add a name, or clear the bio and meta description.`]
      : [];
  });
}

export function authorTextsInput(drafts: AuthorDrafts): AuthorTextsInput {
  return Object.fromEntries(
    LOCALES.flatMap((locale) => {
      const { bio, metaDescription, name } = drafts[locale];
      if (locale !== "ka" && !name.trim()) return [];
      return [
        [
          locale,
          {
            ...(bio.trim() ? { bio } : {}),
            ...(metaDescription.trim() ? { metaDescription } : {}),
            name,
          },
        ],
      ];
    }),
  ) as AuthorTextsInput;
}
