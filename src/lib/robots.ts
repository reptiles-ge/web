import type { Metadata } from "next";

export const INDEXABLE_ROBOTS = {
  follow: true,
  index: true,
  "max-image-preview": "large",
  "max-snippet": -1,
  "max-video-preview": -1,
} as const satisfies NonNullable<Metadata["robots"]>;

export const NOINDEX_FOLLOW_ROBOTS = {
  follow: true,
  index: false,
} as const satisfies NonNullable<Metadata["robots"]>;
