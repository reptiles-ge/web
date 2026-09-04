"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { Link } from "@/i18n/navigation";

export function ErrorFallback({ reset }: { reset: () => void }) {
  const t = useTranslations("errorPage");

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, follow";
    document.head.append(meta);
    return () => meta.remove();
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-6 py-24 lg:px-10 lg:py-32">
      <p className="text-[11px] font-medium tracking-[0.32em] text-muted-foreground uppercase">
        {t("eyebrow")}
      </p>
      <h1 className="mt-4 font-display text-display-title font-semibold">
        {t("title")}
      </h1>
      <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground">
        {t("body")}
      </p>
      <p className="mt-4 text-[14px] font-medium text-foreground">
        {t("emergency")}
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <button
          className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-[14px] font-medium text-background"
          onClick={reset}
          type="button"
        >
          {t("retry")}
        </button>
        <Link
          className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-[14px] font-medium"
          href="/"
        >
          {t("home")}
        </Link>
        <Link
          className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-[14px] font-medium"
          href="/contact"
        >
          {t("contact")}
        </Link>
      </div>
    </div>
  );
}
