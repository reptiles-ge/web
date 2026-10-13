"use client";

import { ChevronRight } from "lucide-react";

import type { GroupHubId } from "@/lib/groupHubs";

import { IntentPrefetchLink } from "@/components/IntentPrefetchLink";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SpeciesSearch } from "@/components/SpeciesSearch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/cn";

export type NavbarData = {
  images: Record<GroupHubId, NavImage>;
  stats: NavStats;
};

export type NavGroup = {
  count: number;
  countLabel: string;
  href: `/${GroupHubId}`;
  id: GroupHubId;
  image: NavImage;
  label: string;
};

export type NavImage = {
  sources: Array<{ srcSet: string; type: string }>;
  src: string;
};

export type NavLink = {
  href:
    | "/about"
    | "/authors"
    | "/contact"
    | "/news"
    | "/quiz"
    | "/regions"
    | "/species";
  label: string;
};

type NavStats = Record<"regions" | "total" | GroupHubId, number>;

type PrimaryLink = NavLink & { count?: number };

export function NavbarMenu({
  footerLinks,
  groupCountLabel,
  groups,
  groupsLabel,
  isActive,
  menuId,
  menuOpen,
  navLabel,
  onCloseMenu,
  primaryLinks,
}: {
  footerLinks: NavLink[];
  groupCountLabel: string;
  groups: NavGroup[];
  groupsLabel: string;
  isActive: (href: string) => boolean;
  menuId: string;
  menuOpen: boolean;
  navLabel: string;
  onCloseMenu: () => void;
  primaryLinks: PrimaryLink[];
}) {
  return (
    <div
      className={cn(
        "lg:hidden",
        menuOpen ? "pointer-events-auto" : "pointer-events-none",
      )}
      id={menuId}
      inert={!menuOpen}
    >
      <nav
        aria-label={navLabel}
        className={cn(
          "fixed inset-x-0 top-[68px] bottom-0 z-40 scrollbar-none overflow-y-auto overscroll-contain bg-background px-5 pt-4 pb-7 transition-[opacity,translate,display] transition-discrete duration-300 sm:px-6 [&::-webkit-scrollbar]:hidden",
          menuOpen
            ? "block translate-y-0 opacity-100 starting:-translate-y-2 starting:opacity-0"
            : "hidden -translate-y-2 opacity-0",
        )}
      >
        {menuOpen ? <SpeciesSearch variant="menu" /> : null}

        <ul className="mt-3.5">
          {primaryLinks.map((link) => (
            <li key={link.href}>
              <IntentPrefetchLink
                aria-current={isActive(link.href) ? "page" : undefined}
                className="flex min-h-[60px] items-center gap-3 border-b border-border/70 px-1"
                href={link.href}
                onClick={onCloseMenu}
              >
                <span className="flex-1 font-display text-[24px] leading-tight font-semibold tracking-[-0.01em] text-foreground">
                  {link.label}
                </span>
                {link.count ? (
                  <span className="text-[13px] text-muted-foreground tabular-nums">
                    {link.count}
                  </span>
                ) : null}
                <ChevronRight
                  aria-hidden="true"
                  className="size-4 text-muted-foreground/70"
                  strokeWidth={1.75}
                />
              </IntentPrefetchLink>
            </li>
          ))}
        </ul>

        <div className="mt-[22px] flex items-baseline justify-between">
          <span className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
            {groupsLabel}
          </span>
          <span className="text-[12px] text-muted-foreground">
            {groupCountLabel}
          </span>
        </div>
        <ul className="mt-2.5 grid grid-cols-3 gap-2 md:grid-cols-5">
          {groups.map((group) => (
            <li key={group.id}>
              <IntentPrefetchLink
                className="relative flex h-[88px] flex-col justify-end overflow-hidden rounded-[18px] bg-ink p-2.5 text-white"
                href={group.href}
                onClick={onCloseMenu}
              >
                <NavPicture
                  className="absolute inset-0 size-full object-cover opacity-80"
                  image={group.image}
                  sizes="(min-width: 768px) 20vw, 33vw"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-t from-ink/90 to-ink/0"
                />
                <span className="relative font-display text-[13px] leading-tight font-semibold">
                  {group.label}
                </span>
                <span className="relative mt-0.5 text-[11.5px] text-white/75 tabular-nums">
                  {group.count}
                </span>
              </IntentPrefetchLink>
            </li>
          ))}
        </ul>

        <div className="mt-[22px] flex items-center gap-2.5">
          <LanguageSwitcher variant="menu" />
          <ThemeToggle variant="menu" />
        </div>

        <ul className="mt-[18px] flex flex-wrap gap-x-[18px] gap-y-1 text-[13.5px] text-muted-foreground">
          {footerLinks.map((link) => (
            <li key={link.href}>
              <IntentPrefetchLink
                className="tap-target inline-flex min-h-9 items-center transition-colors hover:text-foreground"
                href={link.href}
                onClick={onCloseMenu}
              >
                {link.label}
              </IntentPrefetchLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export function NavPicture({
  className,
  image,
  sizes,
}: {
  className: string;
  image: NavImage;
  sizes: string;
}) {
  return (
    <picture>
      {image.sources.map((source) => (
        <source key={source.type} sizes={sizes} {...source} />
      ))}
      <img
        alt=""
        className={className}
        decoding="async"
        loading="lazy"
        sizes={sizes}
        src={image.src}
      />
    </picture>
  );
}
