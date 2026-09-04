import { describe, expect, it } from "vitest";

import { formatContentDate, formatPhotoDate } from "@/lib/formatDate";
import { parseToSiteDateTime, toSiteDateTime } from "@/lib/siteTime";

describe("siteTime", () => {
  it("stores date-only values at midnight in Asia/Tbilisi", () => {
    expect(parseToSiteDateTime("2026-09-04")).toBe("2026-09-04T00:00:00+04:00");
  });

  it("keeps an explicit offset in Georgia time", () => {
    expect(parseToSiteDateTime("2026-09-04T10:11:12+04:00")).toBe(
      "2026-09-04T10:11:12+04:00",
    );
  });

  it("rejects invalid timestamps", () => {
    expect(parseToSiteDateTime("not-a-date")).toBeNull();
  });

  it("formats UTC instants in Asia/Tbilisi without DST shift", () => {
    expect(toSiteDateTime(new Date("2026-01-15T12:00:00.000Z"))).toBe(
      "2026-01-15T16:00:00+04:00",
    );
    expect(toSiteDateTime(new Date("2026-09-04T20:00:00.000Z"))).toBe(
      "2026-09-05T00:00:00+04:00",
    );
  });
});

describe("formatContentDate", () => {
  it("formats a full date in each live locale", () => {
    expect(formatContentDate("2026-09-04", "en")).toBe("4 September 2026");
    expect(formatContentDate("2026-09-04", "ka")).toBe("4 სექტემბერი 2026");
    expect(formatContentDate("2026-09-04", "ru")).toBe("4 сентября 2026");
    expect(formatContentDate("2026-09-04", "tr")).toBe("4 Eylül 2026");
  });
});

describe("formatPhotoDate", () => {
  it("keeps a year-only credit", () => {
    expect(formatPhotoDate("2021", "en")).toBe("2021");
  });

  it("formats year-month credits", () => {
    expect(formatPhotoDate("2024-06", "en")).toBe("June 2024");
    expect(formatPhotoDate("2024-06", "ka")).toBe("ივნისი 2024");
    expect(formatPhotoDate("2024-06", "ru")).toBe("июнь 2024");
  });
});
