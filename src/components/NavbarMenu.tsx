"use client";

import { ChevronDown } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export type MobileNavItem =
  | { href: NavLink["href"]; kind: "link"; label: string }
  | { kind: "groups" };

export type NavLink = {
  href:
    | "/about"
    | "/amphibians"
    | "/birds"
    | "/lizards"
    | "/mammals"
    | "/news"
    | "/quiz"
    | "/regions"
    | "/snakes"
    | "/species"
    | "/spiders"
    | "/turtles";
  label: string;
};

export function NavbarMenu({
  closeMenuLabel,
  discoverLabel,
  groupLinks,
  groupsLabel,
  items,
  menuId,
  menuOpen,
  mobileGroupsOpen,
  onCloseMenu,
  onToggleMobileGroups,
  openMenuLabel,
}: {
  closeMenuLabel: string;
  discoverLabel: string;
  groupLinks: NavLink[];
  groupsLabel: string;
  items: MobileNavItem[];
  menuId: string;
  menuOpen: boolean;
  mobileGroupsOpen: boolean;
  onCloseMenu: () => void;
  onToggleMobileGroups: () => void;
  openMenuLabel: string;
}) {
  return (
    <div
      className={cn(
        "lg:hidden",
        menuOpen ? "pointer-events-auto" : "pointer-events-none",
      )}
      id={menuId}
    >
      <button
        aria-label={closeMenuLabel}
        className={cn(
          "fixed inset-0 z-40 bg-black/45 transition-opacity duration-300",
          menuOpen ? "opacity-100" : "opacity-0",
        )}
        onClick={onCloseMenu}
        type="button"
      />
      <nav
        aria-label={openMenuLabel}
        className={cn(
          "fixed inset-x-0 top-17 z-50 mx-auto max-h-[min(78svh,36rem)] w-[calc(100%-1.5rem)] max-w-[1400px] overflow-y-auto rounded-media border border-border bg-background px-5 py-6 transition-all duration-300 sm:w-[calc(100%-3rem)]",
          menuOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
        )}
      >
        <ul className="space-y-1">
          {items.map((item, index) => {
            const number = String(index + 1).padStart(2, "0");

            if (item.kind === "groups") {
              return (
                <li key="groups">
                  <button
                    aria-expanded={mobileGroupsOpen}
                    className="flex w-full items-center justify-between gap-4 rounded-2xl px-3 py-3.5 text-left transition-colors hover:bg-surface"
                    onClick={onToggleMobileGroups}
                    type="button"
                  >
                    <span className="flex items-center gap-2 font-display text-[1.35rem] font-semibold text-foreground">
                      {groupsLabel}
                      <ChevronDown
                        className={cn(
                          "size-4 text-muted-foreground transition-transform",
                          mobileGroupsOpen && "rotate-180",
                        )}
                        strokeWidth={1.75}
                      />
                    </span>
                    <span className="text-[11px] tracking-[0.2em] text-muted-foreground">
                      {number}
                    </span>
                  </button>
                  {mobileGroupsOpen ? (
                    <div className="mb-1 flex flex-col px-3 pb-2">
                      {groupLinks.map((group) => (
                        <Link
                          className="rounded-xl px-3 py-2.5 text-[14px] font-medium text-foreground/80 transition-colors hover:bg-surface hover:text-foreground"
                          href={group.href}
                          key={group.href}
                          onClick={onCloseMenu}
                        >
                          {group.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </li>
              );
            }

            return (
              <li key={item.href}>
                <Link
                  className="flex items-center justify-between gap-4 rounded-2xl px-3 py-3.5 transition-colors hover:bg-surface"
                  href={item.href}
                  onClick={onCloseMenu}
                >
                  <span className="flex items-center gap-2.5 font-display text-[1.35rem] font-semibold text-foreground">
                    {item.label}
                  </span>
                  <span className="text-[11px] tracking-[0.2em] text-muted-foreground">
                    {number}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <Link
          className="mt-5 flex w-full items-center justify-center rounded-full bg-primary px-5 py-3.5 text-[14px] font-medium text-white transition-opacity hover:opacity-90 dark:text-ink"
          href="/species"
          onClick={onCloseMenu}
        >
          {discoverLabel}
        </Link>
      </nav>
    </div>
  );
}
