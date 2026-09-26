import { describe, expect, it } from "vitest";

import {
  confirmedRecordThresholdForSpecies,
  occurrenceStatusForCount,
} from "./halyomorphaOccurrences";

describe("occurrenceStatusForCount", () => {
  it("marks fewer than five records as recorded only", () => {
    expect(occurrenceStatusForCount(0)).toBe("recorded-only");
    expect(occurrenceStatusForCount(4)).toBe("recorded-only");
    expect(occurrenceStatusForCount(5)).toBe("confirmed");
  });

  it("allows species-specific confirmation thresholds", () => {
    expect(occurrenceStatusForCount(0, 1)).toBe("recorded-only");
    expect(occurrenceStatusForCount(1, 1)).toBe("confirmed");
    const platycepsThreshold =
      confirmedRecordThresholdForSpecies("platyceps-najadum");
    expect(occurrenceStatusForCount(2, platycepsThreshold)).toBe(
      "recorded-only",
    );
    expect(occurrenceStatusForCount(3, platycepsThreshold)).toBe("confirmed");
  });
});
