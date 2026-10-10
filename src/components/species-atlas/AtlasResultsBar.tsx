"use client";

import { ArrowDownWideNarrow, X } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  ATLAS_SORT_OPTIONS,
  type AtlasFilters,
  type AtlasSort,
} from "@/data/atlasFilters";
import { Link } from "@/i18n/navigation";

export type AtlasFilterToken = {
  clear: () => void;
  key: string;
  label: string;
};

type AtlasResultsBarProps = {
  count: number;
  hasActiveFilters: boolean;
  onChangeSort: (sort: AtlasSort) => void;
  onResetFilters: () => void;
  sort: AtlasSort;
  tokens: AtlasFilterToken[];
};

export function AtlasEmptyPanel({
  group,
  onReset,
}: {
  group: AtlasFilters["group"];
  onReset: () => void;
}) {
  const t = useTranslations("speciesAtlas");

  return (
    <div className="mt-3.5 rounded-3xl bg-card px-5 py-9 text-center lg:mt-[18px] lg:rounded-[32px] lg:px-8 lg:py-14 lg:shadow-[0_1px_2px_rgba(14,20,17,0.04),0_16px_40px_rgba(14,20,17,0.06)]">
      <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
        {t("emptyEyebrow")}
      </p>
      <h3 className="mx-auto mt-2.5 max-w-[560px] font-display text-[20px] leading-tight font-semibold text-foreground lg:mt-3.5 lg:text-[28px]">
        {group === "all"
          ? t("emptyTitle")
          : t("emptyGroupTitle", { group: t(`groups.${group}`) })}
      </h3>
      <p className="mx-auto mt-2 max-w-[480px] text-[14px] leading-relaxed text-muted-foreground lg:mt-3 lg:text-[15px]">
        {t("emptyBody")}
      </p>
      <div className="mt-[18px] flex flex-col justify-center gap-2.5 sm:flex-row lg:mt-6">
        <button
          className="h-[50px] rounded-full bg-primary px-[22px] text-[15px] font-medium text-white lg:h-12 lg:text-[14.5px] dark:text-ink"
          onClick={onReset}
          type="button"
        >
          {t("resetFilters")}
        </button>
        <Link
          className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-[22px] text-[14.5px] font-medium text-foreground transition-colors hover:border-primary/30"
          href="/contact"
        >
          {t("suggestSpecies")}
        </Link>
      </div>
    </div>
  );
}

export function AtlasResultsBar({
  count,
  hasActiveFilters,
  onChangeSort,
  onResetFilters,
  sort,
  tokens,
}: AtlasResultsBarProps) {
  const t = useTranslations("speciesAtlas");
  const sortIndex = ATLAS_SORT_OPTIONS.indexOf(sort);

  return (
    <>
      <div className="mt-3.5 flex min-h-9 items-center justify-between gap-2.5 px-5 lg:mt-[22px] lg:gap-4 lg:px-0">
        <div className="flex flex-wrap items-center gap-2">
          <p
            aria-live="polite"
            className="text-[14.5px] text-foreground/80 lg:mr-2 lg:ml-1 lg:text-[15px]"
          >
            <ResultCount count={count} />
          </p>
          <div className="hidden flex-wrap items-center gap-2 lg:flex">
            {tokens.map((token) => (
              <TokenButton key={token.key} token={token} />
            ))}
          </div>
        </div>
        {hasActiveFilters ? (
          <button
            className="hidden px-1 py-2 text-[14px] font-medium text-primary lg:block"
            onClick={onResetFilters}
            type="button"
          >
            {t("resetFilters")}
          </button>
        ) : null}
        <button
          aria-label={`${t("sortLabel")}: ${t(`sort.${sort}`)}`}
          className="inline-flex h-11 items-center gap-1.5 rounded-full bg-card px-3.5 text-[13px] font-medium text-foreground lg:hidden"
          onClick={() =>
            onChangeSort(
              ATLAS_SORT_OPTIONS[(sortIndex + 1) % ATLAS_SORT_OPTIONS.length] ??
                "featured",
            )
          }
          type="button"
        >
          <ArrowDownWideNarrow
            aria-hidden="true"
            className="size-3.5 text-muted-foreground"
          />
          {t(`sort.${sort}`)}
        </button>
      </div>

      {tokens.length > 0 ? (
        <div className="no-scrollbar mt-1 flex gap-1.5 overflow-x-auto px-5 py-1.5 lg:hidden">
          {tokens.map((token) => (
            <TokenButton key={token.key} token={token} />
          ))}
          <button
            className="tap-target h-[34px] shrink-0 px-2.5 text-[13px] font-medium text-primary"
            onClick={onResetFilters}
            type="button"
          >
            {t("filterClear")}
          </button>
        </div>
      ) : null}
    </>
  );
}

function ResultCount({ count }: { count: number }) {
  const t = useTranslations("speciesAtlas");
  return (
    <>
      {t.rich("resultsCount", {
        count,
        strong: (chunks) => (
          <strong className="font-bold text-foreground">{chunks}</strong>
        ),
      })}
    </>
  );
}

function TokenButton({ token }: { token: AtlasFilterToken }) {
  const t = useTranslations("speciesAtlas");
  return (
    <button
      aria-label={t("removeFilter", { label: token.label })}
      className="tap-target inline-flex h-[34px] shrink-0 items-center gap-1.5 rounded-full bg-foreground pr-1.5 pl-3 text-[13px] font-medium whitespace-nowrap text-background lg:h-8 lg:pr-2 lg:text-[12.5px]"
      onClick={token.clear}
      type="button"
    >
      {token.label}
      <span className="flex size-6 items-center justify-center rounded-full bg-background/15 lg:size-5">
        <X aria-hidden="true" className="size-[11px]" />
      </span>
    </button>
  );
}
