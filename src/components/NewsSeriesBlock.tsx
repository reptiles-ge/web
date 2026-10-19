export type NewsSeriesItem = {
  current: boolean;
  dateLabel: string;
  href: string;
  id: string;
  publishedAt: string;
  title: string;
};

type NewsSeriesBlockProps = {
  currentLabel: string;
  eyebrow: string;
  items: readonly NewsSeriesItem[];
  name: string;
};

export function NewsSeriesBlock({
  currentLabel,
  eyebrow,
  items,
  name,
}: NewsSeriesBlockProps) {
  if (items.length < 2) return null;

  return (
    <nav
      aria-labelledby="news-series-heading"
      className="mt-10 rounded-[24px] bg-(--nw-card) px-[18px] pt-5 pb-2 md:mt-12 md:px-[22px]"
    >
      <p className="text-[10.5px] font-semibold tracking-[0.16em] text-(--nw-muted) uppercase md:text-[11px]">
        {eyebrow}
      </p>
      <h2
        className="mt-2 text-[20px] leading-tight font-semibold md:text-[22px]"
        id="news-series-heading"
      >
        {name}
      </h2>
      <ol className="mt-2">
        {items.map((item, index) => (
          <li
            className="border-t border-(--nw-line-soft) first:border-t-0"
            key={item.id}
          >
            <NewsSeriesEntry
              currentLabel={currentLabel}
              item={item}
              position={index + 1}
            />
          </li>
        ))}
      </ol>
    </nav>
  );
}

function NewsSeriesEntry({
  currentLabel,
  item,
  position,
}: {
  currentLabel: string;
  item: NewsSeriesItem;
  position: number;
}) {
  const body = (
    <>
      <span
        className={`text-[12.5px] font-bold tabular-nums ${item.current ? "text-(--nw-accent)" : "text-(--nw-sep)"}`}
      >
        {String(position).padStart(2, "0")}
      </span>
      <span className="flex min-w-0 flex-col gap-1">
        <span className="text-[12.5px] text-(--nw-muted)">
          <time dateTime={item.publishedAt}>{item.dateLabel}</time>
          {item.current ? (
            <>
              {" · "}
              <b className="font-semibold text-(--nw-accent)">{currentLabel}</b>
            </>
          ) : null}
        </span>
        <span
          className={`text-[15px] leading-[1.4] font-semibold md:text-[16px] ${item.current ? "" : "transition-colors group-hover:text-(--nw-accent)"}`}
        >
          {item.title}
        </span>
      </span>
    </>
  );
  const rowClass = "grid grid-cols-[28px_minmax(0,1fr)] gap-3 py-3.5";

  return item.current ? (
    <span aria-current="page" className={rowClass}>
      {body}
    </span>
  ) : (
    <a
      className={`group ${rowClass} focus-visible:ring-2 focus-visible:ring-(--nw-accent) focus-visible:ring-offset-4 focus-visible:ring-offset-background focus-visible:outline-none`}
      href={item.href}
    >
      {body}
    </a>
  );
}
