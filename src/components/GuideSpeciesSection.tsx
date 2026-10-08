"use client";

import type { ComponentProps, ReactNode } from "react";

import { ArrowUpRight } from "lucide-react";
import { useLocale } from "next-intl";

import type { SpeciesCard } from "@/data/speciesCard";
import type { AppLocale } from "@/i18n/routing";

import { SpeciesGuideList } from "@/components/SpeciesGuideRow";
import { Link } from "@/i18n/navigation";

type GuideSpeciesSectionProps = {
  children: ReactNode;
  links: readonly {
    href: ComponentProps<typeof Link>["href"];
    id: string;
    label: string;
  }[];
  species: SpeciesCard[];
};

export function GuideSpeciesSection({
  children,
  links,
  species,
}: GuideSpeciesSectionProps) {
  const locale = useLocale() as AppLocale;

  return (
    <section className="border-t border-border bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        {children}
        <SpeciesGuideList locale={locale} source="guide" species={species} />
        <div className="mt-10 flex flex-wrap gap-3">
          {links.map((link) => (
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-[14px] font-medium text-foreground"
              href={link.href}
              key={link.id}
            >
              {link.label}
              <ArrowUpRight className="size-4" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
