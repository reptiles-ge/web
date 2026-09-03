/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useState } from "react";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
import { SpeciesSearch } from "@/components/SpeciesSearch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

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
      <div
        className={cn(
          "mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 transition-all duration-500 lg:px-10",
          scrolled || menuOpen ? "py-3" : "py-5",
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 -z-10 h-full transition-opacity duration-500",
            scrolled || menuOpen ? "opacity-100" : "opacity-0",
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
          onClick={() => setMenuOpen(false)}
        >
          <Logo
            priority
            showWordmark
            size={44}
            wordmarkClassName={cn(
              "hidden text-[17px] transition-colors sm:inline",
              scrolled || menuOpen ? "text-foreground" : "text-white",
            )}
          />
        </Link>
        <nav className="relative z-10 hidden items-center gap-4 lg:flex xl:gap-7">
          <Link
            className={cn(
              "relative text-[13px] font-medium tracking-wide transition-colors",
              scrolled
                ? "text-foreground/70 hover:text-foreground"
                : "text-white/70 hover:text-white",
            )}
            href="/species"
          >
            {t("species")}
          </Link>
          <div className="relative">
            <button
              aria-expanded={groupsOpen}
              aria-haspopup="true"
              className={cn(
                "inline-flex items-center gap-1 text-[13px] font-medium tracking-wide transition-colors",
                scrolled
                  ? "text-foreground/70 hover:text-foreground"
                  : "text-white/70 hover:text-white",
                (groupsActive || groupsOpen) &&
                  (scrolled ? "text-foreground" : "text-white"),
              )}
              onClick={() => setGroupsOpen((open) => !open)}
              type="button"
            >
              {t("groups")}
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
                  aria-label={t("closeMenu")}
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setGroupsOpen(false)}
                  type="button"
                />
                <div className="absolute top-full left-1/2 z-50 mt-3 w-56 -translate-x-1/2 rounded-2xl border border-border bg-background py-2 shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
                  <p className="px-4 pt-1.5 pb-1 text-[10px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
                    {t("reptiles")}
                  </p>
                  {reptileGroupLinks.map((link) => (
                    <Link
                      className="block px-4 py-2 text-[13px] font-medium text-foreground/80 transition-colors hover:bg-surface hover:text-foreground"
                      href={link.href}
                      key={link.href}
                      onClick={() => setGroupsOpen(false)}
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
                      onClick={() => setGroupsOpen(false)}
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
              const className = cn(
                "text-[13px] font-medium tracking-wide transition-colors",
                scrolled
                  ? "text-foreground/70 hover:text-foreground"
                  : "text-white/70 hover:text-white",
              );
              return (
                <Link
                  className={cn("relative", className)}
                  href={link.href}
                  key={link.href}
                >
                  {link.label}
                </Link>
              );
            })}
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
            href="/species"
          >
            {t("discover")}
          </Link>
          <button
            aria-controls={menuId}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
            className={cn(
              "inline-flex size-10 items-center justify-center rounded-full transition-colors lg:hidden",
              scrolled || menuOpen
                ? "text-foreground hover:bg-foreground/5"
                : "text-white hover:bg-white/10",
            )}
            onClick={() => setMenuOpen((open) => !open)}
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

      <div
        className={cn(
          "lg:hidden",
          menuOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        id={menuId}
      >
        <button
          aria-label={t("closeMenu")}
          className={cn(
            "fixed inset-0 z-40 bg-black/45 transition-opacity duration-300",
            menuOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setMenuOpen(false)}
          type="button"
        />
        <nav
          aria-label={t("openMenu")}
          className={cn(
            "fixed inset-x-0 top-17 z-50 mx-auto max-h-[min(78svh,36rem)] w-[calc(100%-1.5rem)] max-w-[1400px] overflow-y-auto rounded-[28px] border border-border bg-background px-5 py-6 transition-all duration-300 sm:w-[calc(100%-3rem)]",
            menuOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
          )}
        >
          <ul className="space-y-1">
            {mobileNavItems.map((item, index) => {
              const number = String(index + 1).padStart(2, "0");

              if (item.kind === "groups") {
                return (
                  <li key="groups">
                    <button
                      aria-expanded={mobileGroupsOpen}
                      className="flex w-full items-center justify-between gap-4 rounded-2xl px-3 py-3.5 text-left transition-colors hover:bg-surface"
                      onClick={() => setMobileGroupsOpen((open) => !open)}
                      type="button"
                    >
                      <span className="flex items-center gap-2 font-display text-[1.35rem] font-semibold text-foreground">
                        {t("groups")}
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
                            onClick={() => setMenuOpen(false)}
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
                    onClick={() => setMenuOpen(false)}
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
            onClick={() => setMenuOpen(false)}
          >
            {t("discover")}
          </Link>
        </nav>
      </div>
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
