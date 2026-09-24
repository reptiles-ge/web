import { ChevronDown } from "lucide-react";

import type { AppLocale } from "@/i18n/routing";

import { PhoneLinkedText } from "@/components/PhoneLinkedText";

type GuideSource = {
  name: string;
  supports: Record<AppLocale, string>;
  url: string;
};

export function GuideSources({
  heading,
  locale,
  sources,
}: {
  heading: string;
  locale: AppLocale;
  sources: readonly GuideSource[];
}) {
  return (
    <section className="mt-16 border-t border-border pt-10">
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-1 text-left marker:content-none [&::-webkit-details-marker]:hidden">
          <h2
            className="font-display text-display-card font-semibold text-foreground"
            id="sources"
          >
            {heading}
          </h2>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-transform duration-300 group-open:rotate-180 group-open:border-foreground/20 group-open:text-foreground">
            <ChevronDown
              aria-hidden="true"
              className="size-4"
              strokeWidth={1.75}
            />
          </span>
        </summary>
        <ul className="mt-8 border-t border-border">
          {sources.map((source) => (
            <li
              className="border-b border-border py-4 text-[15px] leading-relaxed"
              key={source.url}
            >
              <a
                className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
                href={source.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                {source.name}
              </a>
              <p className="mt-1 text-muted-foreground">
                <PhoneLinkedText>{source.supports[locale]}</PhoneLinkedText>
              </p>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
