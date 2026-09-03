"use client";

import { AnimatePresence } from "framer-motion";
import { m } from "framer-motion";
import { X } from "lucide-react";
import {
  type ReactNode,
  type RefObject,
  useEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";

import { MotionLazy } from "@/components/MotionLazy";
import { cn } from "@/lib/cn";

const panelTransition = { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const };
const sheetTransition = { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const };

type OverlayPanelProps = {
  closeLabel: string;
  desktopClassName?: string;
  desktopContent: ReactNode;
  mobileContent: ReactNode;
  mobileHeader?: ReactNode;
  mobileSheetClassName?: string;
  onClose: () => void;
  open: boolean;
  panelId?: string;
  panelRole?: "dialog" | "listbox";
  rootRef: RefObject<HTMLElement | null>;
  title: string;
};

const emptySubscribe = () => () => {};

export function OverlayPanel({
  closeLabel,
  desktopClassName = "w-[360px]",
  desktopContent,
  mobileContent,
  mobileHeader,
  mobileSheetClassName,
  onClose,
  open,
  panelId,
  panelRole,
  rootRef,
  title,
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

  return (
    <MotionLazy>
      <AnimatePresence>
        {open ? (
          <m.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={cn(
              "absolute top-full right-0 z-50 mt-3 hidden origin-top overflow-hidden rounded-[22px] border border-border/70 bg-card/95 shadow-[0_24px_60px_rgba(14,20,17,0.16)] backdrop-blur-2xl md:block",
              desktopClassName,
            )}
            exit={{ opacity: 0, scale: 0.98, y: -4 }}
            id={panelId}
            initial={{ opacity: 0, scale: 0.98, y: -6 }}
            key="overlay-panel"
            role={panelRole}
            transition={panelTransition}
          >
            {desktopContent}
          </m.div>
        ) : null}
      </AnimatePresence>
      {mounted ? (
        <OverlayMobileSheet
          closeLabel={closeLabel}
          mobileContent={mobileContent}
          mobileHeader={mobileHeader}
          mobileSheetClassName={mobileSheetClassName}
          onClose={onClose}
          open={open}
          sheetRef={sheetRef}
          title={title}
        />
      ) : null}
    </MotionLazy>
  );
}

function OverlayMobileSheet({
  closeLabel,
  mobileContent,
  mobileHeader,
  mobileSheetClassName,
  onClose,
  open,
  sheetRef,
  title,
}: {
  closeLabel: string;
  mobileContent: ReactNode;
  mobileHeader?: ReactNode;
  mobileSheetClassName?: string;
  onClose: () => void;
  open: boolean;
  sheetRef: RefObject<HTMLDivElement | null>;
  title: string;
}) {
  return createPortal(
    <AnimatePresence>
      {open ? (
        <m.button
          animate={{ opacity: 1 }}
          aria-label={closeLabel}
          className="fixed inset-0 z-80 bg-ink/55 backdrop-blur-[2px] md:hidden"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          key="overlay-backdrop"
          onClick={onClose}
          transition={{ duration: 0.22 }}
          type="button"
        />
      ) : null}
      {open ? (
        <m.div
          animate={{ opacity: 1, y: 0 }}
          aria-label={title}
          aria-modal="true"
          className={cn(
            "fixed inset-x-0 bottom-0 z-80 flex max-h-[92dvh] flex-col rounded-t-[28px] bg-card shadow-[0_-18px_60px_rgba(14,20,17,0.28)] md:hidden",
            mobileSheetClassName,
          )}
          exit={{ opacity: 0.96, y: "100%" }}
          initial={{ opacity: 0.96, y: "100%" }}
          key="overlay-sheet"
          ref={sheetRef}
          role="dialog"
          transition={sheetTransition}
        >
          <div className="flex shrink-0 flex-col items-center px-4 pt-3">
            <span
              aria-hidden="true"
              className="mb-3 h-1 w-10 rounded-full bg-border"
            />
            <div className="flex w-full items-center justify-between gap-3 pb-3">
              <h2 className="font-display text-[18px] font-semibold text-foreground">
                {title}
              </h2>
              <button
                aria-label={closeLabel}
                className="flex size-9 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground"
                onClick={onClose}
                type="button"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>
            {mobileHeader}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[max(1rem,env(safe-area-inset-bottom))]">
            {mobileContent}
          </div>
        </m.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
