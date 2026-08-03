"use client";

import { Logo } from "@/components/Logo";
import { useEffect, useState } from "react";

const links = [
  { href: "#species", label: "სახეობები" },
  { href: "#detail", label: "შესახებ" },
  { href: "#why", label: "ატლასი" },
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
        <a href="#top" className="relative z-10 transition-opacity hover:opacity-90">
          <Logo
            size={44}
            priority
            showWordmark
            wordmarkClassName={`text-[17px] transition-colors ${
              scrolled ? "text-foreground" : "text-white"
            }`}
          />
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
        <a
          href="#species"
          className={`hidden rounded-full px-5 py-2 text-[13px] font-medium transition-all sm:inline-flex ${
            scrolled
              ? "bg-primary text-white hover:bg-primary/90"
              : "bg-white/90 text-ink hover:bg-white"
          }`}
        >
          აღმოაჩინე
        </a>
      </div>
    </header>
  );
}
