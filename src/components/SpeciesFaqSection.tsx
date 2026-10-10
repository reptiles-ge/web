import { getTranslations } from "next-intl/server";

import type { SpeciesFaq } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";

import { AnchoredHeading } from "@/components/AnchoredHeading";
import { SpeciesFaqItems } from "@/components/SpeciesFaqItems";
import { isLocalAdminEnabled } from "@/lib/adminAccess";
import { type PageType } from "@/lib/analytics";
import { georgianTanPhrase } from "@/lib/georgianGrammar";
import { SPECIES_SECTION_IDS } from "@/lib/toc";

const FAQ_VISIBLE_COUNT = 5;

type SpeciesFaqSectionProps = {
  entityId: string;
  items: SpeciesFaq[];
  locale: AppLocale;
  name: string;
  pageType: PageType;
};

export async function SpeciesFaqSection({
  entityId,
  items,
  locale,
  name,
  pageType,
}: SpeciesFaqSectionProps) {
  if (items.length === 0) return null;

  const [t] = await Promise.all([
    getTranslations({ locale, namespace: "profile" }),
  ]);
  const faqName = locale === "ka" ? georgianTanPhrase(name) : name;

  return (
    <section className="bg-surface py-11 lg:py-20">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-[60px]">
        <div className="grid gap-5 lg:grid-cols-[400px_minmax(0,1fr)] lg:gap-[72px]">
          <div className="px-2 lg:px-0">
            <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
              {t("faq")}
            </p>
            <AnchoredHeading
              anchorLabel={t("anchorLink")}
              className="mt-3 font-display text-[28px] leading-[1.15] font-semibold tracking-[-0.012em] lg:mt-4 lg:text-[38px] lg:leading-[1.1]"
              id={SPECIES_SECTION_IDS.faq}
            >
              {t("faqTitle")}
            </AnchoredHeading>
            <p className="mt-3 max-w-sm text-[15px] leading-[1.6] text-muted-foreground lg:mt-5">
              {t("faqIntroBefore")}
              {faqName}
              {t("faqIntroAfter")}
            </p>
          </div>

          <SpeciesFaqItems
            editable={locale === "ka" && isLocalAdminEnabled()}
            entityId={entityId}
            items={items}
            moreLabel={t("faqMore", {
              count: Math.max(items.length - FAQ_VISIBLE_COUNT, 0),
            })}
            pageType={pageType}
            visibleCount={FAQ_VISIBLE_COUNT}
          />
        </div>
      </div>
    </section>
  );
}
