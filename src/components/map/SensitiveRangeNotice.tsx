import { LockKeyhole, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { AnimalGroup } from "@/data/speciesAtlasMeta";
import type { AppLocale } from "@/i18n/routing";

export async function SensitiveRangeNotice({
  group,
  locale,
}: {
  group: AnimalGroup;
  locale: AppLocale;
}) {
  const t = await getTranslations({
    locale,
    namespace: "profile.sensitiveRange",
  });

  return (
    <aside className="-mx-4 -mb-2 flex items-start gap-[18px] rounded-b-[30px] bg-ink px-4 pt-[26px] pb-7 text-ink-foreground sm:px-6 lg:-mx-9 lg:-mb-9 lg:rounded-b-[40px] lg:px-9">
      <span
        aria-hidden="true"
        className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-white/10"
      >
        <LockKeyhole className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[18px] leading-[1.3] font-semibold">{t("title")}</p>
        <p className="mt-2 max-w-[600px] text-[14.5px] leading-[1.6] text-ink-foreground/72">
          {t("body")}
        </p>
        <a
          className="group mt-4 inline-flex min-h-11 items-center gap-2.5 text-[14.5px] font-medium text-ink-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          href="tel:112"
        >
          <span
            aria-hidden="true"
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-destructive"
          >
            <Phone className="size-3.5" strokeWidth={2} />
          </span>
          <span className="border-b border-ink-foreground/36 pb-0.5 transition-colors group-hover:border-ink-foreground">
            {t.rich("call", {
              b: (chunks) => <b className="font-bold">{chunks}</b>,
              group,
            })}
          </span>
        </a>
      </div>
    </aside>
  );
}
