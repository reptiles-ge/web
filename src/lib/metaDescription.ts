export const MAX_META_DESCRIPTION_LENGTH = 160;

export function shortMetaDescription(
  text: string,
  maxLength = MAX_META_DESCRIPTION_LENGTH,
) {
  const lead = firstSentence(stripInlineMarkdownLinks(text));
  if (lead.length <= maxLength) return lead;

  const truncated = lead.slice(0, maxLength - 1);
  const lastSpace = truncated.lastIndexOf(" ");
  const clipped = (
    lastSpace > 80 ? truncated.slice(0, lastSpace) : truncated
  ).trim();
  return `${clipped}…`;
}

function firstSentence(text: string) {
  const trimmed = text.trim();
  const match = trimmed.match(/^.*?[.!?…](?=\s|$)/u);
  return match ? match[0].trim() : trimmed;
}

function stripInlineMarkdownLinks(text: string) {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}
