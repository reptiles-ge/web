const DRAFT_FIELD_DEFAULTS = {
  checklistStatus: null,
  class: null,
  featured: false,
  fieldRecords: [],
  order: null,
  rangeMap: null,
} as const;

export function withDraftFallbacks<T extends object>(
  record: T,
  live: null | object,
): T {
  const filled = { ...record } as Record<string, unknown>;
  const source = (live ?? {}) as Record<string, unknown>;
  for (const [key, fallback] of Object.entries(DRAFT_FIELD_DEFAULTS)) {
    if (filled[key] === undefined) filled[key] = source[key] ?? fallback;
  }
  return filled as T;
}
