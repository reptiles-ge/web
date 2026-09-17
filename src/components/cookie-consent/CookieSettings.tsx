"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

export function CookieSettings({
  analytics,
  onAcceptAll,
  onClose,
  onSave,
}: {
  analytics: boolean;
  onAcceptAll: () => void;
  onClose: () => void;
  onSave: (analytics: boolean) => void;
}) {
  const t = useTranslations("cookieConsent");
  const dialogRef = useRef<HTMLDivElement>(null);
  const [analyticsOn, setAnalyticsOn] = useState(analytics);

  useEffect(() => {
    dialogRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-60 flex items-end justify-center bg-ink/25 px-4 py-5 sm:items-center sm:py-8">
      <div
        aria-labelledby="cookie-settings-title"
        aria-modal="true"
        className="w-full max-w-lg rounded-md border border-border bg-card p-5 text-foreground shadow-[0_24px_70px_rgba(10,20,14,0.25)] focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none dark:shadow-[0_24px_70px_rgba(0,0,0,0.55)]"
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
              {t("settingsEyebrow")}
            </p>
            <h2
              className="mt-2 text-[20px] leading-tight font-semibold"
              id="cookie-settings-title"
            >
              {t("settingsTitle")}
            </h2>
          </div>
          <button
            aria-label={t("close")}
            className="inline-flex size-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:outline-none"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden className="size-4" />
          </button>
        </div>

        <div className="mt-5 space-y-3">
          <section className="rounded-md border border-border bg-background/55 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-[15px] font-semibold">
                  {t("necessaryTitle")}
                </h3>
                <p className="mt-1 text-[13px] leading-6 text-muted-foreground">
                  {t("necessaryDescription")}
                </p>
              </div>
              <span className="rounded-full bg-secondary px-3 py-1 text-[12px] font-medium text-foreground">
                {t("alwaysOn")}
              </span>
            </div>
          </section>

          <section className="rounded-md border border-border bg-background/55 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-[15px] font-semibold">
                  {t("analyticsTitle")}
                </h3>
                <p className="mt-1 text-[13px] leading-6 text-muted-foreground">
                  {t("analyticsDescription")}
                </p>
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2">
                <span className="sr-only">{t("analyticsToggle")}</span>
                <input
                  checked={analyticsOn}
                  className="size-5 rounded border-border accent-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:outline-none"
                  onChange={(event) => setAnalyticsOn(event.target.checked)}
                  type="checkbox"
                />
              </label>
            </div>
          </section>
        </div>

        <div className="mt-5 grid gap-2 sm:flex sm:justify-end">
          <button
            className="rounded-md border border-border px-4 py-2.5 text-[13px] font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:outline-none"
            onClick={() => onSave(analyticsOn)}
            type="button"
          >
            {t("save")}
          </button>
          <button
            className="rounded-md bg-primary px-4 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:outline-none"
            onClick={onAcceptAll}
            type="button"
          >
            {t("acceptAll")}
          </button>
        </div>
      </div>
    </div>
  );
}
