import { addedPageTalk } from "@/lib/pageTalkProse";

import type { SpeciesRecord } from "../db/speciesRows";

import { ApiError } from "./errors";

export function assertNoAddedPageTalk(
  previous: null | SpeciesRecord,
  next: SpeciesRecord,
) {
  const hits = addedPageTalk(previous, next);
  if (hits.length === 0) return;
  throw new ApiError(
    400,
    "invalid_request",
    "The change adds text about the page, map or sources instead of the animal",
    hits.map((hit) => ({
      message: `Page talk: “${hit.match}”`,
      path: [
        ...(hit.locale === "ka" ? ["base"] : ["translations", hit.locale]),
        ...hit.field.split("."),
      ],
    })),
  );
}
