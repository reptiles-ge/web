"use client";

import { Reveal } from "@/components/Reveal";
import type { Species } from "@/data/species";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import type { HubClusterCard } from "@/lib/clusterGuides";
import { speciesHref } from "@/lib/speciesRoutes";
import { speciesSeoAnchor } from "@/lib/seoKeywords";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

export function RelatedGuideCard({
  card,
  locale,
  species = [],
}: {
  card: HubClusterCard;
  locale: AppLocale;
  species?: Species[];
}) {
  const t = useTranslations("groupHubShared");
  const item =
    card.kind === "species"
      ? species.find((entry) => entry.id === card.id)
      : undefined;
  const href =
    card.kind === "page" ? card.href : speciesHref(card.id, locale);
  const title =
    card.kind === "species" && item
      ? speciesSeoAnchor(item.commonName, item.scientificName)
      : t(`cluster.${card.key}.title`);
  const cta =
    card.kind === "species" && item
      ? t("openProfile")
      : t(`cluster.${card.key}.cta`);

  return (
    <Link
      href={href}
      className="group flex min-h-[180px] flex-col justify-between bg-card p-7 transition-colors hover:bg-background"
    >
      <span className="text-[11px] tracking-[0.2em] text-muted-foreground">
        {t(`cluster.${card.key}.eyebrow`)}
      </span>
      <div className="mt-6">
        <p className="font-display text-[20px] font-semibold text-foreground transition-colors group-hover:text-primary sm:text-[22px]">
          {title}
        </p>
        <p className="mt-2 max-w-xl text-[14px] text-muted-foreground">
          {t(`cluster.${card.key}.body`)}
        </p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground/70 group-hover:text-primary">
          {cta}
          <ArrowUpRight className="size-3.5" />
        </span>
      </div>
    </Link>
  );
}

export function RelatedGuideGrid({
  cards,
  locale,
  species = [],
  className = "mt-12 grid gap-px overflow-hidden rounded-[24px] bg-border/80 sm:grid-cols-2 lg:grid-cols-3",
}: {
  cards: HubClusterCard[];
  locale: AppLocale;
  species?: Species[];
  className?: string;
}) {
  if (cards.length === 0) return null;

  return (
    <div className={className}>
      {cards.map((card, index) => (
        <Reveal key={card.key} delay={index * 50}>
          <RelatedGuideCard card={card} locale={locale} species={species} />
        </Reveal>
      ))}
    </div>
  );
}
