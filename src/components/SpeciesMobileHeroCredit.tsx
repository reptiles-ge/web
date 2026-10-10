"use client";

import { Camera, Check } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import type { PhotoCredit } from "@/data/speciesTypes";
import type { AppLocale } from "@/i18n/routing";

import { MOBILE_HERO_PHOTO_CHANGE_EVENT } from "@/components/SpeciesMobileHeroCarousel";
import {
  creditAuthorName,
  getPublishedCreditAuthorByName,
} from "@/data/creditAuthors";

export function SpeciesMobileHeroCredit({
  credits,
  speciesId,
}: {
  credits: Array<PhotoCredit | undefined>;
  speciesId: string;
}) {
  const t = useTranslations("profile");
  const locale = useLocale() as AppLocale;
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
  const author = getPublishedCreditAuthorByName(photographer);

  return (
    <p
      aria-live="polite"
      className="flex min-h-6 items-center gap-2 px-6 text-[12px] text-muted-foreground lg:hidden"
    >
      <Camera aria-hidden="true" className="size-3.5 shrink-0" />
      <span className="min-w-0 flex-1 truncate">
        {[
          author ? creditAuthorName(author, locale) : photographer,
          credit.location,
        ]
          .filter(Boolean)
          .join(" · ")}
      </span>
      {credit.photoConfidence === "georgia-field" ? (
        <span className="inline-flex shrink-0 items-center gap-1 font-medium text-primary">
          <Check aria-hidden="true" className="size-3.5" strokeWidth={2.2} />
          {t("georgiaFieldPhoto")}
        </span>
      ) : null}
    </p>
  );
}
