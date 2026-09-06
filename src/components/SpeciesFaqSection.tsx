import { getTranslations } from "next-intl/server";

import type { SpeciesFaq } from "@/data/species";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { SpeciesFaqItems } from "@/components/SpeciesFaqItems";
import { type PageType } from "@/lib/analytics";
import { SPECIES_SECTION_IDS } from "@/lib/toc";

type SpeciesFaqSectionProps = {
  entityId: string;
  items: SpeciesFaq[];
  name: string;
  pageType: PageType;
};

export async function SpeciesFaqSection({
  entityId,
  items,
  name,
  pageType,
}: SpeciesFaqSectionProps) {
  if (items.length === 0) return null;

  const t = await getTranslations("profile");

  return (
    <section className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <div>
            <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
              {t("faq")}
            </p>
            <AnchoredHeading
              anchorLabel={t("anchorLink")}
              className="mt-5 font-display text-display-title"
              id={SPECIES_SECTION_IDS.faq}
            >
              {t("faqTitle")}
            </AnchoredHeading>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
              {t("faqIntroBefore")}
              {name}
              {t("faqIntroAfter")}
            </p>
          </div>

          <SpeciesFaqItems
            entityId={entityId}
            items={items}
            pageType={pageType}
          />
        </div>
      </div>
    </section>
  );
}
