import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import type { AppLocale } from "@/i18n/routing";

import { getAtlasStats } from "@/data/speciesAtlas";
import { Link } from "@/i18n/navigation";
import { formatContentDate } from "@/lib/formatDate";

type AtlasAboutProps = {
  locale: AppLocale;
  stats: ReturnType<typeof getAtlasStats>;
};

export async function AtlasAbout({ locale, stats }: AtlasAboutProps) {
  const t = await getTranslations("speciesAtlas");

  return (
    <section className="border-t border-border bg-surface/60 py-20 lg:py-28">
      <div className="mx-auto max-w-350 px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="text-[11px] font-medium tracking-[0.32em] text-muted-foreground uppercase">
              {t("aboutEyebrow")}
            </p>
            <h2 className="mt-4 font-display text-display-title font-semibold">
              {t("aboutTitle")}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              {t("aboutLead")}
            </p>
            {stats.lastUpdated ? (
              <p className="mt-6 text-[13px] text-muted-foreground">
                {t("lastUpdated", {
                  date: formatContentDate(stats.lastUpdated, locale),
                })}
              </p>
            ) : null}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <TrustCard body={t("methodBody")} title={t("methodTitle")} />
            <TrustCard body={t("sourcesBody")} title={t("sourcesTitle")} />
            <TrustCard body={t("photosBody")} title={t("photosTitle")} />
            <TrustCard
              body={t("contributorsBody")}
              href="/about"
              linkLabel={t("contributorsLink")}
              title={t("contributorsTitle")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustCard({
  body,
  href,
  linkLabel,
  title,
}: {
  body: string;
  href?: "/about";
  linkLabel?: string;
  title: string;
}) {
  return (
    <div className="rounded-card border border-border/80 bg-card px-5 py-6 sm:px-6">
      <h3 className="font-display text-[1.15rem] font-semibold text-foreground">
        {title}
      </h3>
      <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
        {body}
      </p>
      {href && linkLabel ? (
        <Link
          className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-primary transition-opacity hover:opacity-80"
          href={href}
        >
          {linkLabel}
          <ArrowUpRight className="size-3.5" />
        </Link>
      ) : null}
    </div>
  );
}
