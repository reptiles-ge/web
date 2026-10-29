import { describe, expect, it } from "vitest";

import { DRAFT_MERGE_BATCH_SIZE, draftMergeBatches } from "./draftMergeBatch";

describe("draftMergeBatches", () => {
  it("splits ids into batches the API accepts, in order", () => {
    const ids = Array.from({ length: 87 }, (_, i) => i + 1);
    const batches = draftMergeBatches(ids);
    expect(batches.map((batch) => batch.length)).toEqual([25, 25, 25, 12]);
    expect(batches.flat()).toEqual(ids);
    expect(
      batches.every((batch) => batch.length <= DRAFT_MERGE_BATCH_SIZE),
    ).toBe(true);
  });

  it("returns no batch for no ids", () => {
    expect(draftMergeBatches([])).toEqual([]);
  });
});
