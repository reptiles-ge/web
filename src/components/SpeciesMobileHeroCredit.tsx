"use client";

import { Camera, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import type { PhotoCredit } from "@/data/speciesTypes";

import { useContributorDirectory } from "@/components/ContributorsProvider";
import { MOBILE_HERO_PHOTO_CHANGE_EVENT } from "@/components/SpeciesMobileHeroCarousel";
import { creditContributor } from "@/lib/contributorCredits";

export function SpeciesMobileHeroCredit({
  credits,
  speciesId,
}: {
  credits: Array<PhotoCredit | undefined>;
  speciesId: string;
}) {
  const t = useTranslations("profile");
  const contributors = useContributorDirectory();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    function onChange(event: Event) {
      const detail = (
        event as CustomEvent<{ index: number; speciesId: string }>
      ).detail;
      if (detail.speciesId === speciesId) setIndex(detail.index);
    }
    window.addEventListener(MOBILE_HERO_PHOTO_CHANGE_EVENT, onChange);
    return () =>
      window.removeEventListener(MOBILE_HERO_PHOTO_CHANGE_EVENT, onChange);
  }, [speciesId]);

  const credit = credits[index];
  const photographer = credit?.photographer?.trim();
  if (!credit || !photographer) return null;
  const author = creditContributor(contributors, credit);

  return (
    <p
      aria-live="polite"
      className="flex min-h-6 flex-wrap items-center gap-x-2 px-6 text-[12px] text-muted-foreground lg:hidden"
    >
      <span className="flex min-w-0 flex-[1_1_auto] items-center gap-2 py-1 leading-snug">
        <Camera aria-hidden="true" className="size-3.5 shrink-0" />
        <span className="min-w-0">
          {[author ? author.name : photographer, credit.location]
            .filter(Boolean)
            .join(" · ")}
        </span>
      </span>{" "}
      {credit.photoConfidence === "georgia-field" ? (
        <span className="inline-flex shrink-0 items-center gap-1 font-medium text-primary">
          <Check aria-hidden="true" className="size-3.5" strokeWidth={2.2} />
          {t("georgiaFieldPhoto")}
        </span>
      ) : null}
    </p>
  );
}
