/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";

import type { AppLocale } from "@/i18n/routing";

import { NavbarChrome } from "@/components/NavbarChrome";
import { NavbarGroupsPanel } from "@/components/NavbarGroupsPanel";
import {
  type NavbarData,
  NavbarMenu,
  type NavGroup,
  type NavLink,
} from "@/components/NavbarMenu";
import { GUIDE_ARTICLE_PATHS } from "@/data/guideArticlePaths";
import { usePathname } from "@/i18n/navigation";
import { NAVBAR_SCROLL_OFFSET } from "@/lib/chromeStyles";
import { GROUP_HUBS, type GroupHubId } from "@/lib/groupHubs";
import { quizHref } from "@/lib/quizzes";

const GUIDE_ARTICLE_PATH_SET = new Set<string>(GUIDE_ARTICLE_PATHS);
const MOBILE_MAX_WIDTH = 1023;
const HEADER_HIDE_OFFSET = 160;
const HEADER_HIDE_DELTA = 8;
const REPTILE_GROUP_IDS = ["snakes", "lizards", "turtles"] as const;
const OTHER_GROUP_IDS = [
  "amphibians",
  "birds",
  "mammals",
  "spiders",
  "scorpions",
  "insects",
] as const;

export function Navbar({ images, stats }: NavbarData) {
  const t = useTranslations("nav");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const darkHero = hasDarkHeroTop(pathname);
  const [scrolled, setScrolled] = useState(!darkHero);
  const [menuOpen, setMenuOpen] = useState(false);
  const [groupsOpen, setGroupsOpen] = useState(false);
  const menuId = useId();
  const groupsId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const links: NavLink[] = [
    { href: "/regions", label: t("regions") },
    { href: "/quiz", label: t("quizzes") },
    { href: "/news", label: t("news") },
  ];
  const toGroup = (id: GroupHubId): NavGroup => ({
    count: stats[id],
    countLabel: t("speciesCount", { count: stats[id] }),
    href: GROUP_HUBS[id].path,
    id,
    image: images[id],
    label: t(id),
  });
  const reptileGroups = REPTILE_GROUP_IDS.map(toGroup);
  const otherGroups = OTHER_GROUP_IDS.map(toGroup);
  const groupsActive = [...reptileGroups, ...otherGroups].some((group) =>
    isActivePath(pathname, group.href),
  );

  useEffect(() => {
    if (!darkHero) {
      setScrolled(true);
      return;
    }

    function onScroll() {
      setScrolled(window.scrollY > NAVBAR_SCROLL_OFFSET);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [darkHero, pathname]);

  useEffect(() => {
    setMenuOpen(false);
    setGroupsOpen(false);
  }, [pathname, locale]);

  useEffect(() => {
    if (!groupsOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setGroupsOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [groupsOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const headerHidden = useMobileHeaderHidden(menuOpen);

  useEffect(() => {
    document.documentElement.toggleAttribute(
      "data-header-hidden",
      headerHidden,
    );
  }, [headerHidden]);

  useEffect(
    () => () => document.documentElement.removeAttribute("data-header-hidden"),
    [],
  );

  const solid = scrolled || menuOpen || groupsOpen;

  return (
    <header className="fixed inset-x-0 top-0 z-50 transition-transform duration-300 ease-out max-lg:header-hidden:-translate-y-full max-lg:header-hidden:focus-within:translate-y-0">
      <NavbarChrome
        closeMenuLabel={t("closeMenu")}
        groupsActive={groupsActive}
        groupsId={groupsId}
        groupsLabel={t("groups")}
        groupsOpen={groupsOpen}
        heroSearch={pathname === "/"}
        isActive={(href) => isActivePath(pathname, href)}
        links={links}
        menuButtonRef={menuButtonRef}
        menuId={menuId}
        menuOpen={menuOpen}
        navLabel={t("mainMenu")}
        onCloseMenu={() => setMenuOpen(false)}
        onToggleGroups={() => setGroupsOpen((open) => !open)}
        onToggleMenu={() => setMenuOpen((open) => !open)}
        openMenuAria={t("openMenu")}
        scrolled={scrolled}
        solid={solid}
        speciesLabel={t("species")}
      />
      <NavbarGroupsPanel
        allSpeciesLabel={t("allSpecies", { count: stats.total })}
        closeLabel={t("closeMenu")}
        groupsId={groupsId}
        groupsLabel={t("groups")}
        onClose={() => setGroupsOpen(false)}
        open={groupsOpen}
        otherGroups={otherGroups}
        otherGroupsLabel={t("otherGroups")}
        quickLinks={[
          {
            href: "/venomous-snakes",
            icon: "venomous",
            label: t("venomousSnakes"),
          },
          {
            href: "/snakes-in-the-yard",
            icon: "yard",
            label: t("snakeYard"),
          },
          {
            href: quizHref("snake", locale),
            icon: "identify",
            label: t("whichSnake"),
          },
        ]}
        quickLinksLabel={t("quickLinks")}
        reptileGroups={reptileGroups}
        reptilesLabel={t("reptiles")}
        reptileSpeciesLabel={t("speciesCount", {
          count: reptileGroups.reduce((sum, group) => sum + group.count, 0),
        })}
      />
      <NavbarMenu
        footerLinks={[
          { href: "/about", label: t("about") },
          { href: "/authors", label: t("contributors") },
          { href: "/contact", label: t("contact") },
        ]}
        groupCountLabel={t("groupCount", {
          count: reptileGroups.length + otherGroups.length,
        })}
        groups={[...reptileGroups, ...otherGroups]}
        groupsLabel={t("groups")}
        isActive={(href) => isActivePath(pathname, href)}
        menuId={menuId}
        menuOpen={menuOpen}
        navLabel={t("mainMenu")}
        onCloseMenu={() => setMenuOpen(false)}
        primaryLinks={[
          { count: stats.total, href: "/species", label: t("species") },
          { count: stats.regions, href: "/regions", label: t("regions") },
          { href: "/quiz", label: t("quizzes") },
          { href: "/news", label: t("news") },
        ]}
      />
    </header>
  );
}

function hasDarkHeroTop(pathname: string) {
  if (pathname === "/contact") return false;
  if (GUIDE_ARTICLE_PATH_SET.has(pathname)) return false;
  if (pathname === "/") return true;
  if (pathname === "/venomous-snakes") return true;
  if (pathname === "/snakes-in-the-yard") return true;
  if (
    pathname === "/snakes" ||
    pathname.startsWith("/snakes/") ||
    pathname === "/lizards" ||
    pathname.startsWith("/lizards/") ||
    pathname === "/turtles" ||
    pathname.startsWith("/turtles/") ||
    pathname === "/amphibians" ||
    pathname.startsWith("/amphibians/") ||
    pathname === "/birds" ||
    pathname.startsWith("/birds/") ||
    pathname === "/mammals" ||
    pathname.startsWith("/mammals/") ||
    pathname === "/scorpions" ||
    pathname.startsWith("/scorpions/") ||
    pathname === "/spiders" ||
    pathname.startsWith("/spiders/") ||
    pathname === "/insects" ||
    pathname.startsWith("/insects/")
  ) {
    return true;
  }
  if (pathname.startsWith("/species/")) return true;
  if (pathname.startsWith("/quiz/")) return true;
  if (pathname.startsWith("/regions/")) return true;
  return false;
}

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function useMobileHeaderHidden(menuOpen: boolean) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      setHidden(false);
      return;
    }

    const mobile = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`);
    let lastY = window.scrollY;

    function onScroll() {
      const y = window.scrollY;
      if (!mobile.matches || y < HEADER_HIDE_OFFSET) {
        setHidden(false);
      } else if (y > lastY + HEADER_HIDE_DELTA) {
        setHidden(true);
      } else if (y < lastY - HEADER_HIDE_DELTA) {
        setHidden(false);
      } else {
        return;
      }
      lastY = y;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  return hidden;
}
