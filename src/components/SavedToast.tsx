"use client";

import type { ReactNode } from "react";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/cn";

export const savedToastButtonClass =
  "inline-flex h-9 shrink-0 cursor-pointer items-center rounded-full px-3.5 text-[13.5px] font-semibold whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white max-lg:h-[38px]";

export function SavedToast({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  if (!mounted) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-x-3 bottom-5 z-70 motion-safe:animate-[saved-toast-in_0.28s_cubic-bezier(.2,.9,.3,1.2)] lg:inset-x-auto lg:bottom-8 lg:left-1/2 lg:-translate-x-1/2",
        className,
      )}
      role="status"
    >
      <div className="flex items-center gap-2.5 rounded-[18px] bg-[#1a211c] py-2 pr-2 pl-3 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_20px_50px_rgba(14,20,17,0.4)] lg:gap-3.5 lg:py-2.5 lg:pr-2.5 lg:pl-4">
        {children}
      </div>
    </div>,
    document.body,
  );
}

function noopSubscribe() {
  return () => {};
}
