"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import type { OverlayPanelProps } from "@/components/OverlayPanelImpl";

const OverlayPanelImpl = dynamic(
  () =>
    import("@/components/OverlayPanelImpl").then((mod) => mod.OverlayPanelImpl),
  { ssr: false },
);

export function OverlayPanel(props: OverlayPanelProps) {
  const [ready, setReady] = useState(false);
  if (props.open && !ready) {
    setReady(true);
  }
  if (!ready) return null;
  return <OverlayPanelImpl {...props} />;
}
