export const AI_BACKENDS = ["claude", "codex"] as const;
export type AiBackend = (typeof AI_BACKENDS)[number];

export const CLAUDE_EFFORTS = ["low", "medium", "high", "max"] as const;
export type ClaudeEffort = (typeof CLAUDE_EFFORTS)[number];

export const AI_PROFILES = [
  "super:analysis",
  "super:lookalikes",
  "super:links",
  "super:texts",
  "page:analysis",
  "page:lookalikes",
  "page:links",
  "page:records",
  "frontmatter-repair",
  "editor",
] as const;
export type AiProfile = (typeof AI_PROFILES)[number];

export type AiProfileSettings = { effort: string; model: string };

const OPUS = "claude-opus-5-5";
const SONNET = "claude-sonnet-5-5";

export const CLAUDE_PROFILES: Record<
  AiProfile,
  { effort: ClaudeEffort; model: string }
> = {
  editor: { effort: "high", model: OPUS },
  "frontmatter-repair": { effort: "low", model: SONNET },
  "page:analysis": { effort: "high", model: OPUS },
  "page:links": { effort: "medium", model: SONNET },
  "page:lookalikes": { effort: "high", model: OPUS },
  "page:records": { effort: "medium", model: OPUS },
  "super:analysis": { effort: "high", model: OPUS },
  "super:links": { effort: "low", model: SONNET },
  "super:lookalikes": { effort: "high", model: OPUS },
  "super:texts": { effort: "medium", model: OPUS },
};

const ESCALATION_CEILING: ClaudeEffort = "high";

export function claudeProfileSettings(
  profile: AiProfile,
  attempt: number,
  overrides: {
    effort?: Partial<Record<AiProfile, ClaudeEffort>>;
    model?: Partial<Record<AiProfile, string>>;
  } = {},
): AiProfileSettings {
  const base = CLAUDE_PROFILES[profile];
  return {
    effort: escalateEffort(overrides.effort?.[profile] ?? base.effort, attempt),
    model: overrides.model?.[profile] ?? base.model,
  };
}

export function escalateEffort(effort: ClaudeEffort, attempt: number) {
  const start = CLAUDE_EFFORTS.indexOf(effort);
  const ceiling = Math.max(start, CLAUDE_EFFORTS.indexOf(ESCALATION_CEILING));
  return CLAUDE_EFFORTS[Math.min(start + Math.max(attempt, 0), ceiling)];
}

export const CODEX_SETTINGS: AiProfileSettings = {
  effort: "xhigh",
  model: "gpt-6-sol",
};
