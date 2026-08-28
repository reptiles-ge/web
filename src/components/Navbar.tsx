/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
import { SpeciesSearch } from "@/components/SpeciesSearch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useState } from "react";

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
    pathname.startsWith("/mammals/")
  ) {
    return true;
  }
  if (pathname === "/species" || pathname.startsWith("/species/")) return true;
  if (pathname.startsWith("/quiz/")) return true;
  if (pathname === "/regions" || pathname.startsWith("/regions/")) return true;
  return false;
}

function NavNewBadge({
  label,
  placement = "corner",
}: {
  label: string;
  placement?: "corner" | "inline";
}) {
  if (placement === "inline") {
    return (
      <span className="inline-flex items-center rounded-full bg-[#e23d2e] px-2 py-[3px] text-[10px] font-semibold leading-none text-white">
        {label}
      </span>
    );
  }

  return (
    <span className="pointer-events-none absolute -right-2 -top-5">
      <span className="relative inline-flex items-center rounded-full bg-[#e23d2e] px-1.5 py-[3px] text-[9px] font-semibold leading-none text-white shadow-[0_2px_8px_rgba(226,61,46,0.38)]">
        {label}
        <span
          aria-hidden
          className="absolute left-1/2 top-[calc(100%-1px)] -translate-x-1/2 border-x-[4px] border-t-[5px] border-x-transparent border-t-[#e23d2e]"
        />
      </span>
    </span>
  );
}

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const darkHero = hasDarkHeroTop(pathname);
  const [scrolled, setScrolled] = useState(!darkHero);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  const links = [
    { href: "/species" as const, label: t("species") },
    { href: "/quiz" as const, label: t("quizzes"), badge: t("new") },
    { href: "/regions" as const, label: t("atlas") },
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
  ];
  const groupLinks = [...reptileGroupLinks, ...otherGroupLinks];
  const mobileNavItems = [
    { kind: "link" as const, href: "/species" as const, label: t("species") },
    { kind: "groups" as const },
    {
      kind: "link" as const,
      href: "/quiz" as const,
      label: t("quizzes"),
      badge: t("new"),
    },
    { kind: "link" as const, href: "/regions" as const, label: t("atlas") },
    { kind: "link" as const, href: "/about" as const, label: t("about") },
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
      <div
        className={`mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 transition-all duration-500 lg:px-10 ${
          scrolled || menuOpen ? "py-3" : "py-5"
        }`}
      >
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 -z-10 h-full transition-opacity duration-500 ${
            scrolled || menuOpen ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "color-mix(in oklab, var(--background) 72%, transparent)",
            backdropFilter: "blur(24px) saturate(160%)",
            borderBottom: "1px solid var(--border)",
          }}
        />
        <Link
          href="/"
          className="relative z-10 shrink-0 transition-opacity hover:opacity-90"
          onClick={() => setMenuOpen(false)}
        >
          <Logo
            size={44}
            showWordmark
            wordmarkClassName={`hidden text-[17px] transition-colors sm:inline ${
              scrolled || menuOpen ? "text-foreground" : "text-white"
            }`}
          />
        </Link>
        <nav className="relative z-10 hidden items-center gap-4 lg:flex xl:gap-7">
          <Link
            href="/species"
            className={`relative text-[13px] font-medium tracking-wide transition-colors ${
              scrolled
                ? "text-foreground/70 hover:text-foreground"
                : "text-white/70 hover:text-white"
            }`}
          >
            {t("species")}
          </Link>
          <div className="relative">
            <button
              type="button"
              className={`inline-flex items-center gap-1 text-[13px] font-medium tracking-wide transition-colors ${
                scrolled
                  ? "text-foreground/70 hover:text-foreground"
                  : "text-white/70 hover:text-white"
              } ${groupsActive || groupsOpen ? (scrolled ? "text-foreground" : "text-white") : ""}`}
              aria-expanded={groupsOpen}
              aria-haspopup="true"
              onClick={() => setGroupsOpen((open) => !open)}
            >
              {t("groups")}
              <ChevronDown
                className={`size-3.5 transition-transform ${groupsOpen ? "rotate-180" : ""}`}
                strokeWidth={1.75}
              />
            </button>
            {groupsOpen ? (
              <>
                <button
                  type="button"
                  className="fixed inset-0 z-40 cursor-default"
                  aria-label={t("closeMenu")}
                  onClick={() => setGroupsOpen(false)}
                />
                <div className="absolute left-1/2 top-full z-50 mt-3 w-56 -translate-x-1/2 rounded-2xl border border-border bg-background py-2 shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
                  <p className="px-4 pb-1 pt-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    {t("reptiles")}
                  </p>
                  {reptileGroupLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setGroupsOpen(false)}
                      className="block px-4 py-2 text-[13px] font-medium text-foreground/80 transition-colors hover:bg-surface hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="my-2 border-t border-border" />
                  {otherGroupLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setGroupsOpen(false)}
                      className="block px-4 py-2 text-[13px] font-medium text-foreground/80 transition-colors hover:bg-surface hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </>
            ) : null}
          </div>
          {links
            .filter((link) => link.href !== "/species")
            .map((link) => {
              const className = `text-[13px] font-medium tracking-wide transition-colors ${
                scrolled
                  ? "text-foreground/70 hover:text-foreground"
                  : "text-white/70 hover:text-white"
              }`;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative ${className}`}
                >
                  {link.label}
                  {"badge" in link && link.badge ? (
                    <NavNewBadge label={link.badge} />
                  ) : null}
                </Link>
              );
            })}
        </nav>
        <div className="relative z-10 flex items-center justify-end gap-2.5 sm:gap-3">
          <SpeciesSearch variant={chromeVariant} />
          <ThemeToggle variant={chromeVariant} />
          <LanguageSwitcher variant={chromeVariant} />
          <Link
            href="/species"
            className={`hidden rounded-full px-5 py-2 text-[13px] font-medium transition-all lg:inline-flex ${
              scrolled
                ? "bg-primary text-white hover:bg-primary/90 dark:text-ink"
                : "bg-white/90 text-ink hover:bg-white"
            }`}
          >
            {t("discover")}
          </Link>
          <button
            type="button"
            className={`inline-flex size-10 items-center justify-center rounded-full transition-colors lg:hidden ${
              scrolled || menuOpen
                ? "text-foreground hover:bg-foreground/5"
                : "text-white hover:bg-white/10"
            }`}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <X className="size-5" strokeWidth={1.75} />
            ) : (
              <Menu className="size-5" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </div>

      <div
        id={menuId}
        className={`lg:hidden ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <button
          type="button"
          aria-label={t("closeMenu")}
          className={`fixed inset-0 z-40 bg-black/45 transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        />
        <nav
          aria-label={t("openMenu")}
          className={`fixed inset-x-0 top-[4.25rem] z-50 mx-auto max-h-[min(78svh,36rem)] w-[calc(100%-1.5rem)] max-w-[1400px] overflow-y-auto rounded-[28px] border border-border bg-background px-5 py-6 transition-all duration-300 sm:w-[calc(100%-3rem)] ${
            menuOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
          }`}
        >
          <ul className="space-y-1">
            {mobileNavItems.map((item, index) => {
              const number = String(index + 1).padStart(2, "0");

              if (item.kind === "groups") {
                return (
                  <li key="groups">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-4 rounded-2xl px-3 py-3.5 text-left transition-colors hover:bg-surface"
                      aria-expanded={mobileGroupsOpen}
                      onClick={() => setMobileGroupsOpen((open) => !open)}
                    >
                      <span className="flex items-center gap-2 font-display text-[1.35rem] font-semibold text-foreground">
                        {t("groups")}
                        <ChevronDown
                          className={`size-4 text-muted-foreground transition-transform ${
                            mobileGroupsOpen ? "rotate-180" : ""
                          }`}
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
                            key={group.href}
                            href={group.href}
                            onClick={() => setMenuOpen(false)}
                            className="rounded-xl px-3 py-2.5 text-[14px] font-medium text-foreground/80 transition-colors hover:bg-surface hover:text-foreground"
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
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between gap-4 rounded-2xl px-3 py-3.5 transition-colors hover:bg-surface"
                  >
                    <span className="flex items-center gap-2.5 font-display text-[1.35rem] font-semibold text-foreground">
                      {item.label}
                      {"badge" in item && item.badge ? (
                        <NavNewBadge label={item.badge} placement="inline" />
                      ) : null}
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
            href="/species"
            onClick={() => setMenuOpen(false)}
            className="mt-5 flex w-full items-center justify-center rounded-full bg-primary px-5 py-3.5 text-[14px] font-medium text-white transition-opacity hover:opacity-90 dark:text-ink"
          >
            {t("discover")}
          </Link>
        </nav>
      </div>
    </header>
  );
}
