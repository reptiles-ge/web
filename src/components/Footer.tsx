"use client";

import { Logo } from "@/components/Logo";
import { localizeRegionText, regions } from "@/data/regions";
import { getVenomousCatalogSpecies } from "@/data/speciesAtlas";
import { Link, usePathname } from "@/i18n/navigation";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import type { AppLocale } from "@/i18n/routing";
import { regionHref, speciesHref } from "@/lib/speciesRoutes";
import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

const exploreLinks = [
  { href: "/species" as const, labelKey: "species" as const },
  { href: "/snakes" as const, labelKey: "snakes" as const },
  { href: "/snakes/saxeoebebi" as const, labelKey: "snakeIndex" as const },
  { href: "/snakes-in-the-yard" as const, labelKey: "yard" as const },
  { href: "/lizards" as const, labelKey: "lizards" as const },
  { href: "/lizards/saxeoebebi" as const, labelKey: "lizardIndex" as const },
  { href: "/turtles" as const, labelKey: "turtles" as const },
  { href: "/amphibians" as const, labelKey: "amphibians" as const },
  { href: "/amphibians/bayayi" as const, labelKey: "frogs" as const },
  { href: "/regions" as const, labelKey: "regions" as const },
  { href: "/venomous-snakes" as const, labelKey: "venomous" as const },
];

const companyLinks = [
  { href: "/about" as const, labelKey: "about" as const },
  { href: "/contact" as const, labelKey: "contact" as const },
];

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const [hidden, setHidden] = useState(pathname === "/contact");
  const venomous = useMemo(
    () => getVenomousCatalogSpecies().map((item) => localizeSpecies(item, locale)),
    [locale],
  );

  useEffect(() => {
    if (pathname === "/contact") {
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
        <div className="grid gap-12 lg:grid-cols-[1.35fr_0.85fr_0.85fr] lg:gap-16">
          <div>
            <Link href="/" className="inline-flex transition-opacity hover:opacity-90">
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
                className="text-[12px] font-medium text-primary transition-opacity hover:opacity-80"
              >
                {t("venomousAll")}
              </Link>
            </div>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {venomous.map((item) => (
                <li key={item.id}>
                  <Link
                    href={speciesHref(item.id, locale)}
                    className="group block rounded-2xl border border-border/80 bg-card px-4 py-3.5 transition-colors hover:border-primary/25"
                  >
                    <p className="text-[11px] italic text-muted-foreground">
                      {item.scientificName}
                    </p>
                    <p className="mt-1 text-[14px] font-medium text-foreground transition-colors group-hover:text-primary">
                      {item.commonName}
                    </p>
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
                className="text-[12px] font-medium text-primary transition-opacity hover:opacity-80"
              >
                {t("regionsAll")}
              </Link>
            </div>
            <ul className="mt-5 columns-2 gap-x-8 sm:columns-3">
              {regions.map((region) => (
                <li key={region.id} className="mb-2.5 break-inside-avoid">
                  <Link
                    href={regionHref(region.id)}
                    className="text-[13px] text-foreground/75 transition-colors hover:text-primary"
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
