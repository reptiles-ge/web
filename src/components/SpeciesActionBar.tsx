import { Images, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { SpeciesScientificNameCopy } from "@/components/SpeciesScientificNameCopy";
import { SPECIES_SECTION_IDS } from "@/lib/toc";

export async function SpeciesActionBar({
  emergency,
  galleryCount,
  gallerySrc,
  locale,
  shareText,
  shareTitle,
  speciesId,
}: {
  emergency: boolean;
  galleryCount: number;
  gallerySrc: null | string;
  locale: AppLocale;
  shareText: string;
  shareTitle: string;
  speciesId: string;
}) {
  if (!emergency && !gallerySrc) return null;

  const [t, tSafety] = await Promise.all([
    getTranslations({ locale, namespace: "profile" }),
    getTranslations({ locale, namespace: "home.safetyStrip" }),
  ]);

  return (
    <div className="sticky bottom-3 z-30 mx-3 mt-8 flex h-[68px] items-center gap-2 rounded-full bg-card/95 p-2 shadow-[0_14px_40px_rgba(14,20,17,0.26)] ring-1 ring-foreground/8 backdrop-blur-xl lg:hidden">
      {emergency ? (
        <a
          aria-label={tSafety("call")}
          className="flex h-[52px] min-w-0 flex-1 items-center justify-center gap-2 rounded-full bg-destructive text-[16px] font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destructive"
          href="tel:112"
        >
          <Phone aria-hidden="true" className="size-4" strokeWidth={2} />
          112
          <span className="truncate text-[14px] font-medium text-white/85">
            {t("emergencyShort")}
          </span>
        </a>
      ) : (
        <a
          className="flex h-[52px] min-w-0 flex-1 items-center justify-center gap-2 rounded-full bg-foreground px-4 text-[15px] font-medium text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          data-species-gallery-src={gallerySrc ?? undefined}
          href={`#${SPECIES_SECTION_IDS.gallery}`}
        >
          <Images aria-hidden="true" className="size-4 shrink-0" />
          <span className="truncate">
            {t("viewPhotos", { count: galleryCount })}
          </span>
        </a>
      )}
      <SpeciesScientificNameCopy
        className="size-[52px] bg-surface text-foreground hover:bg-secondary focus-visible:outline-offset-2 focus-visible:outline-primary"
        shareTitle={shareTitle}
        speciesId={speciesId}
        text={shareText}
      />
    </div>
  );
}
