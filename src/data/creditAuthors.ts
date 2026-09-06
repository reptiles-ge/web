import type { AppLocale } from "@/i18n/routing";

import { pickLocalized } from "@/i18n/localeMeta";

export type CreditAuthor = {
  aliases: string[];
  heroSrc: string;
  id: string;
  name: {
    en: string;
    ka: string;
    ru?: string;
    tr?: string;
  };
  published: boolean;
  slug: string;
};

export const CREDIT_AUTHORS: CreditAuthor[] = [
  {
    aliases: ["სანდრო ხახვა", "Sandro Khakhva"],
    heroSrc: "https://cdn.reptiles.ge/vipera-kaznakovi-sandro-1.jpg",
    id: "sandro-khakhva",
    name: {
      en: "Sandro Khakhva",
      ka: "სანდრო ხახვა",
    },
    published: true,
    slug: "sandro-khakhva",
  },
];

const bySlug = new Map(CREDIT_AUTHORS.map((author) => [author.slug, author]));
const byAlias = new Map<string, CreditAuthor>();
for (const author of CREDIT_AUTHORS) {
  for (const alias of author.aliases) {
    byAlias.set(alias, author);
  }
}

export function creditAuthorHref(slug: string) {
  return {
    params: { slug },
    pathname: "/authors/[slug]" as const,
  };
}

export function creditAuthorName(author: CreditAuthor, locale: AppLocale) {
  return pickLocalized(author.name, locale);
}

export function getCreditAuthorByName(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return undefined;
  return byAlias.get(trimmed);
}

export function getCreditAuthorBySlug(slug: string) {
  return bySlug.get(slug);
}

export function getPublishedCreditAuthorByName(name: string) {
  const author = getCreditAuthorByName(name);
  return author?.published ? author : undefined;
}

export function getPublishedCreditAuthorBySlug(slug: string) {
  const author = getCreditAuthorBySlug(slug);
  return author?.published ? author : undefined;
}

export function getPublishedCreditAuthors() {
  return CREDIT_AUTHORS.filter((author) => author.published);
}
