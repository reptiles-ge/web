import { describe, expect, it } from "vitest";

import { isReleaseTag, latestReleaseTag } from "./releaseTag";

describe("isReleaseTag", () => {
  it("accepts only vMAJOR.MINOR.PATCH", () => {
    expect(isReleaseTag("v1.0.0")).toBe(true);
    expect(isReleaseTag("v12.34.56")).toBe(true);
    expect(isReleaseTag("1.0.0")).toBe(false);
    expect(isReleaseTag("v1.0")).toBe(false);
    expect(isReleaseTag("v1.0.0-rc.1")).toBe(false);
    expect(isReleaseTag("")).toBe(false);
  });
});

describe("latestReleaseTag", () => {
  it("picks the highest version numerically, not alphabetically", () => {
    expect(latestReleaseTag(["v1.9.0", "v1.10.0", "v1.2.3"])).toBe("v1.10.0");
    expect(latestReleaseTag(["v2.0.0", "v10.0.0", "v9.9.9"])).toBe("v10.0.0");
    expect(latestReleaseTag(["v1.0.9", "v1.0.10"])).toBe("v1.0.10");
  });

  it("ignores tags in any other format", () => {
    expect(
      latestReleaseTag(["nightly", "v1.0.0", "v2.0.0-rc.1", " v1.0.1 "]),
    ).toBe("v1.0.1");
  });

  it("returns null when there is no release tag", () => {
    expect(latestReleaseTag([])).toBeNull();
    expect(latestReleaseTag(["nightly", "1.0.0"])).toBeNull();
  });
});
