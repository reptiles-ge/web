import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Logo } from "@/components/Logo";
import { Link } from "@/i18n/navigation";
import { siteEntityId } from "@/lib/site";

type ContentAttributionProps = {
  showMethodology?: boolean;
  sourcesHref?: string;
};

export async function ContentAttribution({
  showMethodology = true,
  sourcesHref,
}: ContentAttributionProps) {
  const t = await getTranslations("attribution");
  const headingId = "content-attribution-heading";
  const showSources = Boolean(sourcesHref);
  const showLinks = showSources || showMethodology;

  return (
    <section className="border-t border-border bg-background py-10 lg:py-12">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <aside
          aria-labelledby={headingId}
          className="max-w-xl rounded-[20px] border border-border/90 bg-card p-5 sm:p-6"
          itemID={siteEntityId("organization")}
          itemScope
          itemType="https://schema.org/Organization"
        >
          <div className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-4 gap-y-3.5">
            <Link
              className="group col-span-2 grid grid-cols-[2.75rem_minmax(0,1fr)] items-start gap-x-4"
              href="/about"
              rel="author"
            >
              <span
                aria-hidden="true"
                className="mt-0.5 flex size-11 items-center justify-center rounded-2xl border border-border bg-background"
              >
                <Logo size={26} />
              </span>
              <span className="min-w-0">
                <span
                  className="block font-display text-[16px] leading-none font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-[17px]"
                  id={headingId}
                  itemProp="name"
                >
                  {t("heading")}
                </span>
                <span
                  className="mt-2 block text-[12px] leading-snug text-muted-foreground sm:text-[13px]"
                  itemProp="alternateName"
                >
                  {t("subtitle")}
                </span>
              </span>
            </Link>
            <p
              className="col-span-2 text-[13px] leading-relaxed text-muted-foreground sm:col-span-1 sm:col-start-2 sm:text-[14px]"
              itemProp="description"
            >
              {t("body")}
            </p>
            {showLinks ? (
              <p className="col-span-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] font-medium sm:col-span-1 sm:col-start-2">
                {showSources && sourcesHref ? (
                  <a
                    className="text-foreground/80 transition-colors hover:text-primary"
                    href={sourcesHref}
                  >
                    {t("sources")}
                  </a>
                ) : null}
                {showMethodology ? (
                  <Link
                    className="inline-flex items-center gap-1 text-foreground/80 transition-colors hover:text-primary"
                    href={{ hash: "methodology", pathname: "/about" }}
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
