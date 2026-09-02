/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Logo } from "@/components/Logo";
import { localizeRegionText, regions } from "@/data/regions";
import { getVenomousCatalogSpecies } from "@/data/speciesAtlas";
import { Link, usePathname } from "@/i18n/navigation";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import type { AppLocale } from "@/i18n/routing";
import { quizHref } from "@/lib/quizzes";
import { regionHref, speciesHref } from "@/lib/speciesRoutes";
import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

const exploreLinks = [
  { href: "/species" as const, labelKey: "species" as const },
  { href: "/snakes" as const, labelKey: "snakes" as const },
  { href: "/quiz" as const, labelKey: "quizzes" as const },
  { href: "/lizards" as const, labelKey: "lizards" as const },
  { href: "/turtles" as const, labelKey: "turtles" as const },
  { href: "/amphibians" as const, labelKey: "amphibians" as const },
  { href: "/birds" as const, labelKey: "birds" as const },
  { href: "/mammals" as const, labelKey: "mammals" as const },
  { href: "/spiders" as const, labelKey: "spiders" as const },
  { href: "/regions" as const, labelKey: "regions" as const },
];

const guideLinks = [
  { href: "/snakes/saxeoebebi" as const, labelKey: "snakeIndex" as const },
  { href: "/venomous-snakes" as const, labelKey: "venomous" as const },
  { href: "/risk-to-humans" as const, labelKey: "riskLevels" as const },
  {
    href: "/snakes/shxamiani-gvelis-amocnoba" as const,
    labelKey: "snakeIdentify" as const,
  },
  {
    quizId: "snake" as const,
    labelKey: "snakeQuiz" as const,
  },
  { href: "/snakes/gvelis-nakbeni" as const, labelKey: "snakeBite" as const },
  { href: "/snakes/gavrtseleba" as const, labelKey: "snakeRange" as const },
  { href: "/snakes/didi-gvelebi" as const, labelKey: "snakeLargest" as const },
  { href: "/snakes-in-the-yard" as const, labelKey: "yard" as const },
  { href: "/lizards/saxeoebebi" as const, labelKey: "lizardIndex" as const },
  {
    href: "/lizards/identifikacia" as const,
    labelKey: "lizardIdentify" as const,
  },
  {
    href: "/lizards/xvlikis-da-gvelxokeras-gansxvaveba" as const,
    labelKey: "glassLizard" as const,
  },
  { href: "/turtles/saxeoebebi" as const, labelKey: "turtleIndex" as const },
  { href: "/turtles/xmelis-kuebi" as const, labelKey: "turtleLand" as const },
  { href: "/turtles/tsqlis-kuebi" as const, labelKey: "turtleWater" as const },
  {
    href: "/turtles/identifikacia" as const,
    labelKey: "turtleIdentify" as const,
  },
  {
    href: "/amphibians/saxeoebebi" as const,
    labelKey: "amphibianIndex" as const,
  },
  { href: "/amphibians/bayayi" as const, labelKey: "frogs" as const },
  {
    href: "/amphibians/bayayi/saxeoebebi" as const,
    labelKey: "frogsIndex" as const,
  },
  {
    href: "/amphibians/tritoni-salamandra" as const,
    labelKey: "newts" as const,
  },
];

const companyLinks = [
  { href: "/about" as const, labelKey: "about" as const },
  { href: "/news" as const, labelKey: "news" as const },
  { href: "/contact" as const, labelKey: "contact" as const },
];

function shouldHideFooter(pathname: string) {
  return pathname === "/contact" || pathname.startsWith("/quiz/");
}

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const [hidden, setHidden] = useState(shouldHideFooter(pathname));
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
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.7fr_1.05fr_0.6fr] lg:gap-12">
          <div>
            <Link
              href="/"
              className="inline-flex transition-opacity hover:opacity-90"
            >
              <Logo size={52} showWordmark wordmarkClassName="text-[19px]" />
            </Link>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
              {t("tagline")}
            </p>
            <Link
              href="/species"
              className="group mt-7 inline-flex items-center gap-1.5 text-[13px] font-medium text-primary transition-opacity hover:opacity-80"
            >
              {t("exploreCta")}
              <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              {t("exploreTitle")}
            </p>
            <ul className="mt-5 space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-foreground/80 transition-colors hover:text-primary"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              {t("guidesTitle")}
            </p>
            <ul className="mt-5 columns-2 gap-x-8">
              {guideLinks.map((link) => (
                <li key={link.labelKey} className="mb-2.5 break-inside-avoid">
                  <Link
                    href={
                      "quizId" in link && link.quizId
                        ? quizHref(link.quizId, locale)
                        : "href" in link && link.href
                          ? link.href
                          : "/quiz"
                    }
                    className="text-[14px] text-foreground/80 transition-colors hover:text-primary"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              {t("companyTitle")}
            </p>
            <ul className="mt-5 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-foreground/80 transition-colors hover:text-primary"
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
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                {t("venomousTitle")}
              </p>
              <Link
                href="/venomous-snakes"
                className="text-[12px] font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
              >
                {t("venomousAll")}
              </Link>
            </div>
            <ul className="mt-5 columns-2 gap-x-8">
              {venomous.map((item) => (
                <li key={item.id} className="mb-3 break-inside-avoid">
                  <Link
                    href={speciesHref(item.id, locale)}
                    className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
                  >
                    <span className="block text-[14px] font-medium text-foreground transition-colors group-hover:text-primary">
                      {item.commonName}
                    </span>
                    <span className="mt-0.5 block text-[12px] italic text-muted-foreground">
                      {item.scientificName}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-end justify-between gap-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                {t("regionsTitle")}
              </p>
              <Link
                href="/regions"
                className="text-[12px] font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
              >
                {t("regionsAll")}
              </Link>
            </div>
            <ul className="mt-5 columns-2 gap-x-8 sm:columns-3">
              {regions.map((region) => (
                <li key={region.id} className="mb-2.5 break-inside-avoid">
                  <Link
                    href={regionHref(region.id)}
                    className="text-[13px] text-foreground/75 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
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
          <span className="tracking-wide">{t("forCurious")}</span>
        </div>
      </div>
    </footer>
  );
}
