export const DRAFT_MERGE_BATCH_SIZE = 25;

export const SPECIES_STATUS_BATCH_SIZE = DRAFT_MERGE_BATCH_SIZE;

export function draftMergeBatches<T>(items: T[]) {
  const batches: T[][] = [];
  for (let start = 0; start < items.length; start += DRAFT_MERGE_BATCH_SIZE) {
    batches.push(items.slice(start, start + DRAFT_MERGE_BATCH_SIZE));
  }
  return batches;
}
