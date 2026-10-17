"use client";

import type { RefObject } from "react";

import { ChevronDown, Menu, X } from "lucide-react";

import type { NavLink } from "@/components/NavbarMenu";

import { IntentPrefetchLink } from "@/components/IntentPrefetchLink";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo, LOGO_NAV_SIZE } from "@/components/Logo";
import { SpeciesSearch } from "@/components/SpeciesSearch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link } from "@/i18n/navigation";
import {
  chromeIconButtonBase,
  chromeIconButtonClass,
} from "@/lib/chromeStyles";
import { cn } from "@/lib/cn";

export function NavbarChrome({
  closeMenuLabel,
  groupsActive,
  groupsId,
  groupsLabel,
  groupsOpen,
  heroSearch,
  isActive,
  links,
  menuButtonRef,
  menuId,
  menuOpen,
  navLabel,
  onCloseMenu,
  onToggleGroups,
  onToggleMenu,
  openMenuAria,
  scrolled,
  solid,
  speciesLabel,
}: {
  closeMenuLabel: string;
  groupsActive: boolean;
  groupsId: string;
  groupsLabel: string;
  groupsOpen: boolean;
  heroSearch: boolean;
  isActive: (href: string) => boolean;
  links: NavLink[];
  menuButtonRef: RefObject<HTMLButtonElement | null>;
  menuId: string;
  menuOpen: boolean;
  navLabel: string;
  onCloseMenu: () => void;
  onToggleGroups: () => void;
  onToggleMenu: () => void;
  openMenuAria: string;
  scrolled: boolean;
  solid: boolean;
  speciesLabel: string;
}) {
  const variant = solid ? "light" : "dark";

  return (
    <div
      className={cn(
        "mx-auto flex max-w-[1440px] items-center gap-1.5 px-4 transition-[padding] duration-500 min-[360px]:px-5 lg:gap-2 lg:px-6 xl:px-[60px]",
        scrolled || menuOpen ? "py-3" : "py-5",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 -z-10 h-full border-b transition-[opacity,border-color] duration-300",
          solid ? "border-border/70 opacity-100" : "border-white/10 opacity-0",
        )}
        style={{
          backdropFilter: "blur(18px) saturate(160%)",
          background: "color-mix(in oklab, var(--background) 90%, transparent)",
        }}
      />
      <Link
        className="relative z-10 shrink-0 transition-opacity hover:opacity-90 lg:mr-3 xl:mr-7"
        href="/"
        onClick={onCloseMenu}
      >
        <Logo
          priority
          showWordmark
          size={LOGO_NAV_SIZE}
          wordmarkClassName={cn(
            "text-[16px] transition-colors lg:text-[17px]",
            solid ? "text-foreground" : "text-white",
          )}
        />
      </Link>
      <nav
        aria-label={navLabel}
        className="relative z-10 hidden items-center gap-0.5 lg:flex"
      >
        <IntentPrefetchLink
          aria-current={isActive("/species") ? "page" : undefined}
          className={navItemClass(solid, isActive("/species"))}
          href="/species"
        >
          {speciesLabel}
        </IntentPrefetchLink>
        <button
          aria-controls={groupsOpen ? groupsId : undefined}
          aria-expanded={groupsOpen}
          className={cn(
            navItemClass(solid, groupsActive),
            groupsOpen && "bg-surface text-foreground",
          )}
          onClick={onToggleGroups}
          type="button"
        >
          {groupsLabel}
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "size-3.5 transition-transform duration-200",
              groupsOpen && "rotate-180",
            )}
            strokeWidth={1.75}
          />
        </button>
        {links.map((link) => (
          <IntentPrefetchLink
            aria-current={isActive(link.href) ? "page" : undefined}
            className={navItemClass(solid, isActive(link.href))}
            href={link.href}
            key={link.href}
          >
            {link.label}
          </IntentPrefetchLink>
        ))}
      </nav>
      <div className="flex-1" />
      <div className="relative z-10 flex items-center gap-1.5 sm:gap-2">
        <SpeciesSearch
          hidden={(heroSearch && !scrolled) || menuOpen}
          shortcut={heroSearch ? "scrolled" : undefined}
          variant={variant}
        />
        <div className="hidden lg:block">
          <ThemeToggle variant={variant} />
        </div>
        <LanguageSwitcher variant={variant} />
        <button
          aria-controls={menuId}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? closeMenuLabel : openMenuAria}
          className={cn(
            chromeIconButtonBase,
            chromeIconButtonClass(variant),
            "lg:hidden",
          )}
          onClick={onToggleMenu}
          ref={menuButtonRef}
          type="button"
        >
          {menuOpen ? (
            <X aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
          ) : (
            <Menu aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
          )}
        </button>
      </div>
    </div>
  );
}

function navItemClass(solid: boolean, active: boolean) {
  return cn(
    "tap-target inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-[14px] font-medium tracking-[0.01em] whitespace-nowrap transition-colors duration-200 xl:px-3.5",
    solid
      ? active
        ? "bg-card text-foreground"
        : "text-foreground/75 hover:bg-card/70 hover:text-foreground"
      : active
        ? "bg-white/12 text-white"
        : "text-white/80 hover:bg-white/10 hover:text-white",
  );
}
