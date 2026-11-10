import { ArrowUpRight, MapPinOff } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { GeorgiaMapStatic } from "@/components/map/GeorgiaMapStatic";
import { Link } from "@/i18n/navigation";

const ICON_CHIP_CLASS =
  "items-center justify-center rounded-full text-primary [&_svg]:size-6";

export async function RangeNoRecordsMap({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "profile" });

  return (
    <div className="lg:grid lg:grid-cols-1 lg:items-center" data-range-empty="">
      <div className="relative lg:[grid-area:1/1]">
        <div aria-hidden="true" className="blur-[5px] select-none" inert>
          <GeorgiaMapStatic
            hatchId="range-hatch-empty"
            highlightedIds={[]}
            showKeys={false}
          />
        </div>
        <span
          aria-hidden="true"
          className={`${ICON_CHIP_CLASS} absolute top-1/2 left-1/2 inline-flex size-[60px] -translate-1/2 bg-card/80 shadow-[0_0_0_1px_rgba(14,20,17,0.05),0_14px_34px_rgba(14,20,17,0.14)] backdrop-blur-md lg:hidden`}
        >
          <MapPinOff strokeWidth={1.75} />
        </span>
      </div>
      <div className="px-2 pt-3.5 pb-4 text-center lg:flex lg:justify-center lg:py-6 lg:[grid-area:1/1]">
        <div className="lg:w-[440px] lg:max-w-full lg:rounded-[32px] lg:bg-card/70 lg:px-8 lg:pt-[30px] lg:pb-7 lg:shadow-[0_0_0_1px_rgba(14,20,17,0.05),0_24px_60px_rgba(14,20,17,0.12)] lg:backdrop-blur-[18px]">
          <span
            aria-hidden="true"
            className={`${ICON_CHIP_CLASS} hidden size-14 bg-surface lg:inline-flex`}
          >
            <MapPinOff strokeWidth={1.75} />
          </span>
          <p className="text-[21px] leading-[1.2] font-semibold tracking-[-0.01em] text-foreground lg:mt-4 lg:text-[24px]">
            {t("rangeEmptyTitle")}
          </p>
          <p className="mt-2 text-[14px] leading-[1.6] text-muted-foreground lg:mt-2.5 lg:text-[14.5px]">
            {t("rangeEmptyBody")}
          </p>
          <Link
            className="mt-[18px] flex h-[50px] items-center justify-center gap-2 rounded-full bg-foreground px-5 text-[15px] font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary lg:mt-5 lg:inline-flex lg:h-12 lg:pr-5 lg:pl-[22px] lg:text-[14.5px]"
            href="/contact"
          >
            {t("rangeEmptyAction")}
            <ArrowUpRight aria-hidden="true" className="size-[15px]" />
          </Link>
          <p className="mt-2.5 text-[12.5px] text-muted-foreground">
            {t("rangeEmptyNote")}
          </p>
        </div>
      </div>
    </div>
  );
}
