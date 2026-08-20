import { Link } from "@/i18n/navigation";
import type { QuizDefinition, QuizMessageKey } from "@/lib/quizzes";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

export type QuizCardModel = QuizDefinition & {
  image: string;
  imageAlt: string;
};

type QuizzesPageProps = {
  items: QuizCardModel[];
};

type QuizCopy = {
  title: string;
  lead: string;
  tag: string;
};

export async function QuizzesPage({ items }: QuizzesPageProps) {
  const t = await getTranslations("quizzes");
  const featured = items.find((item) => item.status === "live") ?? items[0];
  const upcoming = items.filter((item) => item.id !== featured?.id);
  const how = [
    { title: t("how1Title"), body: t("how1Body") },
    { title: t("how2Title"), body: t("how2Body") },
    { title: t("how3Title"), body: t("how3Body") },
  ] as const;
  const copy = quizCopy(t);

  if (!featured) return null;

  return (
    <div className="min-h-screen bg-background">
      <section className="pb-10 pt-28 sm:pb-14 sm:pt-32 lg:pb-16">
        <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
            {t("eyebrow")}
          </p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <h1 className="font-display text-[clamp(2.8rem,9vw,7rem)] font-semibold leading-[0.9] text-foreground">
              {t("title")}
            </h1>
            <p className="max-w-md text-[15px] leading-relaxed text-muted-foreground sm:text-[16px] lg:justify-self-end lg:pb-3">
              {t("subtitle")}
            </p>
          </div>

          <FeaturedQuizCard
            item={featured}
            copy={copy[featured.id]}
            liveLabel={t("live")}
            questionsLabel={
              featured.questions
                ? t("questions", { count: featured.questions })
                : null
            }
            startLabel={t("start")}
          />

          <div className="mt-10 sm:mt-12">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
              {t("soonEyebrow")}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-4">
              {upcoming.map((item) => (
                <UpcomingQuizCard
                  key={item.id}
                  item={item}
                  copy={copy[item.id]}
                  soonLabel={t("soon")}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-background py-16 text-foreground lg:py-24">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
            {t("howEyebrow")}
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-[clamp(1.6rem,3.4vw,2.6rem)] font-semibold leading-[1.08]">
            {t("howTitle")}
          </h2>
          <ul className="mt-10 grid gap-px overflow-hidden rounded-[24px] border border-border bg-border/80 sm:grid-cols-3">
            {how.map((step, index) => (
              <li key={step.title} className="bg-card px-6 py-7 sm:px-8 sm:py-9">
                <span className="font-display text-[12px] tracking-[0.22em] text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-4 font-display text-[20px] font-semibold">
                  {step.title}
                </p>
                <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function quizCopy(
  t: Awaited<ReturnType<typeof getTranslations<"quizzes">>>,
): Record<QuizMessageKey, QuizCopy> {
  return {
    snake: {
      title: t("snakeTitle"),
      lead: t("snakeLead"),
      tag: t("snakeTag"),
    },
    lizard: {
      title: t("lizardTitle"),
      lead: t("lizardLead"),
      tag: t("lizardTag"),
    },
    turtle: {
      title: t("turtleTitle"),
      lead: t("turtleLead"),
      tag: t("turtleTag"),
    },
  };
}

function FeaturedQuizCard({
  item,
  copy,
  liveLabel,
  questionsLabel,
  startLabel,
}: {
  item: QuizCardModel;
  copy: QuizCopy;
  liveLabel: string;
  questionsLabel: string | null;
  startLabel: string;
}) {
  const inner = (
    <div className="grid sm:grid-cols-[14rem_1fr] lg:grid-cols-[18rem_1fr]">
      <div className="relative h-44 sm:h-auto">
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          priority
          sizes="(min-width: 1024px) 18rem, (min-width: 640px) 14rem, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className="p-5 sm:p-7 lg:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-foreground">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            {liveLabel}
          </span>
          <span className="rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {copy.tag}
          </span>
          {questionsLabel ? (
            <span className="rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              {questionsLabel}
            </span>
          ) : null}
        </div>
        <h2 className="mt-4 max-w-xl font-display text-[clamp(1.45rem,3.2vw,2.25rem)] font-semibold leading-[1.08] text-foreground">
          {copy.title}
        </h2>
        <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-muted-foreground sm:text-[15px]">
          {copy.lead}
        </p>
        <span className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-[14px] font-medium text-ink-foreground transition-opacity group-hover:opacity-90">
          {startLabel}
          <ArrowRight className="size-4" />
        </span>
      </div>
    </div>
  );

  if (item.href) {
    return (
      <Link
        href={item.href}
        className="group mt-10 block overflow-hidden rounded-[28px] border border-border bg-card sm:mt-14 sm:rounded-[36px]"
      >
        {inner}
      </Link>
    );
  }

  return (
    <article className="mt-10 overflow-hidden rounded-[28px] border border-border bg-card sm:mt-14 sm:rounded-[36px]">
      {inner}
    </article>
  );
}

function UpcomingQuizCard({
  item,
  copy,
  soonLabel,
}: {
  item: QuizCardModel;
  copy: QuizCopy;
  soonLabel: string;
}) {
  return (
    <article className="relative overflow-hidden rounded-[24px] sm:rounded-[28px]">
      <div className="relative aspect-[16/11]">
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/15" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <span className="inline-flex rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-white/80 backdrop-blur-md">
          {soonLabel}
        </span>
        <h2 className="mt-3 font-display text-[1.35rem] font-semibold leading-tight text-white sm:text-[1.6rem]">
          {copy.title}
        </h2>
        <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-white/65 sm:text-[14px]">
          {copy.lead}
        </p>
      </div>
    </article>
  );
}
