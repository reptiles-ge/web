"use client";

import { ProgressProvider } from "@bprogress/next/app";

const PROGRESS_OPTIONS = { showSpinner: false };

export function NavigationProgress() {
  return (
    <ProgressProvider
      color="var(--primary)"
      height="3px"
      options={PROGRESS_OPTIONS}
    />
  );
}
