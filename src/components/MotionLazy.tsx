"use client";

import type { ReactNode } from "react";

import { domAnimation, LazyMotion } from "framer-motion";

export function MotionLazy({ children }: { children: ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
