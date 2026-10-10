"use client";

import { Check, ChevronDown } from "lucide-react";
import {
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/cn";

type AtlasDropdownOption = { count?: number; id: string; label: string };

type AtlasDropdownProps = {
  alignRight?: boolean;
  icon: ReactNode;
  label: string;
  minWidthClassName?: string;
  onChange: (value: string) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  options: AtlasDropdownOption[];
  value: string;
  widthClassName?: string;
};

export function AtlasDropdown({
  alignRight = false,
  icon,
  label,
  minWidthClassName,
  onChange,
  onOpenChange,
  open,
  options,
  value,
  widthClassName = "w-[260px]",
}: AtlasDropdownProps) {
  const listId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.id === value),
  );
  const [activeIndex, setActiveIndex] = useState(selectedIndex);
  const [syncedOpen, setSyncedOpen] = useState(open);
  const selected = options[selectedIndex];

  if (open !== syncedOpen) {
    setSyncedOpen(open);
    if (open) setActiveIndex(selectedIndex);
  }

  useEffect(() => {
    if (open) optionRefs.current[activeIndex]?.focus({ preventScroll: true });
  }, [open, activeIndex]);

  function close(restoreFocus: boolean) {
    onOpenChange(false);
    if (restoreFocus) triggerRef.current?.focus();
  }

  function pick(id: string) {
    onChange(id);
    close(true);
  }

  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    if (open) {
      optionRefs.current[activeIndex]?.focus();
    } else {
      onOpenChange(true);
    }
  }

  function onListKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const last = options.length - 1;
    const moves: Record<string, number> = {
      ArrowDown: Math.min(activeIndex + 1, last),
      ArrowUp: Math.max(activeIndex - 1, 0),
      End: last,
      Home: 0,
    };
    const next = moves[event.key];
    if (next !== undefined) {
      event.preventDefault();
      setActiveIndex(next);
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      close(true);
    }
  }

  return (
    <div
      className="relative"
      onBlur={(event) => {
        if (open && !event.currentTarget.contains(event.relatedTarget)) {
          close(false);
        }
      }}
    >
      <button
        aria-controls={open ? listId : undefined}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`${label}: ${selected?.label ?? ""}`}
        className={cn(
          "inline-flex h-12 items-center justify-between gap-2.5 rounded-full border border-secondary bg-card px-4 text-[14px] font-medium whitespace-nowrap text-foreground transition-colors hover:border-primary/35",
          minWidthClassName,
        )}
        onClick={() => onOpenChange(!open)}
        onKeyDown={onTriggerKeyDown}
        ref={triggerRef}
        type="button"
      >
        <span className="inline-flex items-center gap-2">
          {icon}
          {selected?.label}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-3.5 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open ? (
        <div
          aria-label={label}
          className={cn(
            "absolute top-14 z-30 max-h-[360px] overflow-y-auto rounded-[20px] bg-card p-1.5 shadow-[0_0_0_1px_rgba(14,20,17,0.06),0_24px_60px_rgba(14,20,17,0.2)]",
            alignRight ? "right-0" : "left-0",
            widthClassName,
          )}
          id={listId}
          onKeyDown={onListKeyDown}
          role="listbox"
        >
          {options.map((option, index) => {
            const active = option.id === value;
            return (
              <button
                aria-selected={active}
                className={cn(
                  "flex min-h-10 w-full items-center gap-2.5 rounded-xl px-3 text-left text-[14px] text-foreground transition-colors outline-none hover:bg-background focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary",
                  active && "font-semibold",
                )}
                key={option.id}
                onClick={() => pick(option.id)}
                onFocus={() => setActiveIndex(index)}
                ref={(node) => {
                  optionRefs.current[index] = node;
                }}
                role="option"
                tabIndex={index === activeIndex ? 0 : -1}
                type="button"
              >
                <Check
                  aria-hidden="true"
                  className={cn(
                    "size-4 shrink-0 text-primary",
                    active ? "opacity-100" : "opacity-0",
                  )}
                />
                <span className="min-w-0 flex-1 truncate">{option.label}</span>
                {option.count !== undefined ? (
                  <span className="text-[12px] text-muted-foreground tabular-nums">
                    {option.count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
