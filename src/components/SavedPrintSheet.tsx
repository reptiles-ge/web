"use client";

import { useTranslations } from "next-intl";
import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import type { AppLocale } from "@/i18n/routing";

import { Logo } from "@/components/Logo";
import { type SavedItem } from "@/components/useSavedCards";
import { printDate, RISK_SWATCH } from "@/lib/savedSpeciesFormat";

export function SavedPrintSheet({
  harmless,
  items,
  locale,
  pageUrl,
  venomous,
}: {
  harmless: number;
  items: SavedItem[];
  locale: AppLocale;
  pageUrl: string;
  venomous: number;
}) {
  const t = useTranslations("saved");
  const tDanger = useTranslations("danger");
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  if (!mounted) return null;
  const date = printDate(locale, new Date());

  return createPortal(
    <div
      className="hidden bg-white font-sans text-[#1a211c] antialiased print:block"
      data-print-sheet=""
      lang={locale}
    >
      <div className="flex items-center justify-between">
        <Logo
          className="gap-2.5"
          priority
          showWordmark
          size={36}
          wordmarkClassName="text-[16px]"
        />
        <span className="text-[12px] text-[#5c665f]">{date}</span>
      </div>
      <h1 className="mt-7 text-[34px] leading-[1.1] font-bold tracking-[-0.015em]">
        {t("printTitle")}
      </h1>
      <div className="mt-1.5 text-[13.5px] text-[#5c665f]">
        {t("printSummary", { count: items.length, harmless, venomous })}
      </div>
      {venomous > 0 ? (
        <div className="mt-5 flex items-center gap-3.5 rounded-xl border-2 border-[#b84336] px-4 py-3 text-[#7d2f25]">
          <span className="text-[26px] font-extrabold text-[#b84336]">112</span>
          <span className="text-[12.5px] leading-[1.45]">
            {t.rich("printEmergency", {
              b: (chunks) => <b>{chunks}</b>,
            })}
          </span>
        </div>
      ) : null}
      <div className="mt-[22px]">
        {items.map((item) => {
          const swatch = item.danger ? RISK_SWATCH[item.danger] : null;
          return (
            <div
              className="grid break-inside-avoid grid-cols-[96px_minmax(0,1fr)_150px] items-center gap-4 border-t border-[#dfe6dd] py-3"
              key={item.id}
            >
              <span className="relative block h-[72px] w-24 overflow-hidden rounded-[10px] bg-[#dddddd]">
                <img
                  alt=""
                  className="size-full object-cover"
                  decoding="sync"
                  loading="eager"
                  src={item.thumb}
                />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-[15px] font-bold">
                    {item.commonName}
                  </span>
                  <span className="text-[11.5px] text-[#5c665f] italic">
                    {item.scientificName}
                  </span>
                </div>
                {item.regions.length > 0 ? (
                  <div className="mt-1 text-[11.5px] leading-[1.45] text-[#39423c]">
                    {item.regions.join(", ")}
                  </div>
                ) : null}
                <div className="mt-[3px] text-[10.5px] text-[#8a948c]">
                  {item.publicUrl}
                </div>
              </div>
              <div className="text-right">
                {item.danger && swatch ? (
                  <span
                    className="inline-flex h-6 items-center gap-1.5 rounded-full border-[1.5px] px-2.5 text-[11px] font-bold"
                    style={{ borderColor: swatch.dot, color: swatch.text }}
                  >
                    <span
                      className="size-1.5 rounded-full"
                      style={{ background: swatch.dot }}
                    />
                    {tDanger(item.danger)}
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-[18px] flex justify-between gap-4 border-t border-[#dfe6dd] pt-3 text-[10.5px] text-[#8a948c]">
        <span>{t("printFooter")}</span>
        <span className="shrink-0">{pageUrl.replace(/^https?:\/\//, "")}</span>
      </div>
    </div>,
    document.body,
  );
}

function noopSubscribe() {
  return () => {};
}
