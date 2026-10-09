import { describe, expect, it } from "vitest";

import {
  AI_PROFILES,
  CLAUDE_PROFILES,
  claudeProfileSettings,
  escalateEffort,
} from "@/lib/aiAgentProfiles";

describe("Claude stage profiles", () => {
  it("defines a profile for every AI task", () => {
    expect(Object.keys(CLAUDE_PROFILES).sort()).toEqual(
      [...AI_PROFILES].sort(),
    );
  });

  it("uses Opus for research and writing and Sonnet for mechanical stages", () => {
    expect(claudeProfileSettings("super:analysis", 0)).toEqual({
      effort: "high",
      model: "claude-opus-5-5",
    });
    expect(claudeProfileSettings("super:lookalikes", 0).effort).toBe("high");
    expect(claudeProfileSettings("super:texts", 0)).toEqual({
      effort: "medium",
      model: "claude-opus-5-5",
    });
    expect(claudeProfileSettings("super:links", 0)).toEqual({
      effort: "low",
      model: "claude-sonnet-5-5",
    });
  });
});

describe("dynamic effort", () => {
  it("raises effort one level per repair attempt up to high", () => {
    expect(escalateEffort("low", 1)).toBe("medium");
    expect(escalateEffort("low", 5)).toBe("high");
    expect(escalateEffort("medium", 1)).toBe("high");
    expect(escalateEffort("high", 1)).toBe("high");
  });

  it("never lowers an explicitly chosen max effort", () => {
    expect(escalateEffort("max", 0)).toBe("max");
    expect(escalateEffort("max", 1)).toBe("max");
  });

  it("applies per-profile overrides before escalation", () => {
    const overrides = {
      effort: { "super:analysis": "medium" as const },
      model: { "super:links": "claude-haiku-5-5" },
    };
    expect(claudeProfileSettings("super:analysis", 0, overrides).effort).toBe(
      "medium",
    );
    expect(claudeProfileSettings("super:analysis", 1, overrides).effort).toBe(
      "high",
    );
    expect(claudeProfileSettings("super:links", 0, overrides)).toEqual({
      effort: "low",
      model: "claude-haiku-5-5",
    });
  });
});
