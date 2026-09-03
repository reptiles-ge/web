/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useTranslations } from "next-intl";
import { useEffect, useId, useState } from "react";

import { NavbarChrome } from "@/components/NavbarChrome";
import { NavbarMenu } from "@/components/NavbarMenu";
import { usePathname } from "@/i18n/navigation";

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const darkHero = hasDarkHeroTop(pathname);
  const [scrolled, setScrolled] = useState(!darkHero);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

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
    { href: "/spiders" as const, label: t("spiders") },
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
      setScrolled(window.scrollY > 40);
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
      if (event.key === "Escape") setMenuOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const chromeVariant = menuOpen || scrolled ? "light" : "dark";

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <NavbarChrome
        chromeVariant={chromeVariant}
        closeMenuAria={t("closeMenu")}
        closeMenuLabel={t("closeMenu")}
        discoverLabel={t("discover")}
        groupsActive={groupsActive}
        groupsLabel={t("groups")}
        groupsOpen={groupsOpen}
        menuId={menuId}
        menuOpen={menuOpen}
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
        onCloseMenu={() => setMenuOpen(false)}
        onToggleMobileGroups={() => setMobileGroupsOpen((open) => !open)}
        openMenuLabel={t("openMenu")}
      />
    </header>
  );
}

function hasDarkHeroTop(pathname: string) {
  if (pathname === "/contact") return false;
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
    pathname === "/spiders" ||
    pathname.startsWith("/spiders/")
  ) {
    return true;
  }
  if (pathname === "/species" || pathname.startsWith("/species/")) return true;
  if (pathname.startsWith("/quiz/")) return true;
  if (pathname === "/regions" || pathname.startsWith("/regions/")) return true;
  return false;
}
