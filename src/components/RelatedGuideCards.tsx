"use client";

import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

import type { Species } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

import { CoverImage } from "@/components/CoverImage";
import { Reveal } from "@/components/Reveal";
import { Link } from "@/i18n/navigation";
import {
  getHubClusterCardImage,
  type HubClusterCard,
} from "@/lib/clusterGuides";
import { cn } from "@/lib/cn";
import { quizHref } from "@/lib/quizzes";
import { speciesSeoAnchor } from "@/lib/seoKeywords";
import { speciesHref } from "@/lib/speciesRoutes";

export function RelatedGuideCard({
  card,
  featured = false,
  locale,
  species = [],
}: {
  card: HubClusterCard;
  featured?: boolean;
  locale: AppLocale;
  species?: Species[];
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
        className="group grid h-full overflow-hidden bg-card sm:grid-cols-[minmax(17rem,0.38fr)_1fr]"
        href={href}
      >
        <div className="flex min-h-[180px] flex-col p-7 sm:p-8 lg:p-9">
          {copy}
        </div>
        <div className="relative min-h-[200px] bg-secondary sm:min-h-[260px]">
          <CoverImage
            alt=""
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, 65vw"
            src={imageSrc}
          />
        </div>
      </Link>
    );
  }

  return (
    <Link
      className="group flex h-full min-h-[180px] flex-col bg-card p-7 transition-colors hover:bg-background"
      href={href}
    >
      {copy}
    </Link>
  );
}

export function RelatedGuideGrid({
  cards,
  className = "mt-12",
  locale,
  species = [],
}: {
  cards: HubClusterCard[];
  className?: string;
  locale: AppLocale;
  species?: Species[];
}) {
  if (cards.length === 0) return null;

  const featured = cards.length === 1;
  const columns = featured ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div
      className={cn(
        className,
        "grid gap-px overflow-hidden rounded-[24px] bg-border/80",
        columns,
      )}
    >
      {cards.map((card, index) => (
        <Reveal className="contents" delay={index * 50} key={card.key}>
          <RelatedGuideCard
            card={card}
            featured={featured}
            locale={locale}
            species={species}
          />
        </Reveal>
      ))}
    </div>
  );
}
