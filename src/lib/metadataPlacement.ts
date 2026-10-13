export const BLOCKING_METADATA_USER_AGENTS = /.*/;

const HEAD_END = "</head>";

const REQUIRED_HEAD_TAGS = {
  canonical: /<link\b[^>]*\brel="canonical"/i,
  description: /<meta\b[^>]*\bname="description"/i,
  "og:image": /<meta\b[^>]*\bproperty="og:image"/i,
  "og:title": /<meta\b[^>]*\bproperty="og:title"/i,
  robots: /<meta\b[^>]*\bname="robots"/i,
  title: /<title[\s>]/i,
  "twitter:card": /<meta\b[^>]*\bname="twitter:card"/i,
} as const;

const HEAD_ONLY_TAGS = {
  ...REQUIRED_HEAD_TAGS,
  hreflang: /<link\b[^>]*\bhreflang="/i,
  "og:*": /<meta\b[^>]*\bproperty="og:/i,
  "twitter:*": /<meta\b[^>]*\bname="twitter:/i,
} as const;

export type MetadataPlacementProblem = {
  issue: "in-body" | "missing-from-head";
  tag: MetadataTag;
};

type MetadataTag = keyof typeof HEAD_ONLY_TAGS;

export function metadataPlacementProblems(
  html: string,
): MetadataPlacementProblem[] {
  const headEnd = html.indexOf(HEAD_END);
  const head = headEnd === -1 ? "" : html.slice(0, headEnd);
  const body = headEnd === -1 ? html : html.slice(headEnd);
  const bodyMarkup = body.replace(/<svg\b[\s\S]*?<\/svg>/gi, "");

  const missing = Object.entries(REQUIRED_HEAD_TAGS)
    .filter(([, pattern]) => !pattern.test(head))
    .map(([tag]) => ({
      issue: "missing-from-head" as const,
      tag: tag as MetadataTag,
    }));
  const misplaced = Object.entries(HEAD_ONLY_TAGS)
    .filter(([, pattern]) => pattern.test(bodyMarkup))
    .map(([tag]) => ({ issue: "in-body" as const, tag: tag as MetadataTag }));

  return [...missing, ...misplaced];
}
