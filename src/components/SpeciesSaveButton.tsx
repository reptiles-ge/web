"use client";

import { Bookmark, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { SavedToast, savedToastButtonClass } from "@/components/SavedToast";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { toggleSavedSpecies, useIsSaved } from "@/lib/savedSpecies";

const TOAST_MS = 6000;

export function SpeciesSaveButton({
  name,
  speciesId,
}: {
  name: string;
  speciesId: string;
}) {
  const t = useTranslations("nav");
  const saved = useIsSaved(speciesId);
  const [toast, setToast] = useState(0);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(0), TOAST_MS);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const toggle = () => {
    const next = toggleSavedSpecies(speciesId);
    setToast(next ? Date.now() : 0);
  };

  return (
    <>
      <span className="group/save pointer-events-auto relative inline-flex">
        <button
          aria-label={saved ? t("unsave") : t("save")}
          aria-pressed={saved}
          className={cn(
            "inline-flex size-[46px] cursor-pointer items-center justify-center rounded-full border text-white transition-[background-color,border-color,scale] duration-200 ease-[cubic-bezier(.3,1.6,.5,1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:size-[52px]",
            saved
              ? "border-primary bg-primary lg:scale-[1.06] dark:border-[#2f6b4f] dark:bg-[#2f6b4f]"
              : "border-white/26 bg-white/8 hover:bg-white/14",
          )}
          onClick={toggle}
          type="button"
        >
          <Bookmark
            aria-hidden="true"
            className="size-[18px]"
            fill={saved ? "currentColor" : "none"}
            strokeWidth={1.75}
          />
        </button>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 hidden -translate-x-1/2 rounded-lg bg-white px-2.5 py-1.5 text-[12px] font-semibold whitespace-nowrap text-[#1a211c] opacity-0 shadow-[0_8px_20px_rgba(14,20,17,0.3)] transition-opacity duration-150 group-focus-within/save:opacity-100 group-hover/save:opacity-100 lg:block"
        >
          {saved ? t("savedState") : t("save")}
        </span>
      </span>
      {toast && saved ? (
        <SavedToast className="lg:w-[520px]" key={toast}>
          <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[#2f6b4f] lg:size-[34px]">
            <Check
              aria-hidden="true"
              className="size-[15px] lg:size-4"
              strokeWidth={2.4}
            />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[14.5px] font-semibold lg:hidden">
              {t("savedState")}
            </span>
            <span className="hidden text-[15px] font-semibold lg:block">
              {t("savedToast", { name })}
            </span>
            <span className="mt-0.5 hidden items-center text-[12px] text-white/60 lg:flex">
              {t.rich("savedToastHint", {
                icon: () => (
                  <Bookmark
                    aria-hidden="true"
                    className="mx-1 size-[11px]"
                    strokeWidth={1.75}
                  />
                ),
              })}
            </span>
          </span>
          <Link
            className={cn(savedToastButtonClass, "bg-white text-[#1a211c]")}
            href="/saved"
          >
            {t("savedView")}
          </Link>
          <button
            className={cn(
              savedToastButtonClass,
              "bg-transparent px-2.5 text-white/82 hover:text-white lg:px-3.5",
            )}
            onClick={toggle}
            type="button"
          >
            {t("savedUndo")}
          </button>
        </SavedToast>
      ) : null}
    </>
  );
}
