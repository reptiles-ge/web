"use client";

import type { ReactNode } from "react";

import { LazyMotion } from "framer-motion";

const loadFeatures = () =>
  import("@/components/motionFeatures").then((module) => module.default);

export function MotionLazy({ children }: { children: ReactNode }) {
  return <LazyMotion features={loadFeatures}>{children}</LazyMotion>;
}
