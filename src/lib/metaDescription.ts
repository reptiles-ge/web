const MAX_META_DESCRIPTION_LENGTH = 160;
const SENTENCE_BOUNDARY = /(?<=[.!?])\s+(?=[\p{Lu}\p{Nd}\u10D0-\u10FF])/u;

export function sentenceMetaDescription(
  text: string,
  maxLength = MAX_META_DESCRIPTION_LENGTH,
) {
  const cleaned = stripInlineMarkdownLinks(text).replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxLength) return cleaned;

  const sentences = cleaned.split(SENTENCE_BOUNDARY);
  let description = sentences[0];
  for (const sentence of sentences.slice(1)) {
    const next = `${description} ${sentence}`;
    if (next.length > maxLength) break;
    description = next;
  }
  return description;
}

export function shortMetaDescription(
  text: string,
  maxLength = MAX_META_DESCRIPTION_LENGTH,
) {
  const cleaned = stripInlineMarkdownLinks(text).replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxLength) return cleaned;

  const truncated = cleaned.slice(0, maxLength - 1);
  const lastSpace = truncated.lastIndexOf(" ");
  const clipped = lastSpace > 80 ? truncated.slice(0, lastSpace) : truncated;
  return `${clipped.trim()}…`;
}

function stripInlineMarkdownLinks(text: string) {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}
