import { describe, expect, it } from "vitest";

import {
  formatContentDate,
  formatContentDateShort,
  formatContentMonth,
  formatPhotoDate,
} from "@/lib/formatDate";
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

describe("formatContentDateShort", () => {
  const now = new Date("2026-10-24T12:00:00.000Z");

  it("formats a short date in each live locale", () => {
    expect(formatContentDateShort("2026-09-27", "en")).toBe("27 Sep 2026");
    expect(formatContentDateShort("2026-09-27", "ka")).toBe("27 სექ 2026");
    expect(formatContentDateShort("2026-09-27", "ru")).toBe("27 сент. 2026");
    expect(formatContentDateShort("2026-09-27", "tr")).toBe("27 Eyl 2026");
  });

  it("drops the year only within the current year", () => {
    expect(
      formatContentDateShort("2026-10-14", "ka", {
        now,
        omitCurrentYear: true,
      }),
    ).toBe("14 ოქტ");
    expect(
      formatContentDateShort("2025-10-14", "ka", {
        now,
        omitCurrentYear: true,
      }),
    ).toBe("14 ოქტ 2025");
  });

  it("returns an unparseable value unchanged", () => {
    expect(formatContentDateShort("soon", "en")).toBe("soon");
  });
});

describe("formatContentMonth", () => {
  it("formats a standalone month heading", () => {
    expect(formatContentMonth("2026-09-23", "ka")).toBe("სექტემბერი 2026");
    expect(formatContentMonth("2026-09-23", "en")).toBe("September 2026");
    expect(formatContentMonth("2026-09-23", "ru")).toBe("сентябрь 2026");
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
