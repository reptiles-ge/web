import { describe, expect, it } from "vitest";

import { occurrenceStatusForCount } from "./halyomorphaOccurrences";

describe("occurrenceStatusForCount", () => {
  it("marks fewer than five records as recorded only", () => {
    expect(occurrenceStatusForCount(0)).toBe("recorded-only");
    expect(occurrenceStatusForCount(4)).toBe("recorded-only");
    expect(occurrenceStatusForCount(5)).toBe("confirmed");
  });
});
