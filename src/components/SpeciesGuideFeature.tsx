import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { GalleryImage } from "@/data/species";
import type { AppLocale } from "@/i18n/routing";
import type { HubClusterCard } from "@/lib/clusterGuides";

import { optimizedImgSrc, pictureSources } from "@/data/optimizedImages";
import { Link } from "@/i18n/navigation";
import { speciesHrefFromIndex } from "@/lib/localeSwitch";
import { getLocaleSwitchIndex } from "@/lib/localeSwitchData";
import { quizHref } from "@/lib/quizzes";

const GUIDE_KEYS = ["gyurzaBite", "bite", "venomous", "identify"] as const;

export async function SpeciesGuideFeature({
  gallery,
  guideLinks,
  locale,
  speciesId,
  speciesName,
}: {
  gallery: GalleryImage[];
  guideLinks: HubClusterCard[];
  locale: AppLocale;
  speciesId: string;
  speciesName: string;
}) {
  const [t, tGuides] = await Promise.all([
    getTranslations({ locale, namespace: "profile" }),
    getTranslations({ locale, namespace: "groupHubShared" }),
  ]);
  const switchIndex = getLocaleSwitchIndex();
  const pageLinks = guideLinks.filter((item) => item.kind === "page");
  const guides =
    speciesId === "macrovipera-lebetina"
      ? GUIDE_KEYS.flatMap((key) => {
          const card = pageLinks.find((item) => item.key === key);
          return card ? [card] : [];
        })
      : guideLinks.filter((item) => item.kind !== "quiz");
  const quiz = guideLinks.find((item) => item.kind === "quiz");
  const lizardQuiz = quiz?.id === "lizard";

  return (
    <section className="bg-background py-9 lg:py-20">
      <div
        className={`mx-auto grid max-w-[1440px] gap-3 px-4 lg:items-stretch lg:gap-6 lg:px-[60px] ${quiz ? "lg:grid-cols-[minmax(0,1fr)_520px]" : "lg:grid-cols-1"}`}
      >
        <div className="lg:rounded-[36px] lg:bg-card lg:px-3 lg:pt-[30px] lg:pb-2">
          <div className="px-2 pb-5 lg:px-5 lg:pb-[18px]">
            <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
              {t("guidesEyebrow")}
            </p>
            <h2 className="mt-3 font-display text-[28px] leading-[1.2] font-semibold text-foreground">
              {t("guidesTitle")}
            </h2>
          </div>
          <div className="rounded-[28px] bg-card px-2 lg:rounded-none lg:bg-transparent lg:px-0">
            {guides.map((card, index) => (
              <Link
                className="group flex min-h-[88px] items-center gap-3 border-t border-border px-3 py-4 first:border-t-0 hover:text-primary lg:min-h-[104px] lg:gap-4 lg:px-5"
                href={
                  card.kind === "page"
                    ? card.href
                    : speciesHrefFromIndex(switchIndex, card.id, locale)
                }
                key={card.key}
              >
                <span
                  className={
                    card.key === "gyurzaBite"
                      ? "flex size-10 shrink-0 items-center justify-center rounded-full bg-[#b84336] text-[12px] font-semibold text-white"
                      : "flex size-10 shrink-0 items-center justify-center rounded-full bg-background text-[12px] font-semibold text-foreground"
                  }
                >
                  {card.key === "gyurzaBite"
                    ? "112"
                    : String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block font-display text-[16px] leading-tight font-semibold text-foreground lg:text-[17px]">
                    {tGuides(`cluster.${card.key}.title`)}
                  </strong>
                  <span className="mt-1 block text-[13px] leading-[1.45] text-muted-foreground lg:text-[14px]">
                    {tGuides(`cluster.${card.key}.body`)}
                  </span>
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1"
                />
              </Link>
            ))}
          </div>
        </div>

        {quiz ? (
          <div className="flex flex-col rounded-[30px] bg-[#0e1411] px-[22px] pt-[26px] pb-[22px] text-white lg:rounded-[36px] lg:px-10 lg:pt-10 lg:pb-9">
            <p className="text-[11px] font-medium tracking-[0.18em] text-white/60 uppercase">
              {t("quizCtaEyebrow")}
            </p>
            <h2 className="mt-2.5 font-display text-[26px] leading-[1.15] font-semibold lg:mt-3.5 lg:text-[36px] lg:leading-[1.12]">
              {t(lizardQuiz ? "quizCtaTitleLizard" : "quizCtaTitle")}
            </h2>
            <p className="mt-2.5 text-[14.5px] leading-[1.6] text-white/70 lg:mt-3.5 lg:text-[16px] lg:leading-[1.65]">
              {t(lizardQuiz ? "quizCtaBodyLizard" : "quizCtaBody", {
                name: speciesName,
              })}
            </p>
            {gallery.length > 0 ? (
              <div aria-hidden="true" className="mt-6 hidden gap-2 lg:flex">
                {gallery.slice(0, 3).map((photo) => (
                  <picture
                    className="h-24 min-w-0 flex-1 overflow-hidden rounded-2xl bg-white/10"
                    key={photo.src}
                    title={photo.credit?.photographer}
                  >
                    {pictureSources(photo.src, { sizes: "160px" }).map(
                      (source) => (
                        <source key={source.key} {...source.props} />
                      ),
                    )}
                    <img
                      alt=""
                      className="size-full object-cover"
                      decoding="async"
                      loading="lazy"
                      sizes="160px"
                      src={optimizedImgSrc(photo.src, 320)}
                    />
                  </picture>
                ))}
              </div>
            ) : null}
            <div className="mt-auto pt-5 lg:pt-6">
              <Link
                className="flex min-h-13 items-center justify-center gap-2.5 rounded-full bg-white px-6 text-[15px] font-medium text-[#0e1411] transition-transform hover:-translate-y-0.5 lg:w-fit"
                href={quizHref(quiz.id, locale)}
              >
                {t("quizCta")}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
