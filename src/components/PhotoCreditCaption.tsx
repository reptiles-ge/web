"use client";

import { ArrowUpRight, MapPin } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { type ReactNode } from "react";

import type { AppLocale } from "@/i18n/routing";

import {
  creditAuthorHref,
  creditAuthorName,
  getPublishedCreditAuthorByName,
} from "@/data/creditAuthors";
import { type PhotoCredit } from "@/data/speciesTypes";
import { Link } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { formatPhotoDate } from "@/lib/formatDate";
import {
  hasPhotoCoordinates,
  photoMapUrl,
} from "@/lib/photoCoordinates";
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
  const hasMap = hasPhotoCoordinates(credit);

  if (
    !photographerName &&
    !credit?.location &&
    !dateLabel &&
    !georgiaField &&
    !hasMap
  ) {
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
        mapLabel={t("photoMapLink")}
        photoCredit={t("photoCredit")}
        photoDate={t("photoDate")}
        photographer={photographer}
        photoLocation={t("photoLocation")}
        speciesId={speciesId}
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
      mapLabel={t("photoMapLink")}
      photoCredit={t("photoCredit")}
      photographer={photographer}
      speciesId={speciesId}
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
  mapLabel,
  photoCredit,
  photoDate,
  photographer,
  photoLocation,
  speciesId,
}: {
  className: string;
  credit?: PhotoCredit;
  dateLabel: null | string;
  georgiaField: boolean;
  georgiaFieldLabel: string;
  mapLabel: string;
  photoCredit: string;
  photoDate: string;
  photographer: ReactNode;
  photoLocation: string;
  speciesId?: string;
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
      {credit?.location || hasPhotoCoordinates(credit) ? (
        <p>
          <span className="text-white/50">{photoLocation} </span>
          <PhotoLocationLink
            credit={credit}
            mapLabel={mapLabel}
            speciesId={speciesId}
          />
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
      className="inline-flex min-h-6 items-center underline decoration-white/25 underline-offset-2 transition-colors hover:decoration-white/70"
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

function PhotoLocationLink({
  credit,
  mapLabel,
  speciesId,
}: {
  credit?: PhotoCredit;
  mapLabel: string;
  speciesId?: string;
}) {
  const location = credit?.location?.trim();
  if (!hasPhotoCoordinates(credit)) {
    return location ? <span>{location}</span> : null;
  }

  const href = photoMapUrl(credit);
  const label = location || mapLabel;

  return (
    <a
      className="inline-flex items-center gap-1 underline decoration-white/25 underline-offset-2 transition-colors hover:decoration-white/70"
      href={href}
      onClick={(event) => {
        event.stopPropagation();
        if (speciesId) {
          trackEvent("source_click", {
            link_type: "photo_map",
            species_id: speciesId,
          });
        }
      }}
      rel="noopener noreferrer"
      target="_blank"
    >
      <MapPin aria-hidden="true" className="size-[0.95em] shrink-0 opacity-80" />
      <span>{label}</span>
      <span className="sr-only"> — {mapLabel}</span>
      <ArrowUpRight aria-hidden="true" className="size-[0.85em]" />
    </a>
  );
}

function ThumbCredit({
  className,
  credit,
  dateLabel,
  georgiaField,
  georgiaFieldLabel,
  mapLabel,
  photoCredit,
  photographer,
  speciesId,
}: {
  className: string;
  credit?: PhotoCredit;
  dateLabel: null | string;
  georgiaField: boolean;
  georgiaFieldLabel: string;
  mapLabel: string;
  photoCredit: string;
  photographer: ReactNode;
  speciesId?: string;
}) {
  const location = credit?.location;
  const dateTime = credit?.date;
  const hasMap = hasPhotoCoordinates(credit);

  return (
    <figcaption
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 z-2 select-none bg-linear-to-t from-black/55 to-transparent px-3 pt-8 pb-2.5 text-[10px] leading-snug tracking-[0.04em] text-white/70 opacity-0 transition-opacity duration-300 sm:group-hover:opacity-100",
        className,
      )}
    >
      {photographer ? (
        <p>
          <span className="text-white/45">{photoCredit} </span>
          <span className="sm:pointer-events-auto">{photographer}</span>
        </p>
      ) : null}
      {location || dateLabel || hasMap ? (
        <p className="mt-0.5 text-white/55">
          {location || hasMap ? (
            <span className="sm:pointer-events-auto">
              <PhotoLocationLink
                credit={credit}
                mapLabel={mapLabel}
                speciesId={speciesId}
              />
            </span>
          ) : null}
          {(location || hasMap) && dateLabel ? " · " : null}
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
