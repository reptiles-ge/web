import { describe, expect, it } from "vitest";

import { lastDays, readViewDay } from "./viewRange";

describe("lastDays", () => {
  it("ends today and counts today as the first day", () => {
    const now = new Date("2026-10-24T10:00:00Z");
    expect(lastDays(1, now)).toEqual({ from: "2026-10-24", to: "2026-10-24" });
    expect(lastDays(7, now)).toEqual({ from: "2026-10-18", to: "2026-10-24" });
    expect(lastDays(30, now)).toEqual({ from: "2026-09-25", to: "2026-10-24" });
  });

  it("starts today at midnight in Tbilisi, not UTC", () => {
    const now = new Date("2026-10-24T20:30:00Z");
    expect(lastDays(1, now)).toEqual({ from: "2026-10-25", to: "2026-10-25" });
  });
});

describe("readViewDay", () => {
  it("keeps only real calendar days", () => {
    expect(readViewDay("2026-10-24")).toBe("2026-10-24");
    for (const value of ["2026-02-30", "2026-13-01", "today", "2026-1-01"]) {
      expect(readViewDay(value), value).toBeUndefined();
    }
  });
});
