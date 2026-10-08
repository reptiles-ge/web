import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { CoverImage } from "@/components/CoverImage";
import { getGuideArticles } from "@/data/guideArticles";
import { Link } from "@/i18n/navigation";

const FEATURED_GUIDE_IDS = [
  "bat-in-house",
  "wasp-nest",
  "mosquitoes-at-home",
  "cockroaches-at-home",
];

export async function HomeGuides({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "home.guides" });
  const articles = getGuideArticles();
  const featured = FEATURED_GUIDE_IDS.map((id) =>
    articles.find((article) => article.id === id),
  ).filter((article) => article != null);
  const rest = articles.filter(
    (article) => !FEATURED_GUIDE_IDS.includes(article.id),
  );

  return (
    <section
      aria-labelledby="home-guides-title"
      className="bg-surface pt-10 pb-11 lg:pt-12 lg:pb-20"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-[60px]">
        <div className="flex flex-col-reverse gap-2 lg:flex-row lg:items-baseline lg:justify-between">
          <h3
            className="font-display text-[22px] leading-tight font-semibold text-foreground lg:text-[26px]"
            id="home-guides-title"
          >
            {t("title")}
          </h3>
          <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
            {t("eyebrow")}
          </p>
        </div>

        <ul className="no-scrollbar -mx-6 mt-5 flex snap-x snap-mandatory scroll-px-6 gap-3 overflow-x-auto overscroll-x-contain px-6 pb-4 lg:mx-0 lg:mt-6 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0">
          {featured.map((article) => (
            <li
              className="w-[280px] shrink-0 snap-start lg:w-auto"
              key={article.id}
            >
              <Link
                className="group block h-full rounded-[26px] bg-card p-2.5 pb-5 shadow-[0_16px_40px_rgba(14,20,17,0.06)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary lg:rounded-[30px] lg:p-3 lg:pb-[22px]"
                href={article.pathname}
              >
                <span className="relative block aspect-3/2 overflow-hidden rounded-[20px] bg-ink">
                  <CoverImage
                    alt={article.hero.alt[locale]}
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                    sizes="(max-width: 1023px) 280px, 300px"
                    src={article.hero.src}
                  />
                </span>
                <span className="block px-1.5 lg:px-2">
                  <span className="mt-3 block font-display text-[17px] leading-snug font-semibold text-foreground lg:mt-4 lg:text-[18px]">
                    {article.search.title[locale]}
                  </span>
                  <span className="mt-1.5 line-clamp-2 text-[13px] leading-normal text-muted-foreground lg:text-[13.5px]">
                    {article.search.subtitle[locale]}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <nav
          aria-label={t("more")}
          className="mt-3 lg:mt-9 lg:flex lg:items-baseline lg:gap-5"
        >
          <p className="shrink-0 text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
            {t("more")}
          </p>
          <ul className="no-scrollbar -mx-6 mt-3 flex gap-2 overflow-x-auto px-6 pb-1 lg:mx-0 lg:mt-0 lg:flex-wrap lg:overflow-visible lg:px-0 lg:pb-0">
            {rest.map((article) => (
              <li className="shrink-0" key={article.id}>
                <Link
                  className="inline-flex min-h-11 items-center rounded-full border border-transparent bg-card px-[18px] text-[13px] font-medium whitespace-nowrap text-foreground shadow-[0_1px_2px_rgba(14,20,17,0.05)] transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  href={article.pathname}
                >
                  {article.search.title[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
