"use client";

import { Link2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import type { SpeciesShareParts } from "@/lib/speciesShareText";

import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { speciesShareTargets } from "@/lib/speciesShareTargets";

const COPIED_MS = 2000;

export type SpeciesShareDialogProps = {
  ogImage: string;
  onClose: () => void;
  share: SpeciesShareParts;
  speciesId: string;
};

export function SpeciesShareDialog({
  ogImage,
  onClose,
  share,
  speciesId,
}: SpeciesShareDialogProps) {
  const t = useTranslations("profile");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), COPIED_MS);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(share.url);
    } catch {
      return;
    }
    setCopied(true);
    trackEvent("species_share", { method: "copy", species_id: speciesId });
  }

  const close = () => dialogRef.current?.close();
  const targets = speciesShareTargets({ text: share.heading, url: share.url });

  return (
    <dialog
      aria-label={t("share")}
      className="fixed inset-0 z-80 m-0 hidden size-full max-h-none max-w-none flex-col items-center justify-end border-0 bg-transparent p-0 text-foreground backdrop:bg-ink/55 backdrop:backdrop-blur-[6px] open:flex backdrop:motion-safe:animate-[share-backdrop-in_0.22s_ease] md:justify-center md:p-6"
      onClose={onClose}
      ref={dialogRef}
    >
      <button
        aria-label={t("close")}
        className="absolute inset-0 cursor-default"
        onClick={close}
        tabIndex={-1}
        type="button"
      />
      <div className="relative flex max-h-[92dvh] w-full flex-col rounded-t-[32px] bg-card shadow-[0_-20px_60px_rgba(0,0,0,0.35)] motion-safe:animate-[share-sheet-in_0.32s_cubic-bezier(.22,1,.36,1)] md:max-w-[480px] md:rounded-[36px] md:shadow-[0_30px_80px_rgba(0,0,0,0.4)] md:motion-safe:animate-[share-dialog-in_0.22s_cubic-bezier(.22,1,.36,1)]">
        <div className="min-h-0 overflow-y-auto overscroll-contain px-5 pt-5 pb-[max(1.375rem,env(safe-area-inset-bottom))] md:px-7 md:pt-6 md:pb-7">
          <span
            aria-hidden="true"
            className="mx-auto mb-3.5 block h-1 w-10 rounded-full bg-border md:hidden"
          />
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-[22px] leading-[1.2] font-semibold text-foreground md:text-[24px]">
                {t("share")}
              </h2>
              <p className="mt-1 text-[13.5px] text-muted-foreground">
                {t("shareHint")}
              </p>
            </div>
            <button
              aria-label={t("close")}
              className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              onClick={close}
              ref={closeRef}
              type="button"
            >
              <X
                aria-hidden="true"
                className="size-[17px]"
                strokeWidth={1.75}
              />
            </button>
          </div>
          <div className="mt-[18px] aspect-1200/630 overflow-hidden rounded-3xl bg-ink shadow-[0_18px_44px_rgba(14,20,17,0.22)]">
            <img
              alt=""
              className="block size-full object-cover"
              decoding="async"
              height={630}
              src={ogImage}
              width={1200}
            />
          </div>
          <div className="mt-3.5 flex h-14 items-center gap-2 rounded-full bg-secondary pr-1.5 pl-[18px]">
            <Link2
              aria-hidden="true"
              className="size-4 shrink-0 text-muted-foreground"
              strokeWidth={1.75}
            />
            <span className="min-w-0 flex-1 truncate text-[14.5px] text-foreground">
              {share.displayUrl}
            </span>
            <button
              className={cn(
                "h-11 shrink-0 cursor-pointer rounded-full px-5 text-[14px] font-semibold text-white transition-[translate,filter,background-color] hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                copied ? "bg-[#2f6b4f]" : "bg-ink",
              )}
              onClick={onCopy}
              type="button"
            >
              {copied ? t("shareCopied") : t("shareCopy")}
            </button>
            <span aria-live="polite" className="sr-only">
              {copied ? t("linkCopied") : ""}
            </span>
          </div>
          <ul
            aria-label={t("shareVia")}
            className="mt-3.5 grid grid-cols-3 gap-2"
          >
            {targets.map((target) => (
              <li className="contents" key={target.id}>
                <a
                  className="flex h-[46px] items-center justify-center rounded-full border border-border bg-card text-[14px] font-medium text-foreground transition-[translate,filter] hover:-translate-y-0.5 hover:brightness-[1.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  href={target.href}
                  onClick={() =>
                    trackEvent("species_share", {
                      method: target.id,
                      species_id: speciesId,
                    })
                  }
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {target.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </dialog>
  );
}
