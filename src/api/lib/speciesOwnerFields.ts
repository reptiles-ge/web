import type { SpeciesRecord } from "../db/speciesRows";

import { ApiError } from "./errors";

const OWNER_FIELDS = ["checklistStatus", "featured"] as const;

export function assertAiKeepsOwnerFields(
  source: string,
  previous: SpeciesRecord,
  next: SpeciesRecord,
) {
  if (source !== "ai") return;
  const changed = OWNER_FIELDS.filter((key) => previous[key] !== next[key]);
  if (changed.length === 0) return;
  throw new ApiError(
    400,
    "invalid_request",
    "An AI change cannot set the checklist status or the featured flag",
    changed.map((key) => ({
      message: `${key} is set by the owner`,
      path: [key],
    })),
  );
}
