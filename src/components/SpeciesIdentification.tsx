"use client";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import type { SpeciesIdentification as Identification } from "@/data/species";
import { SPECIES_SECTION_IDS } from "@/lib/toc";
import { useTranslations } from "next-intl";

type SpeciesIdentificationProps = {
  name: string;
  identification: Identification;
};

export function SpeciesIdentification({
  name,
  identification,
}: SpeciesIdentificationProps) {
  const t = useTranslations("profile");

  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
          {t("identification")}
        </p>
        <AnchoredHeading
          id={SPECIES_SECTION_IDS.identification}
          slugSource={t("identificationTitle", { name })}
          className="mt-5 max-w-3xl font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.05]"
          anchorLabel={t("anchorLink")}
        >
          {t("identificationTitle", { name })}
        </AnchoredHeading>
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]">
          {identification.summary}
        </p>

        {identification.traits.length > 0 ? (
          <ol className="mt-12 space-y-0">
            {identification.traits.map((trait, index) => (
              <li
                key={trait}
                className="grid grid-cols-[auto_1fr] gap-6 border-t border-border py-7 lg:gap-10 lg:py-9"
              >
                <span className="font-display text-[28px] font-light text-primary/40 lg:text-[36px]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="max-w-2xl self-center text-[16px] leading-relaxed text-foreground/85 sm:text-[18px]">
                  {trait}
                </p>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </section>
  );
}
