import { describe, expect, it } from "vitest";

import {
  MAX_FEEDBACK_LENGTH,
  needsFeedback,
  normalizeFeedback,
} from "@/lib/ratingFeedback";

describe("needsFeedback", () => {
  it("asks for a reason below 5 stars only", () => {
    expect([1, 2, 3, 4, 5].map(needsFeedback)).toEqual([
      true,
      true,
      true,
      true,
      false,
    ]);
  });
});

describe("normalizeFeedback", () => {
  it("trims the text and keeps line breaks", () => {
    expect(normalizeFeedback("  slow\r\n\r\n\r\n\r\nphotos  ")).toBe(
      "slow\n\nphotos",
    );
  });

  it("drops control and invisible characters", () => {
    expect(normalizeFeedback("a\u0000b​c‮d")).toBe("abcd");
  });

  it.each([undefined, null, 5, "", "   ", "ab", "​​ab"])(
    "rejects %j",
    (value) => {
      expect(normalizeFeedback(value)).toBeNull();
    },
  );

  it("counts characters, not UTF-16 units", () => {
    expect(normalizeFeedback("🐍🐍🐍")).toBe("🐍🐍🐍");
    expect(normalizeFeedback("🐍".repeat(MAX_FEEDBACK_LENGTH))).not.toBeNull();
    expect(normalizeFeedback("a".repeat(MAX_FEEDBACK_LENGTH + 1))).toBeNull();
  });
});
