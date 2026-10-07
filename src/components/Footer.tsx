import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { LocalizedLink } from "@/components/LocalizedLink";
import { Logo } from "@/components/Logo";
import { FacebookGlyph, InstagramGlyph } from "@/components/SocialGlyphs";
import { getGuideArticles } from "@/data/guideArticles";

type FooterProps = {
  locale: AppLocale;
  regions: Array<{
    href: { params: { id: string }; pathname: "/regions/[id]" };
    id: string;
    name: string;
  }>;
  venomous: Array<{
    commonName: string;
    href: {
      params: { slug: string };
      pathname:
        | "/amphibians/[slug]"
        | "/birds/[slug]"
        | "/insects/[slug]"
        | "/lizards/[slug]"
        | "/mammals/[slug]"
        | "/scorpions/[slug]"
        | "/snakes/[slug]"
        | "/spiders/[slug]"
        | "/turtles/[slug]";
    };
    id: string;
    scientificName: string;
  }>;
};

const exploreLinks = [
  { href: "/species" as const, labelKey: "species" as const },
  { href: "/snakes" as const, labelKey: "snakes" as const },
  { href: "/lizards" as const, labelKey: "lizards" as const },
  { href: "/turtles" as const, labelKey: "turtles" as const },
  { href: "/amphibians" as const, labelKey: "amphibians" as const },
  { href: "/birds" as const, labelKey: "birds" as const },
  { href: "/mammals" as const, labelKey: "mammals" as const },
  { href: "/scorpions" as const, labelKey: "scorpions" as const },
  { href: "/spiders" as const, labelKey: "spiders" as const },
  { href: "/insects" as const, labelKey: "insects" as const },
  { href: "/regions" as const, labelKey: "regions" as const },
];

const footerGuideIds = new Set(["scorpion-sting", "snake-bite", "tick-bite"]);

const guideLinks = [
  { href: "/venomous-snakes" as const, labelKey: "venomous" as const },
  {
    href: "/snakes/shxamiani-gvelis-amocnoba" as const,
    labelKey: "snakeIdentify" as const,
  },
  { href: "/snakes-in-the-yard" as const, labelKey: "yard" as const },
  ...getGuideArticles().flatMap((article) =>
    footerGuideIds.has(article.id)
      ? [{ href: article.pathname, labelKey: article.messageKey }]
      : [],
  ),
  {
    href: "/mammals/datvi-shekhvedra" as const,
    labelKey: "bearEncounter" as const,
  },
  {
    href: "/lizards/xvliki-sakhlshi" as const,
    labelKey: "lizardHouse" as const,
  },
  { href: "/risk-to-humans" as const, labelKey: "riskLevels" as const },
];

const companyLinks = [
  { href: "/about" as const, labelKey: "about" as const },
  { href: "/news" as const, labelKey: "news" as const },
  { href: "/authors" as const, labelKey: "contributors" as const },
  { href: "/contact" as const, labelKey: "contact" as const },
  { href: "/privacy" as const, labelKey: "privacy" as const },
  { href: "/terms-and-conditions" as const, labelKey: "terms" as const },
];

export async function Footer({ locale, regions, venomous }: FooterProps) {
  const t = await getTranslations({ locale, namespace: "footer" });

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.8fr_0.7fr] lg:gap-16">
          <div>
            <LocalizedLink
              className="inline-flex transition-opacity hover:opacity-90"
              href="/"
              locale={locale}
            >
              <Logo showWordmark size={52} wordmarkClassName="text-[19px]" />
            </LocalizedLink>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
              {t("tagline")}
            </p>
            <LocalizedLink
              className="group mt-7 inline-flex items-center gap-1.5 text-[13px] font-medium text-primary transition-opacity hover:opacity-80"
              href="/species"
              locale={locale}
            >
              {t("exploreCta")}
              <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </LocalizedLink>
          </div>

          <div>
            <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
              {t("exploreTitle")}
            </p>
            <ul className="mt-5 space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <LocalizedLink
                    className="text-[14px] text-foreground/80 transition-colors hover:text-primary"
                    href={link.href}
                    locale={locale}
                    prefetch={false}
                  >
                    {t(link.labelKey)}
                  </LocalizedLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
              {t("guidesTitle")}
            </p>
            <ul className="mt-5 space-y-3">
              {guideLinks.map((link) => (
                <li key={link.href}>
                  <LocalizedLink
                    className="text-[14px] text-foreground/80 transition-colors hover:text-primary"
                    href={link.href}
                    locale={locale}
                    prefetch={false}
                  >
                    {t(link.labelKey)}
                  </LocalizedLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
              {t("companyTitle")}
            </p>
            <ul className="mt-5 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <LocalizedLink
                    className="text-[14px] text-foreground/80 transition-colors hover:text-primary"
                    href={link.href}
                    locale={locale}
                    prefetch={false}
                  >
                    {t(link.labelKey)}
                  </LocalizedLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 grid gap-10 border-t border-border pt-12 lg:mt-16 lg:grid-cols-2 lg:gap-16 lg:pt-14">
          <div>
            <div className="flex items-end justify-between gap-4">
              <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                {t("venomousTitle")}
              </p>
              <LocalizedLink
                className="text-[12px] font-medium text-foreground transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:outline-none"
                href="/venomous-snakes"
                locale={locale}
              >
                {t("venomousAll")}
              </LocalizedLink>
            </div>
            <ul className="mt-5 columns-2 gap-x-8">
              {venomous.map((item) => (
                <li className="mb-3 break-inside-avoid" key={item.id}>
                  <LocalizedLink
                    className="group block focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:outline-none"
                    href={item.href}
                    locale={locale}
                    prefetch={false}
                  >
                    <span className="block text-[14px] font-medium text-foreground transition-colors group-hover:text-primary">
                      {item.commonName}
                    </span>
                    <span className="mt-0.5 block text-[12px] text-muted-foreground italic">
                      {item.scientificName}
                    </span>
                  </LocalizedLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-end justify-between gap-4">
              <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                {t("regionsTitle")}
              </p>
              <LocalizedLink
                className="text-[12px] font-medium text-foreground transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:outline-none"
                href="/regions"
                locale={locale}
              >
                {t("regionsAll")}
              </LocalizedLink>
            </div>
            <ul className="mt-5 columns-2 gap-x-8 sm:columns-3">
              {regions.map((region) => (
                <li className="mb-2.5 break-inside-avoid" key={region.id}>
                  <LocalizedLink
                    className="text-[13px] text-foreground/75 transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:outline-none"
                    href={region.href}
                    locale={locale}
                    prefetch={false}
                  >
                    {region.name}
                  </LocalizedLink>
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
            <a
              aria-label={t("facebook")}
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary/35 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:outline-none"
              href="https://www.facebook.com/reptiles.ge/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <FacebookGlyph className="size-4 shrink-0" />
            </a>
            <a
              aria-label={t("instagram")}
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary/35 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:outline-none"
              href="https://www.instagram.com/reptiles.ge/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <InstagramGlyph className="size-4 shrink-0" />
            </a>
            <span className="tracking-wide">{t("forCurious")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
