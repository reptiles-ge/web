"use client";

import { Logo } from "@/components/Logo";
import { Link } from "@/i18n/navigation";
import { useMessages, useTranslations } from "next-intl";

const contactHrefs = new Set(["კონტაქტი", "Contact"]);

export function Footer() {
  const t = useTranslations("footer");
  const messages = useMessages();
  const columns = [
    messages.footer.columns.discover,
    messages.footer.columns.science,
    messages.footer.columns.company,
  ];

  return (
    <footer className="border-t border-border bg-background py-20">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid gap-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <a href="#top" className="inline-flex transition-opacity hover:opacity-90">
              <Logo size={56} showWordmark wordmarkClassName="text-[20px]" />
            </a>
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-muted-foreground">
              {t("tagline")}
            </p>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <p className="text-[11px] tracking-[0.22em] text-muted-foreground">
                {column.title}
              </p>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    {contactHrefs.has(link) ? (
                      <Link
                        href="/contact"
                        className="text-[14px] text-foreground/80 transition-colors hover:text-primary"
                      >
                        {link}
                      </Link>
                    ) : (
                      <a
                        href="#top"
                        className="text-[14px] text-foreground/80 transition-colors hover:text-primary"
                      >
                        {link}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-20 flex flex-col gap-3 border-t border-border pt-8 text-[12px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} Reptiles. {t("rights")}
          </span>
          <span className="tracking-wide">{t("forCurious")}</span>
        </div>
      </div>
    </footer>
  );
}
