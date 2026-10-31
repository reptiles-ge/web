import type { ReactNode } from "react";

import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { ContentAttribution } from "@/components/ContentAttribution";
import { CoverImage } from "@/components/CoverImage";
import { PhoneLinkedText } from "@/components/PhoneLinkedText";
import { ScreenReaderBreadcrumb } from "@/components/ScreenReaderBreadcrumb";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { dangerLevelTone } from "@/lib/dangerLevels";
import { type DangerousAnimalRow } from "@/lib/dangerousAnimals";
import { speciesHref } from "@/lib/speciesRoutes";

const VENOMOUS_LINKS = [
  { href: "/venomous-snakes", key: "venomousSnakes" },
  { href: "/spiders/shxamiani-obobebi", key: "venomousSpiders" },
  { href: "/scorpions", key: "scorpions" },
] as const;

const BITE_LINKS = [
  { href: "/snakes/gvelis-nakbeni", key: "snakeBite" },
  { href: "/snakes/giurzas-nakbeni", key: "gyurzaBite" },
  { href: "/spiders/obobis-nakbeni", key: "spiderBite" },
  { href: "/scorpions/morielis-nakbeni", key: "scorpionSting" },
  { href: "/insects/tkipis-nakbeni", key: "tickBite" },
] as const;

const ENCOUNTER_LINKS = [
  { href: "/insects/krazanis-bude", key: "waspNest" },
  { href: "/mammals/datvi-shekhvedra", key: "bear" },
  { href: "/mammals/tura-ezoshi", key: "jackal" },
] as const;

type DangerousAnimalsPageProps = {
  heroAlt: string;
  heroSrc: string;
  karakurtName: string;
  locale: AppLocale;
  publishedAt: string;
  rows: DangerousAnimalRow[];
  updatedAt: string;
};

type HubLink = {
  href:
    | (typeof BITE_LINKS)[number]["href"]
    | (typeof ENCOUNTER_LINKS)[number]["href"]
    | (typeof VENOMOUS_LINKS)[number]["href"];
  label: string;
};

export async function DangerousAnimalsPage({
  heroAlt,
  heroSrc,
  karakurtName,
  locale,
  publishedAt,
  rows,
  updatedAt,
}: DangerousAnimalsPageProps) {
  const t = await getTranslations({ locale, namespace: "dangerousAnimals" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tDanger = await getTranslations({ locale, namespace: "danger" });

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-background pt-28 pb-12 sm:pt-32 sm:pb-16">
        <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-10">
          <ScreenReaderBreadcrumb
            current={t("breadcrumbCurrent")}
            home={t("breadcrumbHome")}
            label={tNav("breadcrumbAria")}
          />
          <h1 className="text-balance-tight max-w-4xl font-display text-display-hero font-semibold text-foreground">
            {t("title")}
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:mt-6 sm:text-[16px]">
            {t("subtitle")}
          </p>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            <Link
              className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
              href="/risk-to-humans"
            >
              {t("methodCta")}
            </Link>
            {" — "}
            {t("methodBody")}
          </p>
        </div>
        <div className="mx-auto mt-10 w-full max-w-[1400px] px-6 lg:px-10">
          <div className="relative aspect-3/2 overflow-hidden bg-ink sm:aspect-2/1">
            <CoverImage
              alt={heroAlt}
              className="object-cover"
              priority
              sizes="(max-width: 1400px) 100vw, 1400px"
              src={heroSrc}
            />
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-background py-16">
        <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-10">
          <h2 className="max-w-3xl font-display text-display-card font-semibold text-foreground">
            {t("tableTitle")}
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            {t("tableBody")}
          </p>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[680px] border-y border-border text-left">
              <thead>
                <tr className="border-b border-border text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
                  <th className="py-4 pr-4 font-medium" scope="col">
                    {t("tableColAnimal")}
                  </th>
                  <th className="py-4 pr-4 font-medium" scope="col">
                    {t("tableColRisk")}
                  </th>
                  <th className="py-4 pr-4 font-medium" scope="col">
                    {t("tableColWhere")}
                  </th>
                  <th className="py-4 pr-4 font-medium" scope="col">
                    {t("tableColAction")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    className="border-b border-border/80 align-top last:border-b-0"
                    key={row.id}
                  >
                    <th className="py-4 pr-4 font-normal" scope="row">
                      <Link
                        className="font-display text-[16px] font-semibold text-foreground transition-colors hover:text-primary"
                        href={speciesHref(row.id, locale)}
                      >
                        {row.commonName}
                      </Link>
                      <span className="mt-1 block text-[13px] text-muted-foreground italic">
                        {row.scientificName}
                      </span>
                    </th>
                    <td className="py-4 pr-4">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-1 text-[12px] font-medium whitespace-nowrap",
                          dangerLevelTone(row.danger).chip,
                        )}
                      >
                        {tDanger(row.danger)}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-[14px] leading-relaxed text-muted-foreground">
                      {row.location}
                    </td>
                    <td className="py-4 pr-4 text-[14px]">
                      <Link
                        className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
                        href={row.guide.href}
                      >
                        {t(`links.${row.guide.key}`)}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <LinkSection
        body={t("venomousBody")}
        links={VENOMOUS_LINKS.map((item) => ({
          href: item.href,
          label: t(`links.${item.key}`),
        }))}
        title={t("venomousTitle")}
      >
        <li className="flex">
          <Link
            className="group flex w-full items-center justify-between gap-4 rounded-card border border-border bg-card p-6 transition-colors hover:bg-background"
            href={speciesHref("latrodectus-tredecimguttatus", locale)}
          >
            <span className="font-display text-[18px] font-semibold text-foreground transition-colors group-hover:text-primary">
              {karakurtName}
            </span>
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 shrink-0 text-muted-foreground"
            />
          </Link>
        </li>
      </LinkSection>

      <LinkSection
        body={t("biteBody")}
        links={BITE_LINKS.map((item) => ({
          href: item.href,
          label: t(`links.${item.key}`),
        }))}
        title={t("biteTitle")}
      />

      <LinkSection
        body={t("encounterBody")}
        links={ENCOUNTER_LINKS.map((item) => ({
          href: item.href,
          label: t(`links.${item.key}`),
        }))}
        title={t("encounterTitle")}
      />

      <section className="border-t border-border bg-background py-16">
        <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-10">
          <h2 className="font-display text-display-card font-semibold text-foreground">
            {t("emergencyTitle")}
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            <PhoneLinkedText>{t("emergencyBody")}</PhoneLinkedText>
          </p>
        </div>
      </section>

      <ContentAttribution
        locale={locale}
        publishedAt={publishedAt}
        updatedAt={updatedAt}
      />
    </div>
  );
}

function LinkSection({
  body,
  children,
  links,
  title,
}: {
  body: string;
  children?: ReactNode;
  links: readonly HubLink[];
  title: string;
}) {
  return (
    <section className="border-t border-border bg-background py-16">
      <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-10">
        <h2 className="max-w-3xl font-display text-display-card font-semibold text-foreground">
          {title}
        </h2>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          {body}
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((item) => (
            <li className="flex" key={item.href}>
              <Link
                className="group flex w-full items-center justify-between gap-4 rounded-card border border-border bg-card p-6 transition-colors hover:bg-background"
                href={item.href}
              >
                <span className="font-display text-[18px] font-semibold text-foreground transition-colors group-hover:text-primary">
                  {item.label}
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted-foreground"
                />
              </Link>
            </li>
          ))}
          {children}
        </ul>
      </div>
    </section>
  );
}
