import { z } from "zod/v4";

export const SUPER_ANALYSIS_STAGES = [
  "analysis",
  "lookalikes",
  "links",
  "texts",
] as const;
export type SuperAnalysisStage = (typeof SUPER_ANALYSIS_STAGES)[number];
export const ANALYSIS_LOCALES = ["ka", "en", "ru", "tr"] as const;
const text = z.string().min(1).max(20000);
const refs = z.array(z.string().min(1)).max(100);
const values = z.strictObject({ en: text, ka: text, ru: text, tr: text });

export const superAnalysisResultSchema = z.strictObject({
  coverage: refs,
  edits: z
    .array(
      z.strictObject({
        after: values,
        before: z.strictObject({
          en: z.string(),
          ka: z.string(),
          ru: z.string(),
          tr: z.string(),
        }),
        evidenceIds: refs,
        field: text,
        reason: text,
      }),
    )
    .max(150),
  evidence: z
    .array(
      z.strictObject({
        claim: text,
        excerpt: text,
        id: text,
        locator: text,
        scope: text,
        status: z.enum(["verified", "unresolved", "contradicted"]),
        taxon: text,
        url: z.url().regex(/^https?:\/\//),
      }),
    )
    .max(150),
  findings: z
    .array(
      z.strictObject({
        evidenceIds: refs,
        message: text,
        severity: z.enum(["info", "review", "blocking"]),
        surface: text,
      }),
    )
    .max(150),
  lookalikes: z
    .array(
      z.strictObject({
        action: z.enum(["keep", "add", "remove", "review"]),
        difference: text,
        evidenceIds: refs,
        id: text,
        scenario: text,
      }),
    )
    .max(150),
  sources: z
    .array(
      z.strictObject({
        evidenceIds: refs,
        name: text,
        url: z.url().regex(/^https?:\/\//),
      }),
    )
    .max(100),
  stage: z.enum(SUPER_ANALYSIS_STAGES),
  summary: text,
});
export type SuperAnalysisJob = {
  currentStage: "validation" | null | SuperAnalysisStage;
  error: null | string;
  pullRequestUrl: null | string;
  runId: string;
  speciesId: string;
  status: "completed" | "failed" | "running";
  steps: Array<{ mode: SuperAnalysisStage; report: string }>;
};
export type SuperAnalysisResult = z.infer<typeof superAnalysisResultSchema>;
