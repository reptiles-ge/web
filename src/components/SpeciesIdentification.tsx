"use client";

import { useLocale, useTranslations } from "next-intl";
import { Fragment } from "react";

import type { AppLocale } from "@/i18n/routing";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import {
  getSpeciesById,
  type SpeciesIdentification as Identification,
} from "@/data/species";
import { Link } from "@/i18n/navigation";
import { trackSpeciesClick } from "@/lib/analytics";
import { splitSpeciesInlineLinks } from "@/lib/speciesInlineLinks";
import { speciesHref } from "@/lib/speciesRoutes";
import { SPECIES_SECTION_IDS } from "@/lib/toc";

type SpeciesIdentificationProps = {
  identification: Identification;
  name: string;
};

const inlineSpeciesLinkClassName =
  "font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:decoration-primary";

export function SpeciesIdentification({
  identification,
  name,
}: SpeciesIdentificationProps) {
  const t = useTranslations("profile");

  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
          {t("identification")}
        </p>
        <AnchoredHeading
          anchorLabel={t("anchorLink")}
          className="mt-5 max-w-3xl font-display text-display-title"
          id={SPECIES_SECTION_IDS.identification}
          slugSource={t("identificationTitle", { name })}
        >
          {t("identificationTitle", { name })}
        </AnchoredHeading>
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]">
          <IdentificationRichText text={identification.summary} />
        </p>

        {identification.traits.length > 0 ? (
          <ol className="mt-12 space-y-0">
            {identification.traits.map((trait, index) => (
              <li
                className="grid grid-cols-[auto_1fr] gap-6 border-t border-border py-7 lg:gap-10 lg:py-9"
                key={trait}
              >
                <span
                  aria-hidden="true"
                  className="font-display text-[28px] font-light text-muted-foreground lg:text-[36px]"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="max-w-2xl self-center text-[16px] leading-relaxed text-foreground/85 sm:text-[18px]">
                  <IdentificationRichText text={trait} />
                </p>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </section>
  );
}

function IdentificationRichText({ text }: { text: string }) {
  const locale = useLocale() as AppLocale;
  const parts = splitSpeciesInlineLinks(text);

  return (
    <>
      {parts.map((part) => {
        const key =
          part.type === "text"
            ? `t:${part.value}`
            : `s:${part.id}:${part.label}`;
        if (part.type === "text") {
          return <Fragment key={key}>{part.value}</Fragment>;
        }

        const target = getSpeciesById(part.id);
        if (!target) {
          return <Fragment key={key}>{part.label}</Fragment>;
        }

        return (
          <Link
            className={inlineSpeciesLinkClassName}
            href={speciesHref(part.id, locale)}
            key={key}
            onClick={() =>
              trackSpeciesClick({
                source: "identification",
                species_id: part.id,
              })
            }
          >
            {part.label}
          </Link>
        );
      })}
    </>
  );
}
