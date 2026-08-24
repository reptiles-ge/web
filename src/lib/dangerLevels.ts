import type { DangerLevel } from "@/data/species";

export const DANGER_PAGE_PATH = "/risk-to-humans" as const;

export const DANGER_LEVEL_ORDER = [
  "High",
  "Moderate",
  "Harmless",
] as const satisfies readonly DangerLevel[];

export const DANGER_LEVEL_HASH: Record<DangerLevel, string> = {
  High: "high",
  Moderate: "moderate",
  Harmless: "harmless",
};

export const HARMLESS_EXAMPLE_IDS = [
  "natrix-natrix",
  "natrix-tessellata",
  "coronella-austriaca",
  "telescopus-fallax",
  "pseudopus-apodus",
] as const;

export function dangerPageHref(level?: DangerLevel) {
  if (!level) {
    return { pathname: DANGER_PAGE_PATH };
  }

  return {
    pathname: DANGER_PAGE_PATH,
    hash: DANGER_LEVEL_HASH[level],
  };
}
