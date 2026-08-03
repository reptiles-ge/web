"use client";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useEffect, useState } from "react";

const links = [
  { href: "#species", label: "Species" },
  { href: "#why", label: "Atlas" },
  { href: "#identify", label: "Identify" },
  { href: "#detail", label: "About" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`mx-auto flex max-w-[1400px] items-center justify-between px-6 transition-all duration-500 lg:px-10 ${
          scrolled ? "py-4" : "py-6"
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
        <a
          href="#top"
          className={`font-display text-[17px] font-semibold tracking-tight transition-colors ${
            scrolled ? "text-foreground" : "text-white"
          }`}
        >
          Repti
          <span className={scrolled ? "text-primary" : "text-white/60"}>
            Verse
          </span>
        </a>
        <nav className="hidden items-center gap-9 md:flex">
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
        <div className="flex items-center gap-3">
          <LanguageSwitcher variant={scrolled ? "light" : "dark"} />
          <a
            href="#species"
            className={`hidden rounded-full px-5 py-2 text-[13px] font-medium transition-all sm:inline-flex ${
              scrolled
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-white/90 text-ink hover:bg-white"
            }`}
          >
            Explore
          </a>
        </div>
      </div>
    </header>
  );
}
