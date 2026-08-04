"use client";

import { Logo } from "@/components/Logo";
import { TopGeCounter } from "@/components/TopGeCounter";
import { getCatalogSpecies } from "@/data/species";
import { Link } from "@/i18n/navigation";
import { localizeSpecies } from "@/i18n/localizeSpecies";
import type { AppLocale } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";

const siteLinks = [
  { href: "/#species" as const, labelKey: "species" as const },
  { href: "/#atlas" as const, labelKey: "atlas" as const },
  { href: "/regions" as const, labelKey: "regions" as const },
  { href: "/contact" as const, labelKey: "contact" as const },
];

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale() as AppLocale;
  const species = getCatalogSpecies().map((item) =>
    localizeSpecies(item, locale),
  );

  return (
    <footer className="border-t border-border bg-background py-20">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid gap-14 md:grid-cols-[1.4fr_1fr_1.8fr]">
          <div>
            <Link href="/" className="inline-flex transition-opacity hover:opacity-90">
              <Logo size={56} showWordmark wordmarkClassName="text-[20px]" />
            </Link>
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-muted-foreground">
              {t("tagline")}
            </p>
          </div>
          <div>
            <p className="text-[11px] tracking-[0.22em] text-muted-foreground">
              {t("siteTitle")}
            </p>
            <ul className="mt-5 space-y-3">
              {siteLinks.map((link) => (
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
            <p className="text-[11px] tracking-[0.22em] text-muted-foreground">
              {t("quickLinks")}
            </p>
            <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {species.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/species/${item.id}`}
                    className="text-[14px] text-foreground/80 transition-colors hover:text-primary"
                  >
                    {item.commonName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-20 flex flex-col gap-3 border-t border-border pt-8 text-[12px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
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
