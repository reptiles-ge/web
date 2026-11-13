"use client";

import { Share } from "lucide-react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useState } from "react";

import type { SpeciesShareDialogProps } from "@/components/SpeciesShareDialog";
import type { SpeciesShareParts } from "@/lib/speciesShareText";

const SpeciesShareDialog = dynamic(
  () =>
    import("@/components/SpeciesShareDialog").then(
      (mod) => mod.SpeciesShareDialog,
    ),
  { ssr: false },
);

export function SpeciesShareButton({
  ogImage,
  share,
  speciesId,
}: Pick<SpeciesShareDialogProps, "ogImage" | "speciesId"> & {
  share: SpeciesShareParts;
}) {
  const t = useTranslations("profile");
  const [open, setOpen] = useState(false);

  return (
    <>
      <span className="group/share pointer-events-auto relative inline-flex">
        <button
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-label={t("share")}
          className="inline-flex size-[46px] cursor-pointer items-center justify-center rounded-full border border-white/26 bg-white/8 text-white transition-[background-color,border-color] duration-200 hover:bg-white/14 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:size-[52px]"
          onClick={() => setOpen(true)}
          type="button"
        >
          <Share
            aria-hidden="true"
            className="size-[18px]"
            strokeWidth={1.75}
          />
        </button>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 hidden -translate-x-1/2 rounded-lg bg-white px-2.5 py-1.5 text-[12px] font-semibold whitespace-nowrap text-[#1a211c] opacity-0 shadow-[0_8px_20px_rgba(14,20,17,0.3)] transition-opacity duration-150 group-focus-within/share:opacity-100 group-hover/share:opacity-100 lg:block"
        >
          {t("share")}
        </span>
      </span>
      {open ? (
        <SpeciesShareDialog
          ogImage={ogImage}
          onClose={() => setOpen(false)}
          share={share}
          speciesId={speciesId}
        />
      ) : null}
    </>
  );
}
