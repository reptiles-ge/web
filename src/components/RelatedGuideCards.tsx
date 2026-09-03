"use client";

import { CoverImage } from "@/components/CoverImage";
import { Reveal } from "@/components/Reveal";
import type { Species } from "@/data/species";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import {
  getHubClusterCardImage,
  type HubClusterCard,
} from "@/lib/clusterGuides";
import { quizHref } from "@/lib/quizzes";
import { speciesHref } from "@/lib/speciesRoutes";
import { speciesSeoAnchor } from "@/lib/seoKeywords";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

export function RelatedGuideCard({
  card,
  locale,
  species = [],
  featured = false,
}: {
  card: HubClusterCard;
  locale: AppLocale;
  species?: Species[];
  featured?: boolean;
}) {
  const t = useTranslations("groupHubShared");
  const item =
    card.kind === "species"
      ? species.find((entry) => entry.id === card.id)
      : undefined;
  const href =
    card.kind === "page"
      ? card.href
      : card.kind === "quiz"
        ? quizHref(card.id, locale)
        : speciesHref(card.id, locale);
  const title =
    card.kind === "species" && item
      ? speciesSeoAnchor(item.commonName, item.scientificName)
      : t(`cluster.${card.key}.title`);
  const cta =
    card.kind === "species" && item
      ? t("openProfile")
      : t(`cluster.${card.key}.cta`);
  const imageSrc = getHubClusterCardImage(card);

  const copy = (
    <>
      <span className="text-[11px] tracking-[0.2em] text-muted-foreground">
        {t(`cluster.${card.key}.eyebrow`)}
      </span>
      <p className="mt-6 font-display text-[20px] font-semibold text-foreground transition-colors group-hover:text-primary sm:text-[22px]">
        {title}
      </p>
      <p className="mt-2 max-w-xl flex-1 text-[14px] text-muted-foreground">
        {t(`cluster.${card.key}.body`)}
      </p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground/70 group-hover:text-primary">
        {cta}
        <ArrowUpRight className="size-3.5" />
      </span>
    </>
  );

  if (featured && imageSrc) {
    return (
      <Link
        href={href}
        className="group grid h-full overflow-hidden bg-card sm:grid-cols-[minmax(17rem,0.38fr)_1fr]"
      >
        <div className="flex min-h-[180px] flex-col p-7 sm:p-8 lg:p-9">
          {copy}
        </div>
        <div className="bg-muted relative min-h-[200px] sm:min-h-[260px]">
          <CoverImage
            src={imageSrc}
            alt=""
            sizes="(max-width: 640px) 100vw, 65vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group flex h-full min-h-[180px] flex-col bg-card p-7 transition-colors hover:bg-background"
    >
      {copy}
    </Link>
  );
}

export function RelatedGuideGrid({
  cards,
  locale,
  species = [],
  className = "mt-12",
}: {
  cards: HubClusterCard[];
  locale: AppLocale;
  species?: Species[];
  className?: string;
}) {
  if (cards.length === 0) return null;

  const featured = cards.length === 1;
  const columns = featured ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div
      className={`${className} grid gap-px overflow-hidden rounded-[24px] bg-border/80 ${columns}`}
    >
      {cards.map((card, index) => (
        <Reveal key={card.key} delay={index * 50} className="contents">
          <RelatedGuideCard
            card={card}
            locale={locale}
            species={species}
            featured={featured}
          />
        </Reveal>
      ))}
    </div>
  );
}
