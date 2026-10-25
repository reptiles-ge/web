import type { ComponentProps, ReactNode } from "react";

import { ArrowRight, ArrowUpRight, ChevronDown, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";
import type { FooterData } from "@/lib/footerData";

import { BackToTop, FooterLanguageSwitch } from "@/components/FooterControls";
import { LocalizedLink } from "@/components/LocalizedLink";
import { Logo } from "@/components/Logo";
import { FacebookGlyph, InstagramGlyph } from "@/components/SocialGlyphs";
import { getGuideArticles } from "@/data/guideArticles";
import { releaseVersion } from "@/data/releaseVersion.generated";
import { cn } from "@/lib/cn";

type FooterHref = ComponentProps<typeof LocalizedLink>["href"];

type FooterLink = { href: FooterHref; label: string };

type FooterProps = FooterData & { locale: AppLocale };

const atlasLinks = [
  { href: "/species" as const, labelKey: "species" as const },
  { href: "/regions" as const, labelKey: "regions" as const },
  { href: "/venomous-snakes" as const, labelKey: "venomous" as const },
  { href: "/quiz" as const, labelKey: "quizzes" as const },
  { href: "/news" as const, labelKey: "news" as const },
];

const groupLinks = [
  { href: "/snakes" as const, labelKey: "snakes" as const },
  { href: "/lizards" as const, labelKey: "lizards" as const },
  { href: "/turtles" as const, labelKey: "turtles" as const },
  { href: "/amphibians" as const, labelKey: "amphibians" as const },
  { href: "/birds" as const, labelKey: "birds" as const },
  { href: "/mammals" as const, labelKey: "mammals" as const },
  { href: "/spiders" as const, labelKey: "spiders" as const },
  { href: "/scorpions" as const, labelKey: "scorpions" as const },
  { href: "/insects" as const, labelKey: "insects" as const },
];

const footerGuideIds = new Set([
  "scorpion-sting",
  "snake-bite",
  "snakes-in-yard",
  "tick-bite",
]);

const guideLinks = [
  {
    href: "/snakes/shxamiani-gvelis-amocnoba" as const,
    labelKey: "snakeIdentify" as const,
  },
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
  { href: "/authors" as const, labelKey: "contributors" as const },
  { href: "/contact" as const, labelKey: "contact" as const },
  { href: "/privacy" as const, labelKey: "privacy" as const },
  { href: "/terms-and-conditions" as const, labelKey: "terms" as const },
  { href: "/photo-use" as const, labelKey: "photoUse" as const },
  { href: "/developers" as const, labelKey: "developers" as const },
];

const biteGuide = getGuideArticles().find(
  (article) => article.id === "snake-bite",
);

const eyebrowClass =
  "text-[11px] font-medium tracking-[0.18em] text-white/50 uppercase";

const columnLinkClass =
  "flex min-h-11 items-center text-[15px] text-white/86 transition-colors hover:text-white lg:block lg:min-h-0 lg:py-1.5 lg:text-[14.5px] lg:leading-[1.4] lg:text-white/82";

const socialClass =
  "inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-white/14 text-white/82 transition-colors hover:bg-white/8 hover:text-white lg:size-10";

export async function Footer({
  locale,
  regions,
  stats,
  venomous,
}: FooterProps) {
  const t = await getTranslations({ locale, namespace: "footer" });
  const toLinks = (
    items: ReadonlyArray<{
      href: FooterHref;
      labelKey: Parameters<typeof t>[0];
    }>,
  ) => items.map((item) => ({ href: item.href, label: t(item.labelKey) }));
  const guides = toLinks(guideLinks);
  const venomousLinks = venomous.map((item) => ({
    href: item.href,
    label: item.commonName,
  }));
  const regionLinks = regions.map((region) => ({
    href: region.href,
    label: region.name,
  }));

  return (
    <footer className="bg-ink text-white antialiased">
      <div className="mx-auto max-w-[1440px] px-5 pt-11 pb-7 sm:px-8 lg:px-[60px] lg:pt-16 lg:pb-0">
        <div className="grid grid-cols-2 gap-x-4 lg:grid-cols-[minmax(0,420px)_repeat(4,minmax(0,1fr))] lg:gap-10">
          <div className="col-span-2 lg:col-span-1">
            <LocalizedLink
              className="inline-flex transition-opacity hover:opacity-90"
              href="/"
              locale={locale}
            >
              <Logo
                showWordmark
                size={44}
                wordmarkClassName="text-[18px] lg:text-[19px]"
              />
            </LocalizedLink>
            <p className="mt-[18px] font-display text-[24px] leading-[1.2] font-semibold tracking-[-0.01em] lg:mt-[22px] lg:text-[28px]">
              {t("title")}
            </p>
            <p className="mt-2.5 max-w-[360px] text-[14.5px] leading-[1.6] text-white/62 lg:mt-3 lg:text-[15px] lg:leading-[1.65]">
              {t("tagline")}
            </p>
            <LocalizedLink
              className="mt-6 hidden h-12 items-center gap-2.5 rounded-full bg-white pr-2 pl-5 text-[14.5px] font-semibold text-ink transition-opacity hover:opacity-90 lg:inline-flex"
              href="/species"
              locale={locale}
            >
              {t("speciesCta", { count: stats.total })}
              <span className="flex size-8 items-center justify-center rounded-full bg-[#2f6b4f] text-white">
                <ArrowRight aria-hidden="true" className="size-[15px]" />
              </span>
            </LocalizedLink>
            <a
              className="mt-6 flex items-center gap-3.5 rounded-[22px] border border-destructive/36 bg-[#b84336]/16 p-4 lg:hidden"
              href="tel:112"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#b84336]">
                <Phone aria-hidden="true" className="size-[18px]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-bold">
                  {t("emergencyShort")}
                </span>
                <span className="mt-0.5 block text-[13px] leading-[1.45] text-white/72">
                  {t("emergencyHint")}
                </span>
              </span>
            </a>
          </div>

          <FooterColumn
            className="col-start-1 row-start-2 mt-8 lg:order-1 lg:col-start-auto lg:row-start-auto lg:mt-0"
            links={toLinks(atlasLinks)}
            locale={locale}
            title={t("atlasTitle")}
          />
          <FooterColumn
            className="col-span-2 mt-6 lg:order-2 lg:col-span-1 lg:mt-0"
            linkClassName="inline-flex h-10 items-center rounded-full bg-white/7 px-3.5 text-[14px] text-white/86 transition-colors hover:text-white lg:flex lg:h-auto lg:rounded-none lg:bg-transparent lg:px-0 lg:py-1.5 lg:text-[14.5px] lg:leading-[1.4] lg:text-white/82"
            links={toLinks(groupLinks)}
            listClassName="mt-1.5 flex flex-wrap gap-2 lg:mt-0 lg:block"
            locale={locale}
            title={t("groupsTitle")}
          />
          <FooterColumn
            className="hidden lg:order-3 lg:block"
            links={guides}
            locale={locale}
            title={t("guidesTitle")}
          />
          <FooterColumn
            className="col-start-2 row-start-2 mt-8 lg:order-4 lg:col-start-auto lg:row-start-auto lg:mt-0"
            links={toLinks(companyLinks)}
            locale={locale}
            title={t("companyTitle")}
          />
        </div>

        <div className="mt-10 hidden items-center gap-[18px] rounded-[22px] border border-destructive/32 bg-[#b84336]/14 py-4 pr-4 pl-5 lg:flex">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#b84336]">
            <Phone aria-hidden="true" className="size-[17px]" strokeWidth={2} />
          </span>
          <p className="flex-1 text-[15px] text-white/86">
            {t("emergencyLead")}{" "}
            <strong className="font-semibold text-white">
              {t("emergencyCall")}
            </strong>
          </p>
          {biteGuide ? (
            <LocalizedLink
              className="tap-target inline-flex h-10 shrink-0 items-center gap-1.5 px-3.5 text-[14px] font-medium text-white/86 transition-colors hover:text-white"
              href={biteGuide.pathname}
              locale={locale}
            >
              {t("biteGuide")}
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
            </LocalizedLink>
          ) : null}
          <a
            className="tap-target inline-flex h-10 shrink-0 items-center rounded-full bg-[#b84336] px-[18px] text-[15px] font-bold text-white"
            href="tel:112"
          >
            112
          </a>
        </div>

        <div className="mt-7 hidden grid-cols-[160px_minmax(0,1fr)] items-baseline gap-x-6 gap-y-2.5 lg:grid">
          <p className={eyebrowClass} id="footer-venomous-label">
            {t("venomousTitle")}
          </p>
          <InlineLinks
            dots
            labelledBy="footer-venomous-label"
            links={venomousLinks}
            locale={locale}
          />
          <p className={eyebrowClass} id="footer-regions-label">
            {t("regions")}
          </p>
          <InlineLinks
            dots
            labelledBy="footer-regions-label"
            links={regionLinks}
            locale={locale}
          />
        </div>

        <div className="mt-7 border-b border-white/10 lg:hidden">
          <FooterAccordion open title={t("guidesTitle")}>
            <ul className="pb-3">
              {guides.map((link) => (
                <li key={link.label}>
                  <LocalizedLink
                    className="flex min-h-10 items-center text-[14.5px] text-white/86"
                    href={link.href}
                    locale={locale}
                    prefetch={false}
                  >
                    {link.label}
                  </LocalizedLink>
                </li>
              ))}
            </ul>
          </FooterAccordion>
          <FooterAccordion count={venomous.length} title={t("venomousTitle")}>
            <InlineLinks dots={false} links={venomousLinks} locale={locale} />
          </FooterAccordion>
          <FooterAccordion count={regions.length} title={t("regions")}>
            <InlineLinks dots={false} links={regionLinks} locale={locale} />
          </FooterAccordion>
        </div>

        <div className="mt-7 flex flex-col gap-5 lg:mt-12 lg:h-[76px] lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:border-t lg:border-white/10">
          <p className="order-last border-t border-white/10 pt-5 text-[12.5px] leading-[1.6] text-white/50 lg:order-0 lg:border-0 lg:pt-0 lg:text-[13px] lg:text-white/56">
            © {new Date().getFullYear()} Reptiles · {t("rights")}
            {releaseVersion ? ` · ${releaseVersion}` : null}
          </p>
          <FooterLanguageSwitch />
          <div className="flex items-center gap-2.5">
            <a
              aria-label={t("facebook")}
              className={socialClass}
              href="https://www.facebook.com/reptiles.ge/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <FacebookGlyph className="size-4" />
            </a>
            <a
              aria-label={t("instagram")}
              className={socialClass}
              href="https://www.instagram.com/reptiles.ge/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <InstagramGlyph className="size-4" />
            </a>
            <div className="flex-1 lg:hidden" />
            <BackToTop label={t("backToTopLabel")} text={t("backToTop")} />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterAccordion({
  children,
  count,
  open,
  title,
}: {
  children: ReactNode;
  count?: number;
  open?: boolean;
  title: string;
}) {
  return (
    <details className="group border-t border-white/10" open={open}>
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 text-[15px] font-semibold text-white [&::-webkit-details-marker]:hidden">
        <span>
          {title}
          {count ? (
            <span className="ml-1.5 font-normal text-white/50">{count}</span>
          ) : null}
        </span>
        <ChevronDown
          aria-hidden="true"
          className="size-[18px] text-white/60 transition-transform duration-200 group-open:rotate-180"
          strokeWidth={1.75}
        />
      </summary>
      {children}
    </details>
  );
}

function FooterColumn({
  className,
  linkClassName = columnLinkClass,
  links,
  listClassName,
  locale,
  title,
}: {
  className?: string;
  linkClassName?: string;
  links: FooterLink[];
  listClassName?: string;
  locale: AppLocale;
  title: string;
}) {
  return (
    <nav aria-label={title} className={className}>
      <p className={cn(eyebrowClass, "mb-1.5 lg:mb-3.5")}>{title}</p>
      <ul className={listClassName}>
        {links.map((link) => (
          <li key={link.label}>
            <LocalizedLink
              className={linkClassName}
              href={link.href}
              locale={locale}
              prefetch={false}
            >
              {link.label}
            </LocalizedLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function InlineLinks({
  dots,
  labelledBy,
  links,
  locale,
}: {
  dots: boolean;
  labelledBy?: string;
  links: FooterLink[];
  locale: AppLocale;
}) {
  return (
    <ul
      aria-labelledby={labelledBy}
      className={cn("flex flex-wrap", dots ? "gap-y-0.5" : "gap-x-4 pb-3")}
    >
      {links.map((link, index) => (
        <li className="inline-flex items-center" key={link.label}>
          <LocalizedLink
            className={cn(
              "transition-colors hover:text-white",
              dots
                ? "text-[13.5px] leading-[1.9] text-white/66"
                : "inline-flex min-h-9 items-center text-[14px] text-white/70",
            )}
            href={link.href}
            locale={locale}
            prefetch={false}
          >
            {link.label}
          </LocalizedLink>
          {dots && index < links.length - 1 ? (
            <span aria-hidden="true" className="mx-2 text-white/24">
              ·
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
