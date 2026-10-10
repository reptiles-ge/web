/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";

import { NavbarChrome } from "@/components/NavbarChrome";
import { NavbarMenu } from "@/components/NavbarMenu";
import { GUIDE_ARTICLE_PATHS } from "@/data/guideArticlePaths";
import { usePathname } from "@/i18n/navigation";
import { NAVBAR_SCROLL_OFFSET } from "@/lib/chromeStyles";

const GUIDE_ARTICLE_PATH_SET = new Set<string>(GUIDE_ARTICLE_PATHS);
const MOBILE_MAX_WIDTH = 1023;
const HEADER_HIDE_OFFSET = 160;
const HEADER_HIDE_DELTA = 8;

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const darkHero = hasDarkHeroTop(pathname);
  const [scrolled, setScrolled] = useState(!darkHero);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const links = [
    { href: "/species" as const, label: t("species") },
    { href: "/quiz" as const, label: t("quizzes") },
    { href: "/regions" as const, label: t("atlas") },
    { href: "/news" as const, label: t("news") },
  ];
  const reptileGroupLinks = [
    { href: "/snakes" as const, label: t("snakes") },
    { href: "/lizards" as const, label: t("lizards") },
    { href: "/turtles" as const, label: t("turtles") },
  ];
  const otherGroupLinks = [
    { href: "/amphibians" as const, label: t("amphibians") },
    { href: "/birds" as const, label: t("birds") },
    { href: "/mammals" as const, label: t("mammals") },
    { href: "/scorpions" as const, label: t("scorpions") },
    { href: "/spiders" as const, label: t("spiders") },
    { href: "/insects" as const, label: t("insects") },
  ];
  const groupLinks = [...reptileGroupLinks, ...otherGroupLinks];
  const mobileNavItems = [
    { href: "/species" as const, kind: "link" as const, label: t("species") },
    { kind: "groups" as const },
    {
      href: "/quiz" as const,
      kind: "link" as const,
      label: t("quizzes"),
    },
    { href: "/regions" as const, kind: "link" as const, label: t("atlas") },
    { href: "/news" as const, kind: "link" as const, label: t("news") },
    { href: "/about" as const, kind: "link" as const, label: t("about") },
  ];
  const [groupsOpen, setGroupsOpen] = useState(false);
  const [mobileGroupsOpen, setMobileGroupsOpen] = useState(false);
  const groupsActive = groupLinks.some(
    (link) => pathname === link.href || pathname.startsWith(`${link.href}/`),
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
    setMobileGroupsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) {
      setMobileGroupsOpen(false);
      return;
    }

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

  const chromeVariant = menuOpen || scrolled ? "light" : "dark";

  return (
    <header className="fixed inset-x-0 top-0 z-50 transition-transform duration-300 ease-out max-lg:header-hidden:-translate-y-full max-lg:header-hidden:focus-within:translate-y-0">
      <NavbarChrome
        chromeVariant={chromeVariant}
        closeMenuLabel={t("closeMenu")}
        discoverLabel={t("discover")}
        groupsActive={groupsActive}
        groupsLabel={t("groups")}
        groupsOpen={groupsOpen}
        heroSearch={pathname === "/"}
        menuButtonRef={menuButtonRef}
        menuId={menuId}
        menuOpen={menuOpen}
        navLabel={t("mainMenu")}
        onCloseMenu={() => setMenuOpen(false)}
        onToggleGroups={() => setGroupsOpen((open) => !open)}
        onToggleMenu={() => setMenuOpen((open) => !open)}
        openMenuAria={t("openMenu")}
        otherGroupLinks={otherGroupLinks}
        reptileGroupLinks={reptileGroupLinks}
        reptilesLabel={t("reptiles")}
        restLinks={links.filter((link) => link.href !== "/species")}
        scrolled={scrolled}
        speciesHref="/species"
        speciesLabel={t("species")}
      />
      <NavbarMenu
        closeMenuLabel={t("closeMenu")}
        discoverLabel={t("discover")}
        groupLinks={groupLinks}
        groupsLabel={t("groups")}
        items={mobileNavItems}
        menuId={menuId}
        menuOpen={menuOpen}
        mobileGroupsOpen={mobileGroupsOpen}
        navLabel={t("mainMenu")}
        onCloseMenu={() => setMenuOpen(false)}
        onToggleMobileGroups={() => setMobileGroupsOpen((open) => !open)}
      />
    </header>
  );
}

function hasDarkHeroTop(pathname: string) {
  if (pathname === "/contact") return false;
  if (GUIDE_ARTICLE_PATH_SET.has(pathname)) return false;
  if (pathname === "/") return true;
  if (pathname === "/about") return true;
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
  if (pathname === "/regions" || pathname.startsWith("/regions/")) return true;
  return false;
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
