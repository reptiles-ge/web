"use client";

import { useLocale, useTranslations } from "next-intl";
import { type ReactNode } from "react";

import type { AppLocale } from "@/i18n/routing";

import { hasPhotoCredit, type PhotoCredit } from "@/data/species";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { formatPhotoDate } from "@/lib/formatDate";

type PhotoCreditCaptionProps = {
  className?: string;
  credit?: PhotoCredit;
  speciesId?: string;
  variant?: "hero" | "lightbox" | "thumb";
};

export function PhotoCreditCaption({
  className = "",
  credit,
  speciesId,
  variant = "thumb",
}: PhotoCreditCaptionProps) {
  const t = useTranslations("profile");
  const locale = useLocale() as AppLocale;

  if (!hasPhotoCredit(credit) || variant === "hero") return null;

  const dateLabel = credit.date ? formatPhotoDate(credit.date, locale) : null;
  const photographer = (
    <PhotoCreditName credit={credit} speciesId={speciesId} />
  );
  const meta = [credit.location, dateLabel].filter(Boolean).join(" · ");

  if (variant === "lightbox") {
    return (
      <LightboxCredit
        className={className}
        credit={credit}
        dateLabel={dateLabel}
        photoCredit={t("photoCredit")}
        photoDate={t("photoDate")}
        photographer={photographer}
        photoLocation={t("photoLocation")}
      />
    );
  }

  return (
    <figcaption
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 z-2 bg-linear-to-t from-black/55 to-transparent px-3 pt-8 pb-2.5 text-[10px] leading-snug tracking-[0.04em] text-white/70 opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100",
        className,
      )}
    >
      {photographer ? (
        <p>
          <span className="text-white/45">{t("photoCredit")} </span>
          <span className="pointer-events-auto">{photographer}</span>
        </p>
      ) : null}
      {meta ? (
        <p className="mt-0.5 text-white/55">
          {credit.location ? <span>{credit.location}</span> : null}
          {credit.location && dateLabel ? " · " : null}
          {dateLabel && credit.date ? (
            <time dateTime={credit.date}>{dateLabel}</time>
          ) : null}
        </p>
      ) : null}
    </figcaption>
  );
}

function LightboxCredit({
  className,
  credit,
  dateLabel,
  photoCredit,
  photoDate,
  photographer,
  photoLocation,
}: {
  className: string;
  credit: PhotoCredit;
  dateLabel: null | string;
  photoCredit: string;
  photoDate: string;
  photographer: ReactNode;
  photoLocation: string;
}) {
  return (
    <div
      className={cn(
        "space-y-0.5 text-center text-[13px] leading-snug tracking-[0.02em] text-white/55",
        className,
      )}
    >
      {photographer ? (
        <p>
          <span className="text-white/35">{photoCredit} </span>
          {photographer}
        </p>
      ) : null}
      {credit.location ? (
        <p>
          <span className="text-white/35">{photoLocation} </span>
          <span>{credit.location}</span>
        </p>
      ) : null}
      {dateLabel ? (
        <p>
          <span className="text-white/35">{photoDate} </span>
          <time dateTime={credit.date}>{dateLabel}</time>
        </p>
      ) : null}
    </div>
  );
}

function PhotoCreditName({
  credit,
  speciesId,
}: {
  credit: PhotoCredit;
  speciesId?: string;
}) {
  if (!credit.photographer) return null;
  if (!credit.url) return <span>{credit.photographer}</span>;
  return (
    <a
      className="underline decoration-white/25 underline-offset-2 transition-colors hover:decoration-white/70"
      href={credit.url}
      onClick={(event) => {
        event.stopPropagation();
        if (speciesId) {
          trackEvent("source_click", {
            link_type: "photo_credit",
            species_id: speciesId,
          });
        }
      }}
      rel="noopener noreferrer"
      target="_blank"
    >
      {credit.photographer}
    </a>
  );
}
