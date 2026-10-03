import type { ReactNode } from "react";

import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { ContentAttribution } from "@/components/ContentAttribution";
import { CoverImage } from "@/components/CoverImage";
import { PhoneLinkedText } from "@/components/PhoneLinkedText";
import { ScreenReaderBreadcrumb } from "@/components/ScreenReaderBreadcrumb";
import { Link } from "@/i18n/navigation";
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
  updatedAt,
}: DangerousAnimalsPageProps) {
  const t = await getTranslations({ locale, namespace: "dangerousAnimals" });

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-background pt-28 pb-12 sm:pt-32 sm:pb-16">
        <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-10">
          <ScreenReaderBreadcrumb
            current={t("breadcrumbCurrent")}
            home={t("breadcrumbHome")}
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
