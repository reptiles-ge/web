import type { AppLocale } from "@/i18n/routing";

const MAX_META_DESCRIPTION_LENGTH = 160;
const MAX_LATIN_META_DESCRIPTION_LENGTH = 155;
const SENTENCE_BOUNDARY =
  /(?<=[.!?][”“"»’)]*)\s+(?=[\p{Lu}\p{Nd}\u10D0-\u10FF])/u;

export function metaDescriptionLimit(locale: AppLocale) {
  return locale === "ka"
    ? MAX_META_DESCRIPTION_LENGTH
    : MAX_LATIN_META_DESCRIPTION_LENGTH;
}

export function sentenceMetaDescription(
  text: string,
  maxLength = MAX_META_DESCRIPTION_LENGTH,
) {
  const cleaned = stripInlineMarkdownLinks(text).replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxLength) return cleaned;

  const [first = "", ...rest] = cleaned.split(SENTENCE_BOUNDARY);
  let description = first;
  for (const sentence of rest) {
    const next = `${description} ${sentence}`;
    if (next.length > maxLength) break;
    description = next;
  }
  return description;
}

function stripInlineMarkdownLinks(text: string) {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}
