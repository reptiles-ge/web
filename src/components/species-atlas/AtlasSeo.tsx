import { ChevronDown } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { type ComponentProps, type ReactNode } from "react";

import type { AppLocale } from "@/i18n/routing";

import { Link } from "@/i18n/navigation";
import { speciesHref } from "@/lib/speciesRoutes";

const VENOMOUS_EXAMPLES = [
  ["macrovipera-lebetina", "Macrovipera lebetina"],
  ["vipera-kaznakovi", "Vipera kaznakovi"],
  ["vipera-dinniki", "Vipera dinniki"],
  ["vipera-transcaucasiana", "Vipera transcaucasiana"],
] as const;

export async function AtlasSeo({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "speciesAtlas" });

  return (
    <section className="bg-card py-9 lg:py-[88px]">
      <div className="mx-auto max-w-[1440px] px-5 lg:grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start lg:gap-16 lg:px-[60px]">
        <div>
          <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
            {t("seoEyebrow")}
          </p>
          <h2 className="mt-2.5 font-display text-[28px] leading-[1.15] font-semibold tracking-[-0.012em] text-foreground lg:mt-3.5 lg:text-[40px] lg:leading-[1.1]">
            {t("seoTitle")}
          </h2>
          <p className="mt-4 hidden text-[16px] leading-[1.65] text-muted-foreground lg:block">
            {t("seoLead")}
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-2 lg:mt-0 lg:gap-2.5">
          <SeoItem open title={t("seo.reptilesTitle")}>
            <p>{t("seo.reptilesP1")}</p>
            <p>{t("seo.reptilesP2")}</p>
          </SeoItem>

          <SeoItem title={t("seo.venomousTitle")}>
            <p>{t("seo.venomousP1")}</p>
            <p>{t("seo.venomousP2")}</p>
            <ul className="mb-3.5 flex flex-wrap gap-2">
              {VENOMOUS_EXAMPLES.map(([id, name]) => (
                <li key={id}>
                  <Link
                    className="inline-flex min-h-9 items-center rounded-full bg-card px-3.5 text-[13.5px] font-medium text-foreground italic transition-colors hover:text-primary"
                    href={speciesHref(id, locale)}
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
            <p>
              <SeoLink href="/venomous-snakes">
                {t("seo.venomousGuideCta")}
              </SeoLink>
            </p>
          </SeoItem>

          <SeoItem title={t("seo.amphibiansTitle")}>
            <p>{t("seo.amphibiansP1")}</p>
            <p>
              <SeoLink href="/amphibians">{t("seo.amphibiansTitle")}</SeoLink>
            </p>
          </SeoItem>

          <SeoItem title={t("seo.birdsTitle")}>
            <p>{t("seo.birdsP1")}</p>
            <p>
              <SeoLink href="/birds">{t("seo.birdsTitle")}</SeoLink>
            </p>
          </SeoItem>

          <SeoItem title={t("seo.mammalsTitle")}>
            <p>{t("seo.mammalsP1")}</p>
            <p>
              <SeoLink href="/mammals">{t("seo.mammalsTitle")}</SeoLink>
            </p>
          </SeoItem>

          <SeoItem title={t("seo.spidersTitle")}>
            <p>{t("seo.spidersP1")}</p>
            <p>
              <SeoLink href="/spiders">{t("seo.spidersTitle")}</SeoLink>
            </p>
          </SeoItem>

          <SeoItem title={t("seo.regionsTitle")}>
            <p>{t("seo.regionsP1")}</p>
            <p>{t("seo.regionsP2")}</p>
            <p>
              <SeoLink href="/regions">{t("openRegionsAtlas")}</SeoLink>
            </p>
          </SeoItem>
        </div>
      </div>
    </section>
  );
}

function SeoItem({
  children,
  open = false,
  title,
}: {
  children: ReactNode;
  open?: boolean;
  title: string;
}) {
  return (
    <details
      className="group rounded-[20px] bg-background px-[18px] lg:rounded-[22px] lg:px-6"
      open={open}
    >
      <summary className="flex min-h-[58px] cursor-pointer list-none items-center justify-between gap-3 rounded-[20px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:min-h-16 [&::-webkit-details-marker]:hidden">
        <h3 className="font-display text-[16px] leading-snug font-semibold text-foreground lg:text-[18px]">
          {title}
        </h3>
        <ChevronDown
          aria-hidden="true"
          className="size-[18px] shrink-0 text-foreground transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
        />
      </summary>
      <div className="text-[14.5px] leading-[1.7] text-foreground/80 lg:text-[15px] lg:leading-[1.75] [&>p]:mb-3.5">
        {children}
      </div>
    </details>
  );
}

function SeoLink({
  children,
  href,
}: {
  children: ReactNode;
  href: ComponentProps<typeof Link>["href"];
}) {
  return (
    <Link className="font-semibold text-primary hover:underline" href={href}>
      {children} →
    </Link>
  );
}
