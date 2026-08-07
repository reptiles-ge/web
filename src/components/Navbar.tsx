/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
import { SpeciesSearch } from "@/components/SpeciesSearch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu, X } from "lucide-react";
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
    pathname === "/lizards" ||
    pathname === "/turtles" ||
    pathname === "/amphibians"
  ) {
    return true;
  }
  if (pathname === "/species" || pathname.startsWith("/species/")) return true;
  if (pathname === "/regions" || pathname.startsWith("/regions/")) return true;
  return false;
}

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const darkHero = hasDarkHeroTop(pathname);
  const [scrolled, setScrolled] = useState(!darkHero);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  const links = [
    { href: "/species", label: t("species") },
    { href: "/snakes", label: t("snakes") },
    { href: "/regions", label: t("atlas") },
    { href: "/about", label: t("about") },
  ] as const;

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
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

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
            priority
            showWordmark
            wordmarkClassName={`hidden text-[17px] transition-colors sm:inline ${
              scrolled || menuOpen ? "text-foreground" : "text-white"
            }`}
          />
        </Link>
        <nav className="relative z-10 hidden items-center gap-9 md:flex">
          {links.map((link) => {
            const className = `text-[13px] font-medium tracking-wide transition-colors ${
              scrolled
                ? "text-foreground/70 hover:text-foreground"
                : "text-white/70 hover:text-white"
            }`;
            return (
              <Link key={link.href} href={link.href} className={className}>
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
            className={`inline-flex size-10 items-center justify-center rounded-full transition-colors md:hidden ${
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
        className={`md:hidden ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
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
            menuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-2 opacity-0"
          }`}
        >
          <ul className="space-y-1">
            {links.map((link, index) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between gap-4 rounded-2xl px-3 py-3.5 transition-colors hover:bg-surface"
                >
                  <span className="font-display text-[1.35rem] font-semibold text-foreground">
                    {link.label}
                  </span>
                  <span className="text-[11px] tracking-[0.2em] text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </Link>
              </li>
            ))}
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
