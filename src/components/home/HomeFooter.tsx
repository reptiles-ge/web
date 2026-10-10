import { ArrowUpRight, ChevronDown } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { Logo } from "@/components/Logo";
import { FacebookGlyph, InstagramGlyph } from "@/components/SocialGlyphs";
import { getGuideArticles } from "@/data/guideArticles";
import { releaseVersion } from "@/data/releaseVersion.generated";
import { Link } from "@/i18n/navigation";

const explore = [
  { href: "/species" as const, key: "species" as const },
  { href: "/snakes" as const, key: "snakes" as const },
  { href: "/lizards" as const, key: "lizards" as const },
  { href: "/turtles" as const, key: "turtles" as const },
  { href: "/amphibians" as const, key: "amphibians" as const },
  { href: "/birds" as const, key: "birds" as const },
  { href: "/mammals" as const, key: "mammals" as const },
  { href: "/scorpions" as const, key: "scorpions" as const },
  { href: "/spiders" as const, key: "spiders" as const },
  { href: "/insects" as const, key: "insects" as const },
  { href: "/regions" as const, key: "regions" as const },
];

const company = [
  { href: "/about" as const, key: "about" as const },
  { href: "/news" as const, key: "news" as const },
  { href: "/authors" as const, key: "contributors" as const },
  { href: "/contact" as const, key: "contact" as const },
  { href: "/privacy" as const, key: "privacy" as const },
  { href: "/terms-and-conditions" as const, key: "terms" as const },
];

const footerGuideIds = new Set(["scorpion-sting", "snake-bite", "tick-bite"]);

export async function HomeFooter({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "footer" });
  const guides = getGuideArticles().filter((article) =>
    footerGuideIds.has(article.id),
  );
  const columns = [
    {
      links: explore.map((item) => ({ href: item.href, label: t(item.key) })),
      title: t("exploreTitle"),
    },
    {
      links: [
        { href: "/venomous-snakes" as const, label: t("venomous") },
        {
          href: "/snakes/shxamiani-gvelis-amocnoba" as const,
          label: t("snakeIdentify"),
        },
        { href: "/snakes-in-the-yard" as const, label: t("yard") },
        ...guides.map((article) => ({
          href: article.pathname,
          label: t(article.messageKey),
        })),
        {
          href: "/mammals/datvi-shekhvedra" as const,
          label: t("bearEncounter"),
        },
        { href: "/lizards/xvliki-sakhlshi" as const, label: t("lizardHouse") },
        { href: "/risk-to-humans" as const, label: t("riskLevels") },
      ],
      title: t("guidesTitle"),
    },
    {
      links: company.map((item) => ({ href: item.href, label: t(item.key) })),
      title: t("companyTitle"),
    },
  ];

  return (
    <footer className="bg-surface text-foreground">
      <div className="mx-auto max-w-[1440px] px-6 pt-9 pb-5 lg:px-[60px] lg:pt-12 lg:pb-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,0.8fr))] lg:gap-12">
          <div>
            <Link className="inline-flex items-center" href="/">
              <Logo showWordmark size={48} wordmarkClassName="text-[17px]" />
            </Link>
            <p className="mt-4 max-w-[320px] text-[13px] leading-[1.6] text-muted-foreground">
              {t("tagline")}
            </p>
            <Link
              className="mt-5 inline-flex min-h-11 items-center gap-1.5 text-[13px] font-medium text-primary"
              href="/species"
            >
              {t("exploreCta")}
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
          <div className="hidden lg:contents">
            {columns.map((column) => (
              <nav aria-label={column.title} key={column.title}>
                <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                  {column.title}
                </p>
                <ul className="mt-4 space-y-1">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        className="block py-1 text-[13px] leading-[1.35] text-foreground/80 hover:text-primary"
                        href={link.href}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
          <div className="space-y-2.5 lg:hidden">
            {columns.map((column) => (
              <details
                className="group rounded-[22px] bg-card px-5 shadow-[0_10px_26px_rgba(14,20,17,0.05)]"
                key={column.title}
              >
                <summary className="flex min-h-[60px] cursor-pointer list-none items-center justify-between gap-3 font-display text-[15px] font-semibold [&::-webkit-details-marker]:hidden">
                  {column.title}
                  <ChevronDown
                    aria-hidden="true"
                    className="size-4 transition-transform group-open:rotate-180"
                  />
                </summary>
                <ul className="grid gap-1 border-t border-border pt-2 pb-4">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        className="block min-h-10 py-2 text-[14px] leading-snug text-foreground/80"
                        href={link.href}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5 text-[11px] text-muted-foreground lg:mt-10">
          <span>
            © {new Date().getFullYear()} Reptiles. {t("rights")}
            {releaseVersion ? ` · ${releaseVersion}` : null}
          </span>
          <div className="flex items-center gap-2">
            <a
              aria-label={t("facebook")}
              className="flex size-9 items-center justify-center rounded-full bg-card text-muted-foreground hover:text-primary"
              href="https://www.facebook.com/reptiles.ge/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <FacebookGlyph className="size-4" />
            </a>
            <a
              aria-label={t("instagram")}
              className="flex size-9 items-center justify-center rounded-full bg-card text-muted-foreground hover:text-primary"
              href="https://www.instagram.com/reptiles.ge/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <InstagramGlyph className="size-4" />
            </a>
            <span className="hidden sm:inline">{t("forCurious")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
