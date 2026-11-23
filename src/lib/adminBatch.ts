export const ADMIN_BATCH_SIZE = 25;

export function adminBatches<T>(items: T[]) {
  const batches: T[][] = [];
  for (let start = 0; start < items.length; start += ADMIN_BATCH_SIZE) {
    batches.push(items.slice(start, start + ADMIN_BATCH_SIZE));
  }
  return batches;
}
