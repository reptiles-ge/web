"use client";

import type { ComponentProps } from "react";

import { ArrowRight, House, ScanSearch, ShieldAlert } from "lucide-react";

import { IntentPrefetchLink } from "@/components/IntentPrefetchLink";
import { type NavGroup, NavPicture } from "@/components/NavbarMenu";
import { cn } from "@/lib/cn";

type QuickLink = {
  href: ComponentProps<typeof IntentPrefetchLink>["href"];
  icon: keyof typeof QUICK_LINK_ICONS;
  label: string;
};

const QUICK_LINK_ICONS = {
  identify: ScanSearch,
  venomous: ShieldAlert,
  yard: House,
};

const eyebrowClass =
  "text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase";

export function NavbarGroupsPanel({
  allSpeciesLabel,
  closeLabel,
  groupsId,
  groupsLabel,
  onClose,
  otherGroups,
  otherGroupsLabel,
  quickLinks,
  quickLinksLabel,
  reptileGroups,
  reptilesLabel,
  reptileSpeciesLabel,
}: {
  allSpeciesLabel: string;
  closeLabel: string;
  groupsId: string;
  groupsLabel: string;
  onClose: () => void;
  otherGroups: NavGroup[];
  otherGroupsLabel: string;
  quickLinks: QuickLink[];
  quickLinksLabel: string;
  reptileGroups: NavGroup[];
  reptilesLabel: string;
  reptileSpeciesLabel: string;
}) {
  return (
    <div className="max-lg:hidden">
      <button
        aria-label={closeLabel}
        className="absolute inset-x-0 top-full h-screen cursor-default bg-ink/30 backdrop-blur-[2px]"
        onClick={onClose}
        type="button"
      />
      <div
        aria-label={groupsLabel}
        className="absolute inset-x-6 top-[calc(100%+12px)] mx-auto grid max-w-[1320px] grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_240px] gap-6 rounded-[28px] bg-card p-6 shadow-[0_0_0_1px_rgba(14,20,17,0.05),0_30px_80px_rgba(14,20,17,0.24)] xl:inset-x-[60px] xl:grid-cols-[540px_minmax(0,1fr)_280px] xl:gap-7"
        id={groupsId}
        role="region"
      >
        <div>
          <div className="flex items-baseline justify-between px-0.5 pb-3">
            <span className={eyebrowClass}>{reptilesLabel}</span>
            <span className="text-[12px] text-muted-foreground">
              {reptileSpeciesLabel}
            </span>
          </div>
          <ul className="grid grid-cols-3 gap-2.5">
            {reptileGroups.map((group) => (
              <li key={group.id}>
                <IntentPrefetchLink
                  className="group/card relative flex h-[184px] flex-col justify-end overflow-hidden rounded-[22px] bg-ink p-4 text-white xl:h-[208px]"
                  href={group.href}
                  onClick={onClose}
                >
                  <NavPicture
                    className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover/card:scale-105 motion-reduce:transition-none"
                    image={group.image}
                    sizes="180px"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-[70%] bg-linear-to-t from-ink/90 to-ink/0"
                  />
                  <span className="relative font-display text-[24px] leading-none font-semibold tabular-nums">
                    {group.count}
                  </span>
                  <span className="relative mt-1 font-display text-[15px] font-semibold">
                    {group.label}
                  </span>
                </IntentPrefetchLink>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="px-0.5 pb-3">
            <span className={eyebrowClass}>{otherGroupsLabel}</span>
          </div>
          <ul className="grid grid-cols-2 gap-1">
            {otherGroups.map((group) => (
              <li key={group.id}>
                <IntentPrefetchLink
                  className="flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-background"
                  href={group.href}
                  onClick={onClose}
                >
                  <NavPicture
                    className="size-12 shrink-0 rounded-[14px] object-cover"
                    image={group.image}
                    sizes="48px"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-[14.5px] font-semibold text-foreground">
                      {group.label}
                    </span>
                    <span className="mt-0.5 block text-[12.5px] text-muted-foreground">
                      {group.countLabel}
                    </span>
                  </span>
                </IntentPrefetchLink>
              </li>
            ))}
          </ul>
        </div>
        <aside className="flex flex-col rounded-[22px] bg-background p-3">
          <div className="px-3 pt-1 pb-2">
            <span className={eyebrowClass}>{quickLinksLabel}</span>
          </div>
          {quickLinks.map((link) => {
            const Icon = QUICK_LINK_ICONS[link.icon];
            const venomous = link.icon === "venomous";
            return (
              <IntentPrefetchLink
                className="flex min-h-12 items-center gap-3 rounded-[14px] px-3 text-[14px] font-medium text-foreground transition-colors hover:bg-card"
                href={link.href}
                key={link.icon}
                onClick={onClose}
              >
                <span
                  className={cn(
                    "flex size-[30px] shrink-0 items-center justify-center rounded-[10px]",
                    venomous
                      ? "bg-destructive/10 text-destructive"
                      : "bg-card text-primary",
                  )}
                >
                  <Icon
                    aria-hidden="true"
                    className="size-[15px]"
                    strokeWidth={1.75}
                  />
                </span>
                {link.label}
              </IntentPrefetchLink>
            );
          })}
          <div className="flex-1" />
          <IntentPrefetchLink
            className="mt-2.5 flex h-12 items-center justify-between rounded-full bg-primary pr-2 pl-[18px] text-[14px] font-medium text-white transition-opacity hover:opacity-90 dark:text-ink"
            href="/species"
            onClick={onClose}
          >
            <span>{allSpeciesLabel}</span>
            <span className="flex size-8 items-center justify-center rounded-full bg-white/16">
              <ArrowRight aria-hidden="true" className="size-[15px]" />
            </span>
          </IntentPrefetchLink>
        </aside>
      </div>
    </div>
  );
}
