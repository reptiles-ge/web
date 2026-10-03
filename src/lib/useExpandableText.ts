"use client";

import { useLayoutEffect, useRef, useState } from "react";

const SAFE_TOP = 144;
const MIN_DURATION = 260;
const MAX_DURATION = 600;

export function useExpandableText(lines: number) {
  const [open, setOpen] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const expandFromRef = useRef<null | number>(null);
  const animationRef = useRef<Animation | null>(null);

  useLayoutEffect(() => {
    const text = textRef.current;
    if (!text) return;

    if (!open) {
      animationRef.current?.cancel();
      animationRef.current = null;
      return;
    }

    const from = expandFromRef.current;
    expandFromRef.current = null;
    if (from === null) return;

    animationRef.current = animateHeight(text, from, text.offsetHeight, "none");
  }, [open]);

  function toggle() {
    if (animationRef.current?.playState === "running") return;

    const text = textRef.current;
    if (!text || prefersReducedMotion()) {
      setOpen((value) => !value);
      return;
    }

    if (!open) {
      expandFromRef.current = text.offsetHeight;
      setOpen(true);
      return;
    }

    const from = text.offsetHeight;
    const to = Number.parseFloat(getComputedStyle(text).lineHeight) * lines;
    if (!(to < from)) {
      setOpen(false);
      return;
    }

    const startedAbove = text.getBoundingClientRect().top < SAFE_TOP;
    const animation = animateHeight(text, from, to, "forwards");
    animationRef.current = animation;
    if (startedAbove && buttonRef.current) {
      holdInPlace(buttonRef.current, animation);
    }
    animation.addEventListener("finish", () => {
      setOpen(false);
      if (!startedAbove) return;

      window.requestAnimationFrame(() => {
        if (text.getBoundingClientRect().top < SAFE_TOP) {
          text.scrollIntoView({ block: "start" });
        }
      });
    });
  }

  return { buttonRef, open, textRef, toggle };
}

function animateHeight(
  element: HTMLElement,
  from: number,
  to: number,
  fill: FillMode,
) {
  element.style.overflow = "hidden";
  const animation = element.animate(
    [{ height: `${from}px` }, { height: `${to}px` }],
    {
      duration: Math.min(
        MAX_DURATION,
        Math.max(MIN_DURATION, Math.abs(to - from) * 0.6),
      ),
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      fill,
    },
  );
  const release = () => {
    element.style.overflow = "";
  };
  animation.addEventListener("cancel", release);
  if (fill === "none") animation.addEventListener("finish", release);
  return animation;
}

function holdInPlace(anchor: HTMLElement, animation: Animation) {
  const top = anchor.getBoundingClientRect().top;

  function step() {
    const drift = anchor.getBoundingClientRect().top - top;
    if (Math.abs(drift) > 0.5) {
      window.scrollBy({ behavior: "instant", top: drift });
    }
    if (animation.playState === "running") {
      window.requestAnimationFrame(step);
    }
  }

  window.requestAnimationFrame(step);
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
