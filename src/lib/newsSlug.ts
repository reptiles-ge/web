export const NEWS_ARCHIVE_SEGMENT = "page";

export const NEWS_RESERVED_SLUGS: readonly string[] = [NEWS_ARCHIVE_SEGMENT];

const NEWS_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function newsSlugIssue(slug: string): null | string {
  if (!NEWS_SLUG_PATTERN.test(slug)) {
    return `news slug "${slug}" must be lowercase Latin words joined by single hyphens`;
  }
  if (!/[a-z]/.test(slug)) {
    return `news slug "${slug}" must contain a letter so it never reads as a page or year`;
  }
  if (NEWS_RESERVED_SLUGS.includes(slug)) {
    return `news slug "${slug}" is reserved for the news archive URL`;
  }
  return null;
}
