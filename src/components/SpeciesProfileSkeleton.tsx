import type { CSSProperties } from "react";

import { cn } from "@/lib/cn";
import { SPECIES_SECTION_IDS } from "@/lib/toc";

const PULSE = "animate-pulse motion-reduce:animate-none";
const DARK = "bg-white/12";
const LIGHT = "bg-border";
const CARD_SHADOW =
  "shadow-[0_1px_2px_rgba(14,20,17,0.04)] lg:shadow-[0_16px_40px_rgba(14,20,17,0.06)]";

type Widths = readonly number[];

const LEDE = [276, 325, 263, 264, 227];
const DESCRIPTION = [498, 481, 459];
const VERDICT_TITLE = { desktop: [368], mobile: [243, 56] };
const VERDICT_BODY = { desktop: [325, 362, 336], mobile: [302, 277, 240, 198] };
const NAV_ITEMS = [
  { id: SPECIES_SECTION_IDS.overview, width: 105 },
  { id: SPECIES_SECTION_IDS.identification, width: 103 },
  { id: SPECIES_SECTION_IDS.range, width: 110 },
  { id: SPECIES_SECTION_IDS.biology, width: 103 },
  { id: SPECIES_SECTION_IDS.gallery, width: 100 },
  { id: SPECIES_SECTION_IDS.faq, width: 111 },
  { id: SPECIES_SECTION_IDS.sources, width: 96 },
];
const OVERVIEW_TITLE = { desktop: [516, 24], mobile: [105, 244] };
const OVERVIEW_BODY = {
  desktop: [591, 551, 654, 667, 628, 629, 672, 653, 416],
  mobile: [
    244, 309, 303, 211, 285, 237, 256, 270, 292, 303, 265, 309, 266, 317, 279,
    288, 314, 304, 49,
  ],
};

export function SpeciesProfileSkeleton({ label }: { label: string }) {
  return (
    <div aria-busy="true" className="bg-background" role="status">
      <span className="sr-only">{label}</span>
      <div aria-hidden="true">
        <SkeletonHero />
        <SkeletonSummary />
        <SkeletonSectionNav />
        <SkeletonOverview />
      </div>
    </div>
  );
}

function Bar({ className }: { className: string }) {
  return <span className={cn("block", PULSE, className)} />;
}

function Lines({
  bar,
  className,
  desktop,
  mobile,
}: {
  bar: string;
  className?: string;
  desktop?: Widths;
  mobile?: Widths;
}) {
  const count = Math.max(mobile?.length ?? 0, desktop?.length ?? 0);
  return (
    <span className={cn("block", className)}>
      {Array.from({ length: count }, (_, index) => {
        const onMobile = mobile?.[index];
        const onDesktop = desktop?.[index];
        const style = {
          "--line-d": `${onDesktop ?? 0}px`,
          "--line-m": `${onMobile ?? 0}px`,
        } as CSSProperties;
        return (
          <span
            className={cn(
              "relative block w-(--line-m) max-w-full lg:w-(--line-d)",
              onMobile === undefined && "max-lg:hidden",
              onDesktop === undefined && "lg:hidden",
            )}
            key={index}
            style={style}
          >
            <span className="invisible">ა</span>
            <span
              className={cn(
                "absolute inset-x-0 top-1/2 block h-[0.62em] -translate-y-1/2 rounded-full",
                PULSE,
                bar,
              )}
            />
          </span>
        );
      })}
    </span>
  );
}

function SkeletonFacts() {
  return (
    <div className="min-w-0">
      <div className="flex h-[62px] items-center justify-between gap-3 px-6 pt-7 pb-3 lg:hidden">
        <Lines
          bar={LIGHT}
          className="min-w-0 text-[11px] font-medium tracking-[0.18em] uppercase"
          mobile={[125]}
        />
        <Lines
          bar={LIGHT}
          className="text-[12px] leading-normal"
          mobile={[102]}
        />
      </div>
      <div className="grid grid-cols-2 gap-2 px-4 lg:h-full lg:grid-cols-4 lg:gap-4 lg:px-0">
        <SkeletonTile
          className="col-span-2"
          label={40}
          value={{ desktop: [203], mobile: [171] }}
          visual="range"
        />
        <SkeletonTile
          label={56}
          value={{ desktop: [67, 93, 88], mobile: [56, 78, 74] }}
        />
        <SkeletonTile label={33} value={{ desktop: [131], mobile: [111] }} />
        <SkeletonTile
          label={77}
          value={{ desktop: [143], mobile: [121] }}
          visual="iucn"
        />
        <SkeletonTile
          label={92}
          value={{ desktop: [88], mobile: [74] }}
          visual="range"
        />
        <SkeletonTile
          className="col-span-2 lg:col-span-2"
          label={36}
          value={{ desktop: [85], mobile: [72] }}
        />
      </div>
    </div>
  );
}

function SkeletonHero() {
  return (
    <section className="relative h-[440px] w-full overflow-hidden bg-ink lg:h-[660px]">
      <Bar className="absolute inset-0 bg-white/5 lg:left-auto lg:w-[62%]" />
      <div className="absolute inset-x-0 top-0 h-[150px] bg-linear-to-b from-ink/80 to-transparent lg:h-[190px]" />
      <div className="absolute inset-x-0 bottom-0 h-[260px] bg-linear-to-t from-ink via-ink/70 to-transparent lg:h-[240px] lg:from-ink/95 lg:via-ink/40" />
      <div className="absolute inset-y-0 left-[38%] hidden w-[30%] bg-linear-to-r from-ink via-ink/85 to-transparent lg:block" />

      <div className="absolute inset-x-6 top-[74px] z-20 flex gap-1 lg:hidden">
        {Array.from({ length: 8 }, (_, index) => (
          <span
            className={cn(
              "h-[3px] flex-1 rounded-full",
              index === 0 ? "bg-white/70" : "bg-white/25",
            )}
            key={index}
          />
        ))}
      </div>
      <div className="absolute inset-x-6 top-[88px] z-10 flex items-center justify-between lg:hidden">
        <Bar className="h-11 w-[95px] rounded-full bg-ink/50" />
        <Bar className="h-11 w-14 rounded-full bg-ink/50" />
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col justify-end px-6 pb-[62px] lg:justify-center lg:px-[60px] lg:pt-12 lg:pb-[110px]">
        <div className="mt-auto lg:max-w-[600px]">
          <Bar className="h-[30px] w-[125px] rounded-full bg-white/15 lg:h-8 lg:w-[129px]" />
          <Lines
            bar={DARK}
            className="mt-2 font-display text-[50px] leading-[1.04] font-bold lg:mt-3.5 lg:text-[92px] lg:leading-none"
            desktop={[327]}
            mobile={[178]}
          />
          <span className="mt-1 flex min-h-11 items-center gap-2 font-display text-[16px] lg:mt-2 lg:text-[20px]">
            <Lines bar={DARK} desktop={[197]} mobile={[158]} />
            <Bar className={cn("size-5 rounded-md", DARK)} />
          </span>
          <Lines
            bar={DARK}
            className="mt-3 hidden max-w-[520px] text-[17px] leading-[1.6] lg:block"
            desktop={DESCRIPTION}
          />
          <div className="mt-1 flex flex-wrap items-center gap-2 lg:mt-6 lg:gap-2.5">
            <Bar className="hidden h-[52px] w-[178px] rounded-full bg-white/15 lg:block" />
            <span className="flex-1 lg:hidden" />
            <Bar className="size-[46px] rounded-full bg-white/10 lg:size-[52px]" />
            <Bar className="size-[46px] rounded-full bg-white/10 lg:size-[52px]" />
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-[118px] z-10 hidden lg:block">
        <div className="mx-auto flex max-w-[1440px] items-center justify-end gap-2 px-[60px]">
          <Bar className="mr-1 hidden h-7 w-[190px] rounded-full bg-ink/65 xl:block" />
          {Array.from({ length: 5 }, (_, index) => (
            <Bar
              className={cn(
                "h-14 w-[76px] rounded-[14px] bg-white/10",
                index === 0 && "ring-2 ring-white/40",
              )}
              key={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function SkeletonOverview() {
  return (
    <section className="bg-surface py-11 lg:py-20">
      <div className="mx-auto grid max-w-[1400px] px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24 lg:px-10">
        <div>
          <Lines
            bar={LIGHT}
            className="text-[11px] font-medium tracking-[0.18em] uppercase"
            desktop={[63]}
            mobile={[63]}
          />
          <Lines
            bar={LIGHT}
            className="mt-5 max-w-2xl font-display text-display-title leading-[1.14] font-bold"
            desktop={OVERVIEW_TITLE.desktop}
            mobile={OVERVIEW_TITLE.mobile}
          />
        </div>
        <div className="lg:pt-9">
          <Lines
            bar={LIGHT}
            className="mt-8 max-w-2xl text-[17px] leading-relaxed sm:text-[18px] lg:mt-0"
            desktop={OVERVIEW_BODY.desktop}
            mobile={OVERVIEW_BODY.mobile}
          />
        </div>
      </div>
    </section>
  );
}

function SkeletonSectionNav() {
  return (
    <div className="border-y border-border bg-surface/95 lg:bg-background/92">
      <div className="mx-auto flex h-[60px] max-w-[1440px] items-center lg:h-[68px] lg:px-[60px]">
        <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden px-6 lg:px-0">
          {NAV_ITEMS.map(({ id, width }) => (
            <span
              className="flex h-10 shrink-0 items-center justify-center"
              key={id}
              style={{ width }}
            >
              <Bar className={cn("h-3 w-[70%] rounded-full", LIGHT)} />
            </span>
          ))}
        </div>
        <Bar
          className={cn(
            "ml-6 hidden h-3 w-[150px] shrink-0 rounded-full lg:block",
            LIGHT,
          )}
        />
      </div>
    </div>
  );
}

function SkeletonSummary() {
  return (
    <div className="relative z-10 -mt-7 rounded-t-[32px] bg-background pt-4 pb-6 lg:mt-[-86px] lg:rounded-none lg:bg-transparent lg:pt-0 lg:pb-14">
      <div className="mx-auto flex max-w-[1440px] flex-col lg:grid lg:grid-cols-[430px_minmax(0,1fr)] lg:items-stretch lg:gap-4 lg:px-[60px]">
        <div className="contents min-w-0 flex-col lg:flex">
          <div className="flex min-h-6 flex-wrap items-center gap-x-2 px-6 text-[12px] lg:hidden">
            <span className="flex min-w-0 flex-[1_1_auto] items-center gap-2 py-1 leading-snug">
              <Bar className={cn("size-3.5 shrink-0 rounded", LIGHT)} />
              <Lines bar={LIGHT} mobile={[245, 68]} />
            </span>
            <span className="inline-flex shrink-0 items-center gap-1">
              <Bar className={cn("size-3.5 rounded", LIGHT)} />
              <Lines bar={LIGHT} mobile={[117]} />
            </span>
          </div>
          <SkeletonVerdict />
        </div>
        <Lines
          bar={LIGHT}
          className="mt-3 px-6 text-[16px] leading-[1.6] lg:hidden"
          mobile={LEDE}
        />
        <SkeletonFacts />
      </div>
    </div>
  );
}

function SkeletonTile({
  className,
  label,
  value,
  visual,
}: {
  className?: string;
  label: number;
  value: { desktop: Widths; mobile: Widths };
  visual?: "iucn" | "range";
}) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-[22px] bg-card px-4 pt-[15px] pb-4 lg:rounded-[26px] lg:px-[22px] lg:py-5",
        CARD_SHADOW,
        className,
      )}
    >
      <Lines
        bar={LIGHT}
        className="text-[11px] leading-relaxed font-medium tracking-[0.14em]"
        desktop={[label]}
        mobile={[label]}
      />
      <div className="mt-[7px] font-display text-[16px] leading-[1.3] font-semibold lg:mt-2 lg:text-[19px]">
        <Lines bar={LIGHT} desktop={value.desktop} mobile={value.mobile} />
        {visual === "range" ? (
          <span className="mt-3 block lg:mt-3.5">
            <Bar className="h-1.5 rounded-full bg-border lg:h-2" />
            <span className="mt-1.5 flex justify-between font-sans text-[10.5px] font-normal">
              <Lines bar={LIGHT} desktop={[8]} mobile={[8]} />
              <Lines bar={LIGHT} desktop={[36]} mobile={[36]} />
            </span>
          </span>
        ) : null}
        {visual === "iucn" ? (
          <span className="mt-2.5 flex gap-[3px] lg:mt-3">
            {Array.from({ length: 5 }, (_, index) => (
              <Bar
                className="h-[22px] flex-1 rounded-[7px] bg-border lg:h-[26px]"
                key={index}
              />
            ))}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function SkeletonVerdict() {
  return (
    <section className="mx-4 mt-3 flex flex-1 flex-col overflow-hidden rounded-[28px] bg-card shadow-[0_14px_36px_rgba(14,20,17,0.06)] max-lg:order-2 lg:mx-0 lg:mt-0 lg:rounded-[32px] lg:shadow-[0_16px_40px_rgba(14,20,17,0.08)]">
      <div className="bg-border/35 px-5 pt-[18px] pb-4 lg:px-7 lg:pt-6 lg:pb-5">
        <div className="flex items-center justify-between gap-3">
          <Lines
            bar={LIGHT}
            className="text-[11px] font-medium tracking-[0.18em] uppercase"
            desktop={[126]}
            mobile={[126]}
          />
          <span className="flex min-h-7 items-center">
            <Lines
              bar={LIGHT}
              className="text-[12.5px] font-semibold"
              desktop={[104]}
              mobile={[104]}
            />
          </span>
        </div>
        <Lines
          bar={LIGHT}
          className="mt-2 font-display text-[20px] leading-[1.3] font-semibold lg:mt-3 lg:text-[24px]"
          desktop={VERDICT_TITLE.desktop}
          mobile={VERDICT_TITLE.mobile}
        />
      </div>
      <div className="flex flex-1 flex-col px-5 pt-4 pb-2 lg:px-7 lg:pt-5 lg:pb-3">
        <Lines
          bar={LIGHT}
          className="text-[16px] leading-[1.6] lg:leading-[1.65]"
          desktop={VERDICT_BODY.desktop}
          mobile={VERDICT_BODY.mobile}
        />
        <Bar className="mt-3 h-10 w-[155px] self-start rounded-full bg-border/60 lg:hidden" />
        <div className="mt-2.5 flex flex-wrap items-center gap-x-5 border-t border-border lg:mt-auto lg:gap-x-6">
          <span className="flex min-h-12 items-center gap-1.5 text-[14px]">
            <Lines bar={LIGHT} desktop={[104]} mobile={[104]} />
            <Bar className={cn("size-4 rounded", LIGHT)} />
          </span>
          <span className="flex min-h-12 items-center gap-1.5 text-[14px]">
            <Lines bar={LIGHT} desktop={[88]} mobile={[88]} />
            <Bar className={cn("size-4 rounded", LIGHT)} />
          </span>
        </div>
      </div>
    </section>
  );
}
