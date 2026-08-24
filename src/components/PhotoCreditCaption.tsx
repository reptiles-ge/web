"use client";

import { hasPhotoCredit, type PhotoCredit } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";
import { formatPhotoDate } from "@/lib/formatDate";
import { useLocale, useTranslations } from "next-intl";

type PhotoCreditCaptionProps = {
  credit?: PhotoCredit;
  variant?: "hero" | "thumb" | "lightbox";
  className?: string;
};

export function PhotoCreditCaption({
  credit,
  variant = "thumb",
  className = "",
}: PhotoCreditCaptionProps) {
  const t = useTranslations("profile");
  const locale = useLocale() as AppLocale;

  if (!hasPhotoCredit(credit)) return null;

  const dateLabel = credit.date ? formatPhotoDate(credit.date, locale) : null;
  const photographer = credit.photographer ? (
    credit.url ? (
      <a
        href={credit.url}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-white/25 underline-offset-2 transition-colors hover:decoration-white/70"
        onClick={(event) => event.stopPropagation()}
      >
        {credit.photographer}
      </a>
    ) : (
      <span>{credit.photographer}</span>
    )
  ) : null;
  const meta = [credit.location, dateLabel].filter(Boolean).join(" · ");

  if (variant === "hero") {
    return null;
  }

  if (variant === "lightbox") {
    return (
      <div
        className={`space-y-0.5 text-center text-[13px] leading-snug tracking-[0.02em] text-white/55 ${className}`}
      >
        {photographer ? (
          <p>
            <span className="text-white/35">{t("photoCredit")} </span>
            {photographer}
          </p>
        ) : null}
        {credit.location ? (
          <p>
            <span className="text-white/35">{t("photoLocation")} </span>
            <span>{credit.location}</span>
          </p>
        ) : null}
        {dateLabel ? (
          <p>
            <span className="text-white/35">{t("photoDate")} </span>
            <time dateTime={credit.date}>{dateLabel}</time>
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <figcaption
      className={`pointer-events-none absolute inset-x-0 bottom-0 z-[2] bg-gradient-to-t from-black/55 to-transparent px-3 pb-2.5 pt-8 text-[10px] leading-snug tracking-[0.04em] text-white/70 opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100 ${className}`}
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
