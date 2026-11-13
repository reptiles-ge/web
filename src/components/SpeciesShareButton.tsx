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
      <button
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={t("share")}
        className="pointer-events-auto inline-flex size-[46px] cursor-pointer items-center justify-center rounded-full border border-white/26 bg-white/8 text-white transition-[background-color,border-color] duration-200 hover:bg-white/14 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:size-[52px]"
        onClick={() => setOpen(true)}
        title={t("share")}
        type="button"
      >
        <Share aria-hidden="true" className="size-[18px]" strokeWidth={1.75} />
      </button>
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
