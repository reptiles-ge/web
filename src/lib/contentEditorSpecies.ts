import {
  type AdminSpeciesRecord,
  proposeAdminSpeciesDraft,
  readAdminSpecies,
} from "@/lib/adminSpeciesApi";
import {
  editorFields,
  type EditorRequest,
  validateEditorResult,
  verifyEditorSelection,
} from "@/lib/contentEditor";
import { transformWithAgent } from "@/lib/contentEditorAgent";
import {
  draftReviewUrl,
  finalizeEditorValues,
  isSpeciesEditorField,
} from "@/lib/contentEditorTarget";
import { toSiteDateTime } from "@/lib/siteTime";
import { kaToSlug } from "@/lib/slugify";
import {
  readRecordField,
  type RecordLocale,
  writeRecordField,
} from "@/lib/speciesRecordFields";

const LOCALES: RecordLocale[] = ["ka", "en", "ru", "tr"];

export async function proposeSpeciesEdit(
  input: EditorRequest,
  transform = transformWithAgent,
) {
  const { field, id } = input;
  if (!isSpeciesEditorField(field))
    throw new Error("Unsupported species field");
  const { record, version } = await readAdminSpecies(id);
  const original = (locale: RecordLocale) =>
    readRecordField(record, locale, field);
  const allowMissing = editorFields.some((candidate) => candidate === field);
  for (const locale of LOCALES) {
    if (!original(locale).trim() && (locale === "ka" || !allowMissing)) {
      throw new Error(`Missing ${locale} content`);
    }
  }
  const selection = verifyEditorSelection(original("ka"), input);
  const values = finalizeEditorValues(
    validateEditorResult(await transform(selection), selection),
    original,
  );
  if (
    field === "commonName" &&
    kaToSlug(values.ka) !== kaToSlug(original("ka"))
  ) {
    throw new Error("Species name edit would change its public URL");
  }
  const draft: AdminSpeciesRecord = structuredClone(record);
  const changed = LOCALES.filter(
    (locale) => values[locale] !== original(locale),
  );
  if (!changed.length) throw new Error("The edit changed nothing");
  for (const locale of changed)
    writeRecordField(draft, locale, field, values[locale]);
  draft.base.updatedAt = toSiteDateTime(new Date());
  const { draftId } = await proposeAdminSpeciesDraft(id, {
    baseVersion: version,
    record: draft,
    summary: `Edit ${field}`,
  });
  return { reviewUrl: draftReviewUrl(id, draftId) };
}
