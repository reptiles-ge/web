"use client";

import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { type ReactNode } from "react";

import type { AppLocale } from "@/i18n/routing";

import { type PhotoCredit } from "@/data/speciesTypes";
import {
  creditAuthorHref,
  creditAuthorName,
  getPublishedCreditAuthorByName,
} from "@/data/creditAuthors";
import { Link } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { formatPhotoDate } from "@/lib/formatDate";
import { photoCreditSourceLabel } from "@/lib/photoCreditSource";

type PhotoCreditCaptionProps = {
  className?: string;
  credit?: PhotoCredit;
  photoConfidence?: PhotoCredit["photoConfidence"];
  speciesId?: string;
  variant?: "hero" | "lightbox" | "thumb";
};

export function PhotoCreditCaption({
  className = "",
  credit,
  photoConfidence,
  speciesId,
  variant = "thumb",
}: PhotoCreditCaptionProps) {
  const t = useTranslations("profile");
  const locale = useLocale() as AppLocale;
  const georgiaField = isGeorgiaFieldPhoto(photoConfidence, credit);

  if (variant === "hero") return null;

  const dateLabel = credit?.date ? formatPhotoDate(credit.date, locale) : null;
  const photographerName = credit?.photographer?.trim();
  const photographer =
    credit && photographerName ? (
      <PhotoCreditName credit={credit} speciesId={speciesId} />
    ) : null;

  if (!photographerName && !credit?.location && !dateLabel && !georgiaField) {
    return null;
  }

  if (variant === "lightbox") {
    return (
      <LightboxCredit
        className={className}
        credit={credit}
        dateLabel={dateLabel}
        georgiaField={georgiaField}
        georgiaFieldLabel={t("georgiaFieldPhoto")}
        photoCredit={t("photoCredit")}
        photoDate={t("photoDate")}
        photographer={photographer}
        photoLocation={t("photoLocation")}
      />
    );
  }

  return (
    <ThumbCredit
      className={className}
      credit={credit}
      dateLabel={dateLabel}
      georgiaField={georgiaField}
      georgiaFieldLabel={t("georgiaFieldPhoto")}
      photoCredit={t("photoCredit")}
      photographer={photographer}
    />
  );
}

function isGeorgiaFieldPhoto(
  photoConfidence?: PhotoCredit["photoConfidence"],
  credit?: PhotoCredit,
) {
  return (
    photoConfidence === "georgia-field" ||
    credit?.photoConfidence === "georgia-field"
  );
}

function LightboxCredit({
  className,
  credit,
  dateLabel,
  georgiaField,
  georgiaFieldLabel,
  photoCredit,
  photoDate,
  photographer,
  photoLocation,
}: {
  className: string;
  credit?: PhotoCredit;
  dateLabel: null | string;
  georgiaField: boolean;
  georgiaFieldLabel: string;
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
          <span className="text-white/50">{photoCredit} </span>
          {photographer}
        </p>
      ) : null}
      {credit?.location ? (
        <p>
          <span className="text-white/50">{photoLocation} </span>
          <span>{credit.location}</span>
        </p>
      ) : null}
      {dateLabel && credit?.date ? (
        <p>
          <span className="text-white/50">{photoDate} </span>
          <time dateTime={credit.date}>{dateLabel}</time>
        </p>
      ) : null}
      {georgiaField ? <p>{georgiaFieldLabel}</p> : null}
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
  const locale = useLocale() as AppLocale;
  const raw = credit.photographer?.trim();
  if (!raw) return null;
  const author = getPublishedCreditAuthorByName(raw);
  const name = author ? creditAuthorName(author, locale) : raw;
  const label = author ? (
    <Link
      className="underline decoration-white/25 underline-offset-2 transition-colors hover:decoration-white/70"
      href={creditAuthorHref(author.slug)}
      onClick={(event) => event.stopPropagation()}
    >
      {name}
    </Link>
  ) : (
    <span>{name}</span>
  );
  const source = photoCreditSourceLabel(credit.url);
  if (!credit.url || !source) return label;
  return (
    <>
      {label}
      {" · "}
      <a
        className="inline-flex items-center gap-0.5 underline decoration-white/25 underline-offset-2 transition-colors hover:decoration-white/70"
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
        {source}
        <ArrowUpRight aria-hidden="true" className="size-[0.85em]" />
      </a>
    </>
  );
}

function ThumbCredit({
  className,
  credit,
  dateLabel,
  georgiaField,
  georgiaFieldLabel,
  photoCredit,
  photographer,
}: {
  className: string;
  credit?: PhotoCredit;
  dateLabel: null | string;
  georgiaField: boolean;
  georgiaFieldLabel: string;
  photoCredit: string;
  photographer: ReactNode;
}) {
  const location = credit?.location;
  const dateTime = credit?.date;

  return (
    <figcaption
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 z-2 bg-linear-to-t from-black/55 to-transparent px-3 pt-8 pb-2.5 text-[10px] leading-snug tracking-[0.04em] text-white/70 opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100",
        className,
      )}
    >
      {photographer ? (
        <p>
          <span className="text-white/45">{photoCredit} </span>
          <span className="pointer-events-auto">{photographer}</span>
        </p>
      ) : null}
      {location || dateLabel ? (
        <p className="mt-0.5 text-white/55">
          {location ? <span>{location}</span> : null}
          {location && dateLabel ? " · " : null}
          {dateLabel && dateTime ? (
            <time dateTime={dateTime}>{dateLabel}</time>
          ) : null}
        </p>
      ) : null}
      {georgiaField ? (
        <p className="mt-0.5 text-white/55">{georgiaFieldLabel}</p>
      ) : null}
    </figcaption>
  );
}
