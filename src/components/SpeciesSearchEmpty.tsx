"use client";

import { Search } from "lucide-react";

export function EmptyState({
  hint,
  onPick,
  suggestions,
  title,
}: {
  hint: string;
  onPick: (value: string) => void;
  suggestions: string[];
  title: string;
}) {
  return (
    <div className="px-4 py-9 text-center">
      <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-full bg-secondary">
        <Search aria-hidden="true" className="size-4 text-muted-foreground" />
      </div>
      <p className="text-[13px] font-medium text-foreground">{title}</p>
      <p className="mt-1 text-[12px] text-muted-foreground">{hint}</p>
      {suggestions.length > 0 ? (
        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
          {suggestions.map((item) => (
            <button
              className="rounded-full bg-secondary px-3 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-foreground"
              key={item}
              onClick={() => onPick(item)}
              onMouseDown={(event) => event.preventDefault()}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
