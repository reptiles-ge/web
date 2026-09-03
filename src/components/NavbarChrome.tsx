"use client";

import { ChevronDown, Menu, X } from "lucide-react";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
import type { NavLink } from "@/components/NavbarMenu";
import { SpeciesSearch } from "@/components/SpeciesSearch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

type ChromeVariant = "dark" | "light";

export function NavbarChrome({
  chromeVariant,
  closeMenuLabel,
  closeMenuAria,
  discoverLabel,
  groupsActive,
  groupsLabel,
  groupsOpen,
  menuId,
  menuOpen,
  onCloseMenu,
  onToggleGroups,
  onToggleMenu,
  openMenuAria,
  otherGroupLinks,
  reptilesLabel,
  reptileGroupLinks,
  restLinks,
  scrolled,
  speciesHref,
  speciesLabel,
}: {
  chromeVariant: ChromeVariant;
  closeMenuAria: string;
  closeMenuLabel: string;
  discoverLabel: string;
  groupsActive: boolean;
  groupsLabel: string;
  groupsOpen: boolean;
  menuId: string;
  menuOpen: boolean;
  onCloseMenu: () => void;
  onToggleGroups: () => void;
  onToggleMenu: () => void;
  openMenuAria: string;
  otherGroupLinks: NavLink[];
  reptileGroupLinks: NavLink[];
  reptilesLabel: string;
  restLinks: NavLink[];
  scrolled: boolean;
  speciesHref: "/species";
  speciesLabel: string;
}) {
  const elevated = scrolled || menuOpen;

  return (
    <div
      className={cn(
        "mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 transition-all duration-500 lg:px-10",
        elevated ? "py-3" : "py-5",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 -z-10 h-full transition-opacity duration-500",
          elevated ? "opacity-100" : "opacity-0",
        )}
        style={{
          backdropFilter: "blur(24px) saturate(160%)",
          background:
            "color-mix(in oklab, var(--background) 72%, transparent)",
          borderBottom: "1px solid var(--border)",
        }}
      />
      <Link
        className="relative z-10 shrink-0 transition-opacity hover:opacity-90"
        href="/"
        onClick={onCloseMenu}
      >
        <Logo
          priority
          showWordmark
          size={44}
          wordmarkClassName={cn(
            "hidden text-[17px] transition-colors sm:inline",
            elevated ? "text-foreground" : "text-white",
          )}
        />
      </Link>
      <nav className="relative z-10 hidden items-center gap-4 lg:flex xl:gap-7">
        <Link className={desktopNavLinkClass(scrolled)} href={speciesHref}>
          {speciesLabel}
        </Link>
        <NavbarGroupsDropdown
          closeMenuLabel={closeMenuLabel}
          groupsActive={groupsActive}
          groupsLabel={groupsLabel}
          groupsOpen={groupsOpen}
          onToggleGroups={onToggleGroups}
          otherGroupLinks={otherGroupLinks}
          reptileGroupLinks={reptileGroupLinks}
          reptilesLabel={reptilesLabel}
          scrolled={scrolled}
        />
        {restLinks.map((link) => (
          <Link
            className={cn("relative", desktopNavLinkClass(scrolled))}
            href={link.href}
            key={link.href}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="relative z-10 flex items-center justify-end gap-2.5 sm:gap-3">
        <SpeciesSearch variant={chromeVariant} />
        <ThemeToggle variant={chromeVariant} />
        <LanguageSwitcher variant={chromeVariant} />
        <Link
          className={cn(
            "hidden rounded-full px-5 py-2 text-[13px] font-medium transition-all lg:inline-flex",
            scrolled
              ? "bg-primary text-white hover:bg-primary/90 dark:text-ink"
              : "bg-white/90 text-ink hover:bg-white",
          )}
          href={speciesHref}
        >
          {discoverLabel}
        </Link>
        <button
          aria-controls={menuId}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? closeMenuAria : openMenuAria}
          className={cn(
            "inline-flex size-10 items-center justify-center rounded-full transition-colors lg:hidden",
            elevated
              ? "text-foreground hover:bg-foreground/5"
              : "text-white hover:bg-white/10",
          )}
          onClick={onToggleMenu}
          type="button"
        >
          {menuOpen ? (
            <X className="size-5" strokeWidth={1.75} />
          ) : (
            <Menu className="size-5" strokeWidth={1.75} />
          )}
        </button>
      </div>
    </div>
  );
}

function NavbarGroupsDropdown({
  closeMenuLabel,
  groupsActive,
  groupsLabel,
  groupsOpen,
  onToggleGroups,
  otherGroupLinks,
  reptileGroupLinks,
  reptilesLabel,
  scrolled,
}: {
  closeMenuLabel: string;
  groupsActive: boolean;
  groupsLabel: string;
  groupsOpen: boolean;
  onToggleGroups: () => void;
  otherGroupLinks: NavLink[];
  reptileGroupLinks: NavLink[];
  reptilesLabel: string;
  scrolled: boolean;
}) {
  return (
    <div className="relative">
      <button
        aria-expanded={groupsOpen}
        aria-haspopup="true"
        className={cn(
          "inline-flex items-center gap-1",
          desktopNavLinkClass(scrolled, groupsActive || groupsOpen),
        )}
        onClick={onToggleGroups}
        type="button"
      >
        {groupsLabel}
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform",
            groupsOpen && "rotate-180",
          )}
          strokeWidth={1.75}
        />
      </button>
      {groupsOpen ? (
        <>
          <button
            aria-label={closeMenuLabel}
            className="fixed inset-0 z-40 cursor-default"
            onClick={onToggleGroups}
            type="button"
          />
          <div className="absolute top-full left-1/2 z-50 mt-3 w-56 -translate-x-1/2 rounded-2xl border border-border bg-background py-2 shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
            <p className="px-4 pt-1.5 pb-1 text-[10px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
              {reptilesLabel}
            </p>
            {reptileGroupLinks.map((link) => (
              <Link
                className="block px-4 py-2 text-[13px] font-medium text-foreground/80 transition-colors hover:bg-surface hover:text-foreground"
                href={link.href}
                key={link.href}
                onClick={onToggleGroups}
              >
                {link.label}
              </Link>
            ))}
            <div className="my-2 border-t border-border" />
            {otherGroupLinks.map((link) => (
              <Link
                className="block px-4 py-2 text-[13px] font-medium text-foreground/80 transition-colors hover:bg-surface hover:text-foreground"
                href={link.href}
                key={link.href}
                onClick={onToggleGroups}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

function desktopNavLinkClass(scrolled: boolean, active = false) {
  return cn(
    "relative text-[13px] font-medium tracking-wide transition-colors",
    scrolled
      ? "text-foreground/70 hover:text-foreground"
      : "text-white/70 hover:text-white",
    active && (scrolled ? "text-foreground" : "text-white"),
  );
}
