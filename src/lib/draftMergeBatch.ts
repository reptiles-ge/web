export const DRAFT_MERGE_BATCH_SIZE = 25;

export function draftMergeBatches(ids: number[]) {
  const batches: number[][] = [];
  for (let start = 0; start < ids.length; start += DRAFT_MERGE_BATCH_SIZE) {
    batches.push(ids.slice(start, start + DRAFT_MERGE_BATCH_SIZE));
  }
  return batches;
}
