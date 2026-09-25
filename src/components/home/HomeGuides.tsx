import { ArrowUpRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { CoverImage } from "@/components/CoverImage";
import { getGuideArticles } from "@/data/guideArticles";
import { Link } from "@/i18n/navigation";

export async function HomeGuides() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("home.guides");

  return (
    <section
      aria-labelledby="home-guides-title"
      className="border-t border-border bg-surface py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
          {t("eyebrow")}
        </p>
        <h2
          className="text-balance-tight mt-4 max-w-4xl font-display text-display-title font-semibold"
          id="home-guides-title"
        >
          {t("title")}
        </h2>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          {t("subtitle")}
        </p>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-4">
          {getGuideArticles().map((article) => (
            <li key={article.id}>
              <Link
                className="group flex h-full min-h-32 items-center gap-4 rounded-xl border border-border bg-card/70 p-3 transition-colors hover:border-primary/40 hover:bg-card focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:outline-none sm:p-4"
                href={article.pathname}
              >
                <span className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-ink sm:size-28">
                  <CoverImage
                    alt={article.hero.alt[locale]}
                    className="object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.04]"
                    sizes="112px"
                    src={article.hero.src}
                  />
                </span>
                <span className="min-w-0 flex-1 py-1">
                  <span className="block font-display text-[17px] leading-snug font-semibold text-foreground transition-colors group-hover:text-primary">
                    {article.search.title[locale]}
                  </span>
                  <span className="mt-2 line-clamp-2 block text-[13px] leading-relaxed text-muted-foreground">
                    {article.search.subtitle[locale]}
                  </span>
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 shrink-0 self-start text-muted-foreground transition-colors group-hover:text-primary"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
