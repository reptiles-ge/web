import { describe, expect, it } from "vitest";

import { ADMIN_BATCH_SIZE, adminBatches } from "./adminBatch";

describe("adminBatches", () => {
  it("splits ids into batches the API accepts, in order", () => {
    const ids = Array.from({ length: 87 }, (_, i) => i + 1);
    const batches = adminBatches(ids);
    expect(batches.map((batch) => batch.length)).toEqual([25, 25, 25, 12]);
    expect(batches.flat()).toEqual(ids);
    expect(batches.every((batch) => batch.length <= ADMIN_BATCH_SIZE)).toBe(
      true,
    );
  });

  it("returns no batch for no ids", () => {
    expect(adminBatches([])).toEqual([]);
  });
});
