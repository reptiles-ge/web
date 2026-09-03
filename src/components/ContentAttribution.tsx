"use client";

import { Logo } from "@/components/Logo";
import { Link } from "@/i18n/navigation";
import { siteEntityId } from "@/lib/site";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

type ContentAttributionProps = {
  sourcesHref?: string;
  showMethodology?: boolean;
};

export function ContentAttribution({
  sourcesHref,
  showMethodology = true,
}: ContentAttributionProps) {
  const t = useTranslations("attribution");
  const headingId = "content-attribution-heading";
  const showSources = Boolean(sourcesHref);
  const showLinks = showSources || showMethodology;

  return (
    <section className="border-t border-border bg-background py-10 lg:py-12">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <aside
          aria-labelledby={headingId}
          itemScope
          itemType="https://schema.org/Organization"
          itemID={siteEntityId("organization")}
          className="max-w-xl rounded-[20px] border border-border/90 bg-card p-5 sm:p-6"
        >
          <div className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-4 gap-y-3.5">
            <Link
              href="/about"
              rel="author"
              className="group col-span-2 grid grid-cols-[2.75rem_minmax(0,1fr)] items-start gap-x-4"
            >
              <span
                aria-hidden="true"
                className="mt-0.5 flex size-11 items-center justify-center rounded-2xl border border-border bg-background"
              >
                <Logo size={26} />
              </span>
              <span className="min-w-0">
                <span
                  id={headingId}
                  itemProp="name"
                  className="block font-display text-[16px] leading-none font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-[17px]"
                >
                  {t("heading")}
                </span>
                <span
                  itemProp="alternateName"
                  className="mt-2 block text-[12px] leading-snug text-muted-foreground sm:text-[13px]"
                >
                  {t("subtitle")}
                </span>
              </span>
            </Link>
            <p
              itemProp="description"
              className="col-span-2 text-[13px] leading-relaxed text-muted-foreground sm:col-span-1 sm:col-start-2 sm:text-[14px]"
            >
              {t("body")}
            </p>
            {showLinks ? (
              <p className="col-span-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] font-medium sm:col-span-1 sm:col-start-2">
                {showSources && sourcesHref ? (
                  <a
                    href={sourcesHref}
                    className="text-foreground/80 transition-colors hover:text-primary"
                  >
                    {t("sources")}
                  </a>
                ) : null}
                {showMethodology ? (
                  <Link
                    href={{ pathname: "/about", hash: "methodology" }}
                    className="inline-flex items-center gap-1 text-foreground/80 transition-colors hover:text-primary"
                  >
                    {t("methodology")}
                    <ArrowRight className="size-3.5" strokeWidth={1.75} />
                  </Link>
                ) : null}
              </p>
            ) : null}
          </div>
        </aside>
      </div>
    </section>
  );
}
