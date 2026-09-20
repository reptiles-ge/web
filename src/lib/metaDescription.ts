export const MAX_META_DESCRIPTION_LENGTH = 160;

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
