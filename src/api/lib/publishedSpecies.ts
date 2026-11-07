import type { AppLocale } from "@/i18n/routing";

import type { ApiDatabase } from "../db/database";

import { findPublishedSpeciesId } from "../db/species";
import { ApiError } from "./errors";

export async function requirePublishedSpeciesId(
  db: ApiDatabase,
  slug: string,
  locale: AppLocale,
) {
  const id = await findPublishedSpeciesId(db, slug, locale);
  if (!id) throw new ApiError(404, "not_found", "Species not found");
  return id;
}
