export const SUPER_ANALYSIS_STAGES = [
  "analysis",
  "lookalikes",
  "links",
  "texts",
] as const;
export type SuperAnalysisJob = {
  currentStage: "validation" | null | SuperAnalysisStage;
  error: null | string;
  pullRequestUrl: null | string;
  resumable?: boolean;
  runId: string;
  speciesId: string;
  status: "completed" | "failed" | "running";
  steps: Array<{ mode: SuperAnalysisStage; report: string }>;
};
export type SuperAnalysisStage = (typeof SUPER_ANALYSIS_STAGES)[number];
