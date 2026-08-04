"use client";

import type { PhotoCredit } from "@/data/species";
import { useTranslations } from "next-intl";

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

  if (!credit?.photographer) return null;

  const name = credit.url ? (
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
  );

  if (variant === "hero") {
    return (
      <p
        className={`pointer-events-auto text-[11px] tracking-[0.04em] text-white/45 ${className}`}
      >
        <span className="text-white/30">{t("photoCredit")} </span>
        {name}
      </p>
    );
  }

  if (variant === "lightbox") {
    return (
      <p className={`text-[13px] tracking-[0.02em] text-white/55 ${className}`}>
        <span className="text-white/35">{t("photoCredit")} </span>
        {name}
      </p>
    );
  }

  return (
    <p
      className={`pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-3 pb-2.5 pt-8 text-[10px] tracking-[0.04em] text-white/70 opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100 ${className}`}
    >
      <span className="text-white/45">{t("photoCredit")} </span>
      <span className="pointer-events-auto">{name}</span>
    </p>
  );
}
