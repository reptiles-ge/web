import { ArrowUpRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { Reveal } from "@/components/Reveal";
import { Link } from "@/i18n/navigation";
import { speciesHref } from "@/lib/speciesRoutes";

export async function AtlasSeo() {
  const t = await getTranslations("speciesAtlas");
  const locale = (await getLocale()) as AppLocale;

  return (
    <section className="border-t border-border bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-215 px-6 lg:px-10">
        <Reveal>
          <p className="text-[11px] font-medium tracking-[0.32em] text-muted-foreground uppercase">
            {t("seoEyebrow")}
          </p>
        </Reveal>

        <article className="mt-8 space-y-12">
          <section>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.25rem)] leading-tight font-semibold text-foreground">
              {t("seo.reptilesTitle")}
            </h2>
            <div className="mt-5 space-y-4 text-[15px] leading-1.75 text-muted-foreground">
              <p>{t("seo.reptilesP1")}</p>
              <p>{t("seo.reptilesP2")}</p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.25rem)] leading-tight font-semibold text-foreground">
              {t("seo.amphibiansTitle")}
            </h2>
            <p className="mt-5 text-[15px] leading-1.75 text-muted-foreground">
              {t("seo.amphibiansP1")}
            </p>
            <p className="mt-4">
              <Link
                className="inline-flex items-center gap-1.5 text-[14px] font-medium text-primary"
                href="/amphibians"
              >
                {t("seo.amphibiansTitle")}
                <ArrowUpRight className="size-3.5" />
              </Link>
            </p>
          </section>

          <section>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.25rem)] leading-tight font-semibold text-foreground">
              {t("seo.birdsTitle")}
            </h2>
            <p className="mt-5 text-[15px] leading-1.75 text-muted-foreground">
              {t("seo.birdsP1")}
            </p>
            <p className="mt-4">
              <Link
                className="inline-flex items-center gap-1.5 text-[14px] font-medium text-primary"
                href="/birds"
              >
                {t("seo.birdsTitle")}
                <ArrowUpRight className="size-3.5" />
              </Link>
            </p>
          </section>

          <section>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.25rem)] leading-tight font-semibold text-foreground">
              {t("seo.mammalsTitle")}
            </h2>
            <p className="mt-5 text-[15px] leading-1.75 text-muted-foreground">
              {t("seo.mammalsP1")}
            </p>
            <p className="mt-4">
              <Link
                className="inline-flex items-center gap-1.5 text-[14px] font-medium text-primary"
                href="/mammals"
              >
                {t("seo.mammalsTitle")}
                <ArrowUpRight className="size-3.5" />
              </Link>
            </p>
          </section>

          <section>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.25rem)] leading-tight font-semibold text-foreground">
              {t("seo.spidersTitle")}
            </h2>
            <p className="mt-5 text-[15px] leading-1.75 text-muted-foreground">
              {t("seo.spidersP1")}
            </p>
            <p className="mt-4">
              <Link
                className="inline-flex items-center gap-1.5 text-[14px] font-medium text-primary"
                href="/spiders"
              >
                {t("seo.spidersTitle")}
                <ArrowUpRight className="size-3.5" />
              </Link>
            </p>
          </section>

          <section>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.25rem)] leading-tight font-semibold text-foreground">
              {t("seo.venomousTitle")}
            </h2>
            <div className="mt-5 space-y-4 text-[15px] leading-1.75 text-muted-foreground">
              <p>{t("seo.venomousP1")}</p>
              <p>{t("seo.venomousP2")}</p>
            </div>
            <ul className="mt-5 space-y-2 border-l-2 border-primary/25 pl-4">
              <li>
                <Link
                  className="text-[14px] font-medium text-foreground transition-colors hover:text-primary"
                  href={speciesHref("macrovipera-lebetina", locale)}
                >
                  Macrovipera lebetina
                </Link>
              </li>
              <li>
                <Link
                  className="text-[14px] font-medium text-foreground transition-colors hover:text-primary"
                  href={speciesHref("vipera-kaznakovi", locale)}
                >
                  Vipera kaznakovi
                </Link>
              </li>
              <li>
                <Link
                  className="text-[14px] font-medium text-foreground transition-colors hover:text-primary"
                  href={speciesHref("vipera-dinniki", locale)}
                >
                  Vipera dinniki
                </Link>
              </li>
              <li>
                <Link
                  className="text-[14px] font-medium text-foreground transition-colors hover:text-primary"
                  href={speciesHref("vipera-transcaucasiana", locale)}
                >
                  Vipera transcaucasiana
                </Link>
              </li>
            </ul>
            <Link
              className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-medium text-primary transition-colors hover:text-primary/80"
              href="/venomous-snakes"
            >
              {t("seo.venomousGuideCta")}
              <ArrowUpRight className="size-3.5" />
            </Link>
          </section>

          <section>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.25rem)] leading-tight font-semibold text-foreground">
              {t("seo.regionsTitle")}
            </h2>
            <div className="mt-5 space-y-4 text-[15px] leading-1.75 text-muted-foreground">
              <p>{t("seo.regionsP1")}</p>
              <p>{t("seo.regionsP2")}</p>
            </div>
            <p className="mt-5">
              <Link
                className="inline-flex items-center gap-2 text-[14px] font-medium text-primary"
                href="/regions"
              >
                {t("openRegionsAtlas")}
                <ArrowUpRight className="size-3.5" />
              </Link>
            </p>
          </section>
        </article>
      </div>
    </section>
  );
}
