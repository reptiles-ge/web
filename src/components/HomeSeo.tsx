import { ChevronDown } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { getGuideArticles } from "@/data/guideArticles";
import { Link } from "@/i18n/navigation";

const hubs = [
  { href: "/species", key: "species" as const },
  { href: "/snakes", key: "snakes" as const },
  { href: "/lizards", key: "lizards" as const },
  { href: "/turtles", key: "turtles" as const },
  { href: "/amphibians", key: "amphibians" as const },
  { href: "/birds", key: "birds" as const },
  { href: "/mammals", key: "mammals" as const },
  { href: "/spiders", key: "spiders" as const },
  { href: "/venomous-snakes", key: "venomous" as const },
  { href: "/snakes/shxamiani-gvelis-amocnoba", key: "identify" as const },
  { href: "/snakes-in-the-yard", key: "yard" as const },
  { href: "/spiders/shxamiani-obobebi", key: "spiderVenomous" as const },
  { href: "/spiders/obobis-nakbeni", key: "spiderBite" as const },
  { href: "/mammals/tura-ezoshi", key: "jackalYard" as const },
  { href: "/mammals/datvi-shekhvedra", key: "bearEncounter" as const },
  ...getGuideArticles().map((article) => ({
    href: article.pathname,
    key: article.messageKey,
  })),
  { href: "/lizards/xvliki-sakhlshi", key: "lizardHouse" as const },
  { href: "/lizards/identifikacia", key: "lizardIdentify" as const },
  { href: "/amphibians/bayayi", key: "frogs" as const },
  { href: "/turtles/identifikacia", key: "turtleIdentify" as const },
  { href: "/regions", key: "regions" as const },
] as const;

export async function HomeSeo({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "home.seo" });
  const columns = [
    { links: hubs.slice(0, 10), title: t("directoryExplore") },
    { links: hubs.slice(10, 22), title: t("directoryGuides") },
    { links: hubs.slice(22), title: t("directoryMore") },
  ];

  return (
    <section className="bg-background py-11 lg:py-20">
      <div className="mx-auto grid max-w-[1440px] gap-6 px-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start lg:gap-16 lg:px-[60px]">
        <div>
          <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
            {t("eyebrow")}
          </p>
          <h2 className="mt-3 max-w-[440px] font-display text-[28px] leading-[1.15] font-semibold tracking-[-0.012em] text-foreground lg:mt-4 lg:text-[38px] lg:leading-[1.1]">
            {t("title")}
          </h2>
          <div className="mt-4 max-w-[500px] space-y-3 text-[14px] leading-[1.65] text-muted-foreground lg:mt-5 lg:text-[15px] lg:leading-[1.75]">
            <p>{t("p1")}</p>
            <p>{t("p2")}</p>
          </div>
        </div>
        <nav aria-label={t("title")}>
          <div className="hidden grid-cols-3 gap-6 rounded-[30px] bg-card p-8 shadow-[0_14px_36px_rgba(14,20,17,0.06)] lg:grid">
            {columns.map((column) => (
              <div key={column.title}>
                <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                  {column.title}
                </p>
                <ul className="mt-4 space-y-1">
                  {column.links.map((hub) => (
                    <li key={hub.key}>
                      <Link
                        className="block py-1.5 text-[13px] leading-[1.35] text-foreground/85 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        href={hub.href}
                      >
                        {t(`links.${hub.key}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="space-y-2.5 lg:hidden">
            {columns.map((column) => (
              <details
                className="group rounded-[22px] bg-card px-5 shadow-[0_10px_26px_rgba(14,20,17,0.05)]"
                key={column.title}
              >
                <summary className="flex min-h-[60px] cursor-pointer list-none items-center justify-between gap-3 font-display text-[15px] font-semibold text-foreground [&::-webkit-details-marker]:hidden">
                  {column.title}
                  <ChevronDown
                    aria-hidden="true"
                    className="size-4 transition-transform group-open:rotate-180"
                  />
                </summary>
                <ul className="grid gap-1 border-t border-border pt-2 pb-4">
                  {column.links.map((hub) => (
                    <li key={hub.key}>
                      <Link
                        className="block min-h-10 py-2 text-[14px] leading-snug text-foreground/80"
                        href={hub.href}
                      >
                        {t(`links.${hub.key}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </nav>
      </div>
    </section>
  );
}
