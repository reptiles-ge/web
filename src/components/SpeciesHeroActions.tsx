"use client";

import { Bookmark, Check, Share } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useSyncExternalStore } from "react";

import { trackEvent } from "@/lib/analytics";

const STORAGE_KEY = "reptiles:saved-species";
const CHANGE_EVENT = "reptiles:saved-species-change";

export function SpeciesHeroActions({
  name,
  speciesId,
}: {
  name: string;
  speciesId: string;
}) {
  const t = useTranslations("profile");
  const saved = useSyncExternalStore(
    subscribe,
    () => savedIds().includes(speciesId),
    () => false,
  );
  const [copied, setCopied] = useState(false);

  function onSave() {
    try {
      const ids = savedIds();
      const next = saved
        ? ids.filter((id) => id !== speciesId)
        : [...new Set([...ids, speciesId])];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(CHANGE_EVENT));
    } catch {
      return;
    }
  }

  async function onShare() {
    const url = window.location.href;
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title: name, url });
        trackEvent("species_share", { method: "share", species_id: speciesId });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
      trackEvent("species_share", { method: "copy", species_id: speciesId });
    } catch {
      return;
    }
  }

  const actionClass =
    "inline-flex h-[52px] items-center justify-center gap-2 rounded-full border border-white/25 bg-white/8 text-[15px] font-medium text-white transition-[transform,background-color] hover:-translate-y-0.5 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white";

  return (
    <>
      <button
        aria-pressed={saved}
        className={`${actionClass} px-5`}
        onClick={onSave}
        type="button"
      >
        <Bookmark aria-hidden="true" className="size-[18px]" />
        {saved ? t("saved") : t("save")}
      </button>
      <button
        aria-label={copied ? t("linkCopied") : t("share")}
        className={`${actionClass} w-[52px]`}
        onClick={onShare}
        title={copied ? t("linkCopied") : t("share")}
        type="button"
      >
        {copied ? (
          <Check aria-hidden="true" className="size-[18px]" />
        ) : (
          <Share aria-hidden="true" className="size-[18px]" />
        )}
      </button>
    </>
  );
}

function savedIds() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(stored)
      ? stored.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}
