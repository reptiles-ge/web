"use client";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
import { SpeciesSearch } from "@/components/SpeciesSearch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export function Navbar() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);

  const links = [
    { href: "#species", label: t("species") },
    { href: "#atlas", label: t("atlas") },
    { href: "#detail", label: t("about") },
  ];

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const chromeVariant = scrolled ? "light" : "dark";

  return (
    <header
      className="fixed inset-x-0 z-50"
      style={{ top: "var(--beta-banner-height, 0px)" }}
    >
      <div
        className={`mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 transition-all duration-500 lg:px-10 ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 -z-10 h-full transition-opacity duration-500 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "color-mix(in oklab, var(--background) 72%, transparent)",
            backdropFilter: "blur(24px) saturate(160%)",
            borderBottom: "1px solid var(--border)",
          }}
        />
        <Link href="/" className="relative z-10 shrink-0 transition-opacity hover:opacity-90">
          <Logo
            size={44}
            showWordmark
            wordmarkClassName={`hidden text-[17px] transition-colors sm:inline ${
              scrolled ? "text-foreground" : "text-white"
            }`}
          />
        </Link>
        <nav className="relative z-10 hidden items-center gap-9 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-[13px] font-medium tracking-wide transition-colors ${
                scrolled
                  ? "text-foreground/70 hover:text-foreground"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="relative z-10 flex items-center justify-end gap-2.5 sm:gap-3">
          <SpeciesSearch variant={chromeVariant} />
          <ThemeToggle variant={chromeVariant} />
          <LanguageSwitcher variant={chromeVariant} />
          <a
            href="#species"
            className={`hidden rounded-full px-5 py-2 text-[13px] font-medium transition-all lg:inline-flex ${
              scrolled
                ? "bg-primary text-white hover:bg-primary/90 dark:text-ink"
                : "bg-white/90 text-ink hover:bg-white"
            }`}
          >
            {t("discover")}
          </a>
        </div>
      </div>
    </header>
  );
}
