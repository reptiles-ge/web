"use client";

import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Info,
  TriangleAlert,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

import { eyebrowClass, focusClass, h2Class } from "./shared";

const CLUSTER_LINKS = [
  { href: "/snakes/gavrtseleba", key: "clusterSnakes" },
  { href: "/lizards/saxeoebebi", key: "clusterLizards" },
  { href: "/turtles/saxeoebebi", key: "clusterTurtles" },
  { href: "/amphibians/saxeoebebi", key: "clusterAmphibians" },
] as const;

const SEO_LINKS = [
  { href: "/species", key: "species" },
  { href: "/venomous-snakes", key: "venomous" },
  { href: "/", key: "home" },
] as const;

export function RegionsGuide() {
  const t = useTranslations("regions");

  return (
    <section className="pt-11 pb-10 lg:pt-[88px] lg:pb-24">
      <div className="lg:mx-auto lg:box-content lg:grid lg:max-w-[1320px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start lg:gap-14 lg:px-[60px]">
        <div>
          <div className="px-6 lg:px-0">
            <p className={eyebrowClass}>{t("clusterEyebrow")}</p>
            <h2 className={cn(h2Class, "lg:text-[38px]")}>
              {t("clusterTitle")}
            </h2>
            <p className="mt-3 text-[15px] leading-[1.6] text-(--nw-muted) lg:mt-[18px] lg:text-[16px] lg:leading-[1.65]">
              <span className="lg:hidden">{t("clusterBodyShort")}</span>
              <span className="hidden lg:inline">{t("clusterBody")}</span>
            </p>
          </div>
          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto px-6 py-1 lg:mt-5 lg:flex-wrap lg:gap-2.5 lg:overflow-visible lg:px-0">
            {CLUSTER_LINKS.map((link) => (
              <Link
                className={cn(
                  "inline-flex h-11 shrink-0 items-center gap-2 rounded-full border border-transparent bg-(--nw-card) px-4 text-[14px] font-medium whitespace-nowrap text-(--nw-ink) shadow-(--rg-pill-shadow) hover:border-(--nw-accent) hover:text-(--nw-accent) motion-safe:transition-colors lg:px-[18px]",
                  focusClass,
                )}
                href={link.href}
                key={link.key}
              >
                {t(link.key)}
                <ArrowUpRight
                  aria-hidden="true"
                  className="hidden size-3.5 text-(--nw-muted) lg:block"
                  strokeWidth={1.75}
                />
              </Link>
            ))}
          </div>
          <div className="px-6 lg:px-0">
            <Link
              className={cn(
                "mt-3 flex items-center gap-3.5 rounded-3xl bg-(--nw-panel) p-[18px] text-white lg:mt-6 lg:gap-4 lg:rounded-[26px] lg:px-[22px] lg:py-5",
                focusClass,
              )}
              href="/venomous-snakes"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-(--rg-alert)">
                <TriangleAlert
                  aria-hidden="true"
                  className="size-[18px]"
                  strokeWidth={1.75}
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15.5px] font-semibold lg:text-[16px]">
                  {t("seo.links.venomous")}
                </span>
                <span className="mt-[3px] block text-[13px] text-white/70 lg:text-[13.5px]">
                  <span className="lg:hidden">
                    {t("venomousCardBodyShort")}
                  </span>
                  <span className="hidden lg:inline">
                    {t("venomousCardBody")}
                  </span>
                </span>
              </span>
              <ArrowRight
                aria-hidden="true"
                className="size-4 shrink-0"
                strokeWidth={1.75}
              />
            </Link>
            <details className="group mt-4 rounded-[22px] bg-(--nw-card) px-5 shadow-[0_1px_2px_rgba(14,20,17,0.04),0_10px_26px_rgba(14,20,17,0.05)] lg:hidden">
              <summary
                className={cn(
                  "flex min-h-[60px] cursor-pointer list-none items-center justify-between gap-3 rounded-[22px] text-[16px] font-semibold text-(--nw-ink) [&::-webkit-details-marker]:hidden",
                  focusClass,
                )}
              >
                <span>{t("seo.title")}</span>
                <ChevronDown
                  aria-hidden="true"
                  className="size-[18px] shrink-0 group-open:rotate-180 motion-safe:transition-transform"
                  strokeWidth={1.75}
                />
              </summary>
              <div className="pb-[18px] text-[14.5px] leading-[1.7] text-(--nw-soft)">
                <p>{t("seo.p1")}</p>
                <p className="mt-3">{t("dataGapBody")}</p>
              </div>
            </details>
          </div>
        </div>
        <article className="hidden rounded-[32px] bg-(--nw-card) px-[38px] py-[34px] shadow-(--rg-card-shadow) lg:block">
          <p className={eyebrowClass}>{t("seo.eyebrow")}</p>
          <h2 className="mt-3 text-[28px] leading-[1.2] font-semibold tracking-[-0.01em] text-(--nw-ink)">
            {t("seo.title")}
          </h2>
          <p className="mt-4 text-[15px] leading-[1.75] text-(--nw-soft)">
            {t("seo.p1")}
          </p>
          <p className="mt-3.5 text-[15px] leading-[1.75] text-(--nw-soft)">
            {t("seo.p2")}
          </p>
          <div className="mt-5 flex items-start gap-3.5 rounded-[18px] bg-(--nw-wash) px-[18px] py-4">
            <Info
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-(--nw-accent)"
              strokeWidth={1.75}
            />
            <p className="text-[14px] leading-[1.65] text-(--nw-soft)">
              {t("dataGapBody")}
            </p>
          </div>
          <div className="mt-[22px] flex flex-wrap gap-x-[22px] gap-y-2">
            {SEO_LINKS.map((link) => (
              <Link
                className={cn(
                  "inline-flex min-h-11 items-center gap-1.5 text-[14px] font-medium text-(--nw-accent)",
                  focusClass,
                )}
                href={link.href}
                key={link.key}
              >
                {t(`seo.links.${link.key}`)}
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-3.5"
                  strokeWidth={1.75}
                />
              </Link>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
