import type { NewsArticle, NewsSource } from "@/data/newsTypes";

export function newsMentionsCreditAuthor(
  article: Pick<NewsArticle, "copy" | "sources">,
  author: { aliases: readonly string[]; id: string },
) {
  const aliases = new Set([author.id, ...author.aliases]);
  const haystack = [
    ...article.sources.flatMap((source) => [
      ...newsSourceNames(source),
      source.url,
    ]),
    ...Object.values(article.copy).flatMap((copy) =>
      copy
        ? [
            copy.dek,
            copy.lead,
            copy.metaDescription,
            copy.metaTitle,
            copy.title,
            ...copy.sections.flatMap((section) => [
              section.heading,
              ...section.blocks.flatMap((block) =>
                block.type === "p"
                  ? block.parts.map((part) =>
                      typeof part === "string"
                        ? part
                        : part.type === "sci"
                          ? part.name
                          : part.type === "credit-author"
                            ? `${part.slug} ${part.label}`
                            : "label" in part
                              ? part.label
                              : "",
                    )
                  : [],
              ),
            ]),
          ]
        : [],
    ),
  ]
    .join("\n")
    .toLocaleLowerCase();

  for (const alias of aliases) {
    const needle = alias.trim().toLocaleLowerCase();
    if (needle && haystack.includes(needle)) return true;
  }
  return false;
}

export function newsSourceNames(source: NewsSource) {
  return typeof source.name === "string"
    ? [source.name]
    : Object.values(source.name);
}
