"use client";

import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import type { RegionSpeciesCardItem } from "@/data/regions";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { ClientCoverImage } from "@/components/ClientCoverImage";
import { useSpeciesHref } from "@/components/LocaleSwitchProvider";
import {
  eyebrowClass,
  focusClass,
  wrapClass,
} from "@/components/regions-index/shared";
import { Link } from "@/i18n/navigation";
import { trackSpeciesClick } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { speciesImageAlt } from "@/lib/speciesMeta";
import { REGION_SECTION_IDS } from "@/lib/toc";

import { regionH2Class, scrollerClass } from "./classes";
import { RegionSpeciesTag } from "./parts";

export function RegionVenomous({
  name,
  nameIn,
  species,
}: {
  name: string;
  nameIn: string;
  species: RegionSpeciesCardItem[];
}) {
  const t = useTranslations("regions");
  const title = t("venomousTitle", { name, nameIn });
  const sorted = species.toSorted(
    (a, b) => Number(b.danger === "High") - Number(a.danger === "High"),
  );

  return (
    <section className="pt-9 lg:pt-[72px]">
      <div
        className={cn(
          wrapClass,
          "lg:grid lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start lg:gap-14 xl:grid-cols-[380px_minmax(0,1fr)]",
        )}
      >
        <div className="lg:sticky lg:top-[172px]">
          <p className={cn(eyebrowClass, "text-(--rg-venom)")}>
            {t("venomousEyebrow")}
          </p>
          <AnchoredHeading
            anchorLabel={t("anchorLink")}
            className={regionH2Class}
            id={REGION_SECTION_IDS.venomous}
          >
            {title}
          </AnchoredHeading>
          <p className="mt-2.5 text-[14.5px] leading-[1.65] text-(--nw-muted) lg:mt-4 lg:text-[15.5px] lg:leading-[1.7]">
            {t("venomousBody")}
          </p>
          <BiteGuideLink className="mt-6 hidden lg:inline-flex" />
        </div>
        <ul
          className={cn(
            scrollerClass,
            "mt-4 lg:mx-0 lg:mt-0 lg:flex-col lg:gap-4 lg:overflow-visible lg:px-0",
          )}
        >
          {sorted.map((item) => (
            <li
              className="w-[300px] shrink-0 snap-start lg:w-auto"
              key={item.id}
            >
              <RegionVenomousCard species={item} />
            </li>
          ))}
        </ul>
        <BiteGuideLink className="mt-3.5 flex lg:hidden" />
      </div>
    </section>
  );
}

function BiteGuideLink({ className }: { className: string }) {
  const t = useTranslations("regions");

  return (
    <Link
      className={cn(
        "items-center justify-between gap-3 rounded-[20px] bg-(--nw-card) px-[18px] py-4 text-[14.5px] font-semibold text-(--nw-ink) lg:justify-start lg:gap-2.5 lg:rounded-none lg:bg-transparent lg:p-0",
        focusClass,
        className,
      )}
      href="/snakes/gvelis-nakbeni"
    >
      <span className="lg:border-b lg:border-(--nw-ink)/30 lg:pb-0.5">
        {t("biteGuideLink")}
      </span>
      <ArrowRight
        aria-hidden="true"
        className="size-4 shrink-0"
        strokeWidth={1.75}
      />
    </Link>
  );
}

function RegionVenomousCard({ species }: { species: RegionSpeciesCardItem }) {
  const locale = useLocale();
  const t = useTranslations("regions");

  return (
    <Link
      className={cn(
        "group block h-full overflow-hidden rounded-3xl bg-(--nw-card) lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:rounded-[28px] lg:shadow-(--nw-shadow) lg:hover:shadow-(--nw-shadow-side-hover) lg:motion-safe:transition-[translate,box-shadow] lg:motion-safe:duration-250 lg:motion-safe:hover:translate-y-[-3px]",
        focusClass,
      )}
      href={useSpeciesHref(species.id, locale)}
      onClick={() =>
        trackSpeciesClick({ source: "region", species_id: species.id })
      }
    >
      <span className="relative block h-[170px] bg-(--nw-cover) lg:h-auto lg:min-h-[200px]">
        <ClientCoverImage
          alt={speciesImageAlt(
            species.commonName,
            species.scientificName,
            species.location,
          )}
          className="object-cover"
          sizes="(max-width: 1023px) 300px, 220px"
          src={species.mobileImage ?? species.image}
        />
        <RegionSpeciesTag
          className="absolute top-3 left-3 lg:hidden"
          species={species}
        />
      </span>
      <span className="block px-[18px] pt-4 pb-[18px] lg:flex lg:flex-col lg:px-7 lg:py-[26px]">
        <span className="hidden lg:flex">
          <RegionSpeciesTag species={species} />
        </span>
        <span className="block text-[19px] font-semibold text-(--nw-ink) lg:mt-3.5 lg:text-[26px] lg:leading-[1.15] lg:tracking-[-0.012em]">
          {species.commonName}
        </span>
        <span className="mt-0.5 block text-[13.5px] text-(--nw-muted) italic lg:mt-1 lg:text-[15px]">
          {species.scientificName}
        </span>
        <span className="mt-2.5 block text-[13.5px] leading-[1.55] text-(--nw-soft) lg:mt-3.5 lg:text-[14.5px] lg:leading-[1.6]">
          {species.location}
        </span>
        <span className="hidden flex-1 lg:block" />
        <span className="mt-[18px] hidden items-center gap-2 text-[14px] font-semibold text-(--nw-ink) lg:inline-flex">
          {t("fullProfile")}
          <ArrowRight
            aria-hidden="true"
            className="size-[15px]"
            strokeWidth={1.75}
          />
        </span>
      </span>
    </Link>
  );
}
