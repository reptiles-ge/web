/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

import type { AppLocale } from "@/i18n/routing";

import { Logo } from "@/components/Logo";
import { TopGeCounter } from "@/components/TopGeCounter";
import { localizeRegionText, regions } from "@/data/regions";
import { getVenomousCatalogSpecies } from "@/data/speciesAtlas";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import { Link, usePathname } from "@/i18n/navigation";
import { regionHref, speciesHref } from "@/lib/speciesRoutes";

const exploreLinks = [
  { href: "/species" as const, labelKey: "species" as const },
  { href: "/snakes" as const, labelKey: "snakes" as const },
  { href: "/lizards" as const, labelKey: "lizards" as const },
  { href: "/turtles" as const, labelKey: "turtles" as const },
  { href: "/amphibians" as const, labelKey: "amphibians" as const },
  { href: "/birds" as const, labelKey: "birds" as const },
  { href: "/mammals" as const, labelKey: "mammals" as const },
  { href: "/spiders" as const, labelKey: "spiders" as const },
  { href: "/regions" as const, labelKey: "regions" as const },
];

const guideLinks = [
  { href: "/venomous-snakes" as const, labelKey: "venomous" as const },
  {
    href: "/snakes/shxamiani-gvelis-amocnoba" as const,
    labelKey: "snakeIdentify" as const,
  },
  { href: "/snakes/gvelis-nakbeni" as const, labelKey: "snakeBite" as const },
  { href: "/snakes-in-the-yard" as const, labelKey: "yard" as const },
  {
    href: "/spiders/shxamiani-obobebi" as const,
    labelKey: "spiderVenomous" as const,
  },
  { href: "/spiders/obobis-nakbeni" as const, labelKey: "spiderBite" as const },
  {
    href: "/mammals/tura-ezoshi" as const,
    labelKey: "jackalYard" as const,
  },
  {
    href: "/mammals/datvi-shekhvedra" as const,
    labelKey: "bearEncounter" as const,
  },
  { href: "/lizards/xvliki-saxlshi" as const, labelKey: "lizardHouse" as const },
  { href: "/risk-to-humans" as const, labelKey: "riskLevels" as const },
];

const companyLinks = [
  { href: "/about" as const, labelKey: "about" as const },
  { href: "/news" as const, labelKey: "news" as const },
  { href: "/contact" as const, labelKey: "contact" as const },
];

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const [hidden, setHidden] = useState(() => shouldHideFooter(pathname));
  const venomous = useMemo(
    () =>
      getVenomousCatalogSpecies().map((item) => localizeSpecies(item, locale)),
    [locale],
  );

  useEffect(() => {
    if (shouldHideFooter(pathname)) {
      setHidden(true);
      return;
    }
    setHidden(Boolean(document.querySelector("[data-hide-footer]")));
  }, [pathname]);

  if (hidden) {
    return null;
  }

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.8fr_0.7fr] lg:gap-16">
          <div>
            <Link
              className="inline-flex transition-opacity hover:opacity-90"
              href="/"
            >
              <Logo showWordmark size={52} wordmarkClassName="text-[19px]" />
            </Link>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
              {t("tagline")}
            </p>
            <Link
              className="group mt-7 inline-flex items-center gap-1.5 text-[13px] font-medium text-primary transition-opacity hover:opacity-80"
              href="/species"
            >
              {t("exploreCta")}
              <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <div>
            <p className="text-[11px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
              {t("exploreTitle")}
            </p>
            <ul className="mt-5 space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    className="text-[14px] text-foreground/80 transition-colors hover:text-primary"
                    href={link.href}
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
              {t("guidesTitle")}
            </p>
            <ul className="mt-5 space-y-3">
              {guideLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    className="text-[14px] text-foreground/80 transition-colors hover:text-primary"
                    href={link.href}
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
              {t("companyTitle")}
            </p>
            <ul className="mt-5 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    className="text-[14px] text-foreground/80 transition-colors hover:text-primary"
                    href={link.href}
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 grid gap-10 border-t border-border pt-12 lg:mt-16 lg:grid-cols-2 lg:gap-16 lg:pt-14">
          <div>
            <div className="flex items-end justify-between gap-4">
              <p className="text-[11px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
                {t("venomousTitle")}
              </p>
              <Link
                className="text-[12px] font-medium text-foreground transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:outline-none"
                href="/venomous-snakes"
              >
                {t("venomousAll")}
              </Link>
            </div>
            <ul className="mt-5 columns-2 gap-x-8">
              {venomous.map((item) => (
                <li className="mb-3 break-inside-avoid" key={item.id}>
                  <Link
                    className="group block focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:outline-none"
                    href={speciesHref(item.id, locale)}
                  >
                    <span className="block text-[14px] font-medium text-foreground transition-colors group-hover:text-primary">
                      {item.commonName}
                    </span>
                    <span className="mt-0.5 block text-[12px] text-muted-foreground italic">
                      {item.scientificName}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-end justify-between gap-4">
              <p className="text-[11px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
                {t("regionsTitle")}
              </p>
              <Link
                className="text-[12px] font-medium text-foreground transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:outline-none"
                href="/regions"
              >
                {t("regionsAll")}
              </Link>
            </div>
            <ul className="mt-5 columns-2 gap-x-8 sm:columns-3">
              {regions.map((region) => (
                <li className="mb-2.5 break-inside-avoid" key={region.id}>
                  <Link
                    className="text-[13px] text-foreground/75 transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:outline-none"
                    href={regionHref(region.id)}
                  >
                    {localizeRegionText(region.name, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-8 text-[12px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} Reptiles. {t("rights")}
          </span>
          <div className="flex items-center gap-4">
            <TopGeCounter />
            <span className="tracking-wide">{t("forCurious")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function shouldHideFooter(pathname: string) {
  return pathname === "/contact" || pathname.startsWith("/quiz/");
}
