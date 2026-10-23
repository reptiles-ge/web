import type { NewsArticle, NewsSection } from "@/data/newsTypes";

import { locales } from "@/i18n/locales";
import { newsSlugIssue } from "@/lib/newsSlug";

export type NewsIssue = { message: string; path: (number | string)[] };

export type NewsKnownIds = {
  authorIds: ReadonlySet<string>;
  hubIds: ReadonlySet<string>;
  regionIds: ReadonlySet<string>;
  speciesIds: ReadonlySet<string>;
};

type NewsRuleArticle = Omit<NewsArticle, "copy"> & {
  copy: Partial<NewsArticle["copy"]>;
};

export const NEWS_SHORTER_TRANSLATIONS: ReadonlySet<string> = new Set([
  "bezoar-goat-restoration-javakheti-2026",
  "caucasian-toad-bufo-verrucosissimus-taxonomy-2026",
  "georgian-snakes-area-of-occupancy-2026",
  "leatherback-turtle-first-turkish-black-sea-records-2026",
]);

export const NEWS_UNLISTED_REGION_LINKS: Readonly<
  Record<string, readonly string[]>
> = {
  "armenia-power-line-bird-electrocution": ["samtskhe-javakheti"],
  "shahdagi-dombis-8-khbo": ["abkhazia", "samegrelo-zemo-svaneti"],
};

export function newsArticleIssues(article: NewsRuleArticle): NewsIssue[] {
  const issues: NewsIssue[] = [];
  const issue = (message: string, ...path: (number | string)[]) =>
    issues.push({ message, path });

  if (article.id !== article.slug) issue("id must equal slug", "id");
  const slugIssue = newsSlugIssue(article.slug);
  if (slugIssue) issue(slugIssue, "slug");
  if (!article.copy.ka) issue("Georgian copy is required", "copy", "ka");

  const photoSrcs = [
    ...(article.image ? [article.image.src] : []),
    ...(article.gallery ?? []).map((photo) => photo.src),
  ];
  (article.gallery ?? []).forEach((photo, index) => {
    if (photoSrcs.indexOf(photo.src) !== photoSrcs.lastIndexOf(photo.src))
      issue(`Photo ${photo.src} is listed twice`, "gallery", index, "src");
  });
  const ownPhotos = new Set(photoSrcs);

  const ka = article.copy.ka?.sections ?? [];
  const kaFigures = newsFigures(ka);
  for (const locale of newsArticleLocales(article)) {
    const sections = article.copy[locale]!.sections;
    if (
      locale !== "ka" &&
      sections.length !== ka.length &&
      !NEWS_SHORTER_TRANSLATIONS.has(article.slug)
    )
      issue(
        `${locale} has ${sections.length} sections, ka has ${ka.length}`,
        "copy",
        locale,
        "sections",
      );
    const figures = newsFigures(sections);
    if (figures.join("\n") !== kaFigures.join("\n"))
      issue(`${locale} figures differ from ka`, "copy", locale, "sections");
    for (const src of figures) {
      if (!ownPhotos.has(src))
        issue(
          `Figure ${src} is not one of the article's photos`,
          "copy",
          locale,
          "sections",
        );
    }
  }

  const links = newsBodyLinks(article);
  const unlisted = new Set(NEWS_UNLISTED_REGION_LINKS[article.slug]);
  const relatedSpecies = new Set<string>(article.relatedSpeciesIds);
  const relatedRegions = new Set<string>(article.relatedRegionIds);
  const relatedHubs = new Set<string>(article.relatedHubIds);
  for (const id of links.species) {
    if (!relatedSpecies.has(id))
      issue(`Linked species ${id} is missing`, "relatedSpeciesIds");
  }
  for (const id of links.region) {
    if (!relatedRegions.has(id) && !unlisted.has(id))
      issue(`Linked region ${id} is missing`, "relatedRegionIds");
  }
  for (const id of links.hub) {
    if (!relatedHubs.has(id))
      issue(`Linked hub ${id} is missing`, "relatedHubIds");
  }
  for (const key of [
    "relatedHubIds",
    "relatedRegionIds",
    "relatedSpeciesIds",
  ] as const) {
    const ids: readonly string[] = article[key];
    if (new Set(ids).size !== ids.length) issue("Duplicate id", key);
  }
  return issues;
}

export function newsArticleLocales(article: NewsRuleArticle) {
  return locales.filter((locale) => article.copy[locale] !== undefined);
}

export function newsBodyLinks(article: NewsRuleArticle) {
  const links = {
    author: new Set<string>(),
    hub: new Set<string>(),
    region: new Set<string>(),
    species: new Set<string>(),
  };
  for (const locale of newsArticleLocales(article)) {
    for (const section of article.copy[locale]!.sections) {
      for (const block of section.blocks) {
        if (block.type !== "p") continue;
        for (const part of block.parts) {
          if (typeof part === "string") continue;
          if (part.type === "credit-author") links.author.add(part.slug);
          if (
            part.type === "hub" ||
            part.type === "region" ||
            part.type === "species"
          )
            links[part.type].add(part.id);
        }
      }
    }
  }
  return links;
}

export function newsReferenceIssues(
  article: NewsRuleArticle,
  known: NewsKnownIds,
): NewsIssue[] {
  const issues: NewsIssue[] = [];
  const links = newsBodyLinks(article);
  const check = (
    ids: Iterable<string>,
    set: ReadonlySet<string>,
    label: string,
    path: string,
  ) => {
    for (const id of ids) {
      if (!set.has(id))
        issues.push({ message: `Unknown ${label} ${id}`, path: [path] });
    }
  };
  check(links.species, known.speciesIds, "species", "copy");
  check(links.region, known.regionIds, "region", "copy");
  check(links.hub, known.hubIds, "hub", "copy");
  check(links.author, known.authorIds, "author", "copy");
  check(
    article.relatedSpeciesIds,
    known.speciesIds,
    "species",
    "relatedSpeciesIds",
  );
  check(
    article.relatedRegionIds,
    known.regionIds,
    "region",
    "relatedRegionIds",
  );
  check(article.relatedHubIds, known.hubIds, "hub", "relatedHubIds");
  return issues;
}

function newsFigures(sections: readonly NewsSection[]) {
  return sections.flatMap((section) =>
    section.blocks.flatMap((block) =>
      block.type === "figure" ? [block.src] : [],
    ),
  );
}
