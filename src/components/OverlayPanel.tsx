"use client";

import { AnimatePresence } from "framer-motion";
import { MotionLazy, m } from "@/components/MotionLazy";
import { X } from "lucide-react";
import {
  useEffect,
  useRef,
  useSyncExternalStore,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";

const panelTransition = { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const };
const sheetTransition = { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const };

type OverlayPanelProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  rootRef: RefObject<HTMLElement | null>;
  panelId?: string;
  panelRole?: "listbox" | "dialog";
  desktopClassName?: string;
  mobileSheetClassName?: string;
  mobileHeader?: ReactNode;
  desktopContent: ReactNode;
  mobileContent: ReactNode;
};

const emptySubscribe = () => () => {};

export function OverlayPanel({
  open,
  onClose,
  title,
  closeLabel,
  rootRef,
  panelId,
  panelRole,
  desktopClassName = "w-[360px]",
  mobileSheetClassName,
  mobileHeader,
  desktopContent,
  mobileContent,
}: OverlayPanelProps) {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const sheetRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (
        rootRef.current?.contains(target) ||
        sheetRef.current?.contains(target)
      ) {
        return;
      }
      onCloseRef.current();
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCloseRef.current();
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, rootRef]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const media = window.matchMedia("(max-width: 767px)");

    function syncBodyLock() {
      document.body.style.overflow = media.matches
        ? "hidden"
        : previousOverflow;
    }

    syncBodyLock();
    media.addEventListener("change", syncBodyLock);
    return () => {
      media.removeEventListener("change", syncBodyLock);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const mobileSheet = mounted
    ? createPortal(
        <AnimatePresence>
          {open ? (
            <>
              <m.button
                key="overlay-backdrop"
                type="button"
                aria-label={closeLabel}
                className="fixed inset-0 z-[80] bg-ink/55 backdrop-blur-[2px] md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                onClick={onClose}
              />
              <m.div
                key="overlay-sheet"
                ref={sheetRef}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                className={`fixed inset-x-0 bottom-0 z-[80] flex max-h-[92dvh] flex-col rounded-t-[28px] bg-card shadow-[0_-18px_60px_rgba(14,20,17,0.28)] md:hidden ${mobileSheetClassName ?? ""}`}
                initial={{ opacity: 0.96, y: "100%" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0.96, y: "100%" }}
                transition={sheetTransition}
              >
                <div className="flex shrink-0 flex-col items-center px-4 pt-3">
                  <span
                    className="mb-3 h-1 w-10 rounded-full bg-border"
                    aria-hidden="true"
                  />
                  <div className="flex w-full items-center justify-between gap-3 pb-3">
                    <h2 className="font-display text-[18px] font-semibold text-foreground">
                      {title}
                    </h2>
                    <button
                      type="button"
                      aria-label={closeLabel}
                      onClick={onClose}
                      className="flex size-9 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <X className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                  {mobileHeader}
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[max(1rem,env(safe-area-inset-bottom))]">
                  {mobileContent}
                </div>
              </m.div>
            </>
          ) : null}
        </AnimatePresence>,
        document.body,
      )
    : null;

  return (
    <MotionLazy>
      <AnimatePresence>
        {open ? (
          <m.div
            id={panelId}
            key="overlay-panel"
            role={panelRole}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={panelTransition}
            className={`absolute right-0 top-full z-50 mt-3 hidden origin-top overflow-hidden rounded-[22px] border border-border/70 bg-card/95 shadow-[0_24px_60px_rgba(14,20,17,0.16)] backdrop-blur-2xl md:block ${desktopClassName}`}
          >
            {desktopContent}
          </m.div>
        ) : null}
      </AnimatePresence>
      {mobileSheet}
    </MotionLazy>
  );
}
