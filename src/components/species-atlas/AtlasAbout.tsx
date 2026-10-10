import { BookOpen, Camera, Info, ListChecks } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { type ComponentProps, type ReactNode } from "react";

import type { AtlasStats } from "@/data/speciesAtlas";
import type { AppLocale } from "@/i18n/routing";

import { Link } from "@/i18n/navigation";
import { formatContentDate } from "@/lib/formatDate";

type AtlasAboutProps = {
  locale: AppLocale;
  stats: AtlasStats;
};

export async function AtlasAbout({ locale, stats }: AtlasAboutProps) {
  const t = await getTranslations({ locale, namespace: "speciesAtlas" });

  return (
    <section className="bg-background py-10 lg:pt-[88px] lg:pb-24">
      <div className="mx-auto max-w-[1440px] px-5 lg:px-[60px]">
        <div className="lg:flex lg:items-end lg:justify-between lg:gap-12">
          <div className="lg:max-w-[720px]">
            <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
              {t("aboutEyebrow")}
            </p>
            <h2 className="mt-2.5 font-display text-[28px] leading-[1.15] font-semibold tracking-[-0.012em] text-foreground lg:mt-3.5 lg:text-[40px] lg:leading-[1.1]">
              {t("aboutTitle")}
            </h2>
            <p className="mt-3.5 text-[15px] leading-[1.6] text-muted-foreground lg:text-[16px] lg:leading-[1.65]">
              {t("aboutLead")}
            </p>
          </div>
          {stats.lastUpdated ? (
            <p className="mt-4 inline-flex min-h-9 items-center gap-2 rounded-full bg-card px-3.5 py-1.5 text-[13px] text-foreground/80 lg:mt-0 lg:shrink-0">
              <span
                aria-hidden="true"
                className="size-[7px] shrink-0 rounded-full bg-[#6fad88]"
              />
              {t("lastUpdated", {
                date: formatContentDate(stats.lastUpdated, locale),
              })}
            </p>
          ) : null}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:mt-8 lg:grid-cols-4 lg:gap-4">
          <TrustCard
            body={t("methodBody")}
            icon={<ListChecks aria-hidden="true" className="size-[18px]" />}
            title={t("methodTitle")}
          />
          <TrustCard
            body={t("sourcesBody")}
            icon={<BookOpen aria-hidden="true" className="size-[18px]" />}
            title={t("sourcesTitle")}
          />
          <TrustCard
            body={t("photosBody")}
            href="/authors"
            icon={<Camera aria-hidden="true" className="size-[18px]" />}
            linkLabel={t("photosLink")}
            title={t("photosTitle")}
          />
          <TrustCard
            body={t("contributorsBody")}
            href="/about"
            icon={<Info aria-hidden="true" className="size-[18px]" />}
            linkLabel={t("contributorsLink")}
            title={t("contributorsTitle")}
          />
        </div>
      </div>
    </section>
  );
}

function TrustCard({
  body,
  href,
  icon,
  linkLabel,
  title,
}: {
  body: string;
  href?: ComponentProps<typeof Link>["href"];
  icon: ReactNode;
  linkLabel?: string;
  title: string;
}) {
  return (
    <div className="rounded-3xl bg-card p-5 shadow-[0_1px_2px_rgba(14,20,17,0.04),0_16px_40px_rgba(14,20,17,0.06)] lg:rounded-[26px] lg:p-6">
      <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary">
        {icon}
      </span>
      <h3 className="mt-4 font-display text-[18px] font-semibold text-foreground">
        {title}
      </h3>
      <p className="mt-2 text-[14px] leading-[1.65] text-muted-foreground">
        {body}
      </p>
      {href && linkLabel ? (
        <Link
          className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-[13.5px] font-semibold text-primary hover:underline"
          href={href}
        >
          {linkLabel} →
        </Link>
      ) : null}
    </div>
  );
}
