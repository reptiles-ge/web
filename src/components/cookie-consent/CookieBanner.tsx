"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

export function CookieBanner({
  onAccept,
  onNecessary,
  onSettings,
  policyLabel,
}: {
  onAccept: () => void;
  onNecessary: () => void;
  onSettings: () => void;
  policyLabel: string;
}) {
  const t = useTranslations("cookieConsent");

  return (
    <section
      aria-label={t("bannerAria")}
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="mx-auto max-w-2xl rounded-md border border-border bg-card/96 p-4 shadow-[0_18px_55px_rgba(10,20,14,0.18)] backdrop-blur-md sm:p-5 dark:shadow-[0_18px_55px_rgba(0,0,0,0.42)]">
        <div className="space-y-3">
          <h2 className="text-[16px] leading-snug font-semibold text-foreground">
            {t("title")}
          </h2>
          <p className="text-[14px] leading-6 text-muted-foreground">
            {t("description")}{" "}
            <Link
              className="font-medium text-primary underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:outline-none"
              href="/cookie-policy"
            >
              {policyLabel}
            </Link>
          </p>
        </div>
        <div className="mt-4 grid gap-2 sm:flex sm:justify-end">
          <button
            className="rounded-md border border-border px-4 py-2.5 text-[13px] font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:outline-none"
            onClick={onNecessary}
            type="button"
          >
            {t("necessaryOnly")}
          </button>
          <button
            className="rounded-md border border-border px-4 py-2.5 text-[13px] font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:outline-none"
            onClick={onSettings}
            type="button"
          >
            {t("settings")}
          </button>
          <button
            className="rounded-md bg-primary px-4 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:outline-none"
            onClick={onAccept}
            type="button"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </section>
  );
}
