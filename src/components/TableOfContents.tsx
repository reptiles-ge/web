import type { TocItem } from "@/lib/toc";

type TableOfContentsProps = {
  items: TocItem[];
  label: string;
  className?: string;
};

export function TableOfContents({
  items,
  label,
  className,
}: TableOfContentsProps) {
  if (items.length < 2) return null;

  return (
    <nav
      aria-label={label}
      className={className ?? "border-b border-border bg-background"}
    >
      <div className="mx-auto max-w-[1400px] px-6 py-6 lg:px-10 lg:py-7">
        <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
          {label}
        </p>
        <ol className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`text-[14px] text-foreground/75 transition-colors hover:text-primary ${
                  item.level === 3 ? "pl-2 text-[13px] text-muted-foreground" : ""
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
