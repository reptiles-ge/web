import type { NewsMonthItem } from "@/lib/newsMonthGroups";

const wrapClass =
  "mx-auto box-content max-w-[1320px] px-5 md:px-10 lg:px-[60px]";

export function NewsMonthSection({
  countLabel,
  heading,
  items,
}: {
  countLabel: string;
  heading: string;
  items: readonly NewsMonthItem[];
}) {
  return (
    <section aria-label={heading} className={`${wrapClass} pt-8 md:pt-14`}>
      <div className="flex items-baseline justify-between gap-4 pb-1.5 md:justify-start md:pb-[22px]">
        <h2 className="text-[21px] font-semibold tracking-[-0.01em] text-(--nw-ink) md:text-[30px] md:leading-[1.1] md:tracking-[-0.015em]">
          {heading}
        </h2>
        <span className="text-[12.5px] text-(--nw-muted) tabular-nums md:text-[13px]">
          {items.length} {countLabel}
        </span>
        <span
          aria-hidden="true"
          className="hidden h-px flex-1 -translate-y-1.5 bg-(--nw-rule) md:block"
        />
      </div>
      <ul className="md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.id}>{item.card}</li>
        ))}
      </ul>
    </section>
  );
}
