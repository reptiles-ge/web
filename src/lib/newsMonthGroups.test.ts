import { describe, expect, it } from "vitest";

import { groupNewsByMonth } from "@/lib/newsMonthGroups";

describe("groupNewsByMonth", () => {
  it("keeps month order and item order", () => {
    const items = [
      { card: null, id: "a", monthKey: "2026-10" },
      { card: null, id: "b", monthKey: "2026-10" },
      { card: null, id: "c", monthKey: "2026-09" },
    ];
    expect(
      groupNewsByMonth(items).map((group) => [
        group.key,
        group.items.map((item) => item.id),
      ]),
    ).toEqual([
      ["2026-10", ["a", "b"]],
      ["2026-09", ["c"]],
    ]);
  });
});
