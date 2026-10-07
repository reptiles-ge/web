import type { DangerLevel } from "@/data/species";

const DANGER_PAGE_PATH = "/risk-to-humans" as const;

export const DANGER_LEVEL_ORDER = [
  "High",
  "Moderate",
  "Harmless",
] as const satisfies readonly DangerLevel[];

export const DANGER_LEVEL_HASH: Record<DangerLevel, string> = {
  Harmless: "harmless",
  High: "high",
  Moderate: "moderate",
};

export const HARMLESS_EXAMPLE_IDS = [
  "natrix-natrix",
  "natrix-tessellata",
  "coronella-austriaca",
  "telescopus-fallax",
  "pseudopus-apodus",
] as const;

export function dangerLevelTone(level: DangerLevel) {
  switch (level) {
    case "High":
      return {
        chip: "bg-destructive/15 text-destructive",
        dot: "bg-destructive",
        value: "text-destructive",
      };
    case "Moderate":
      return {
        chip: "bg-gold/20 text-gold",
        dot: "bg-gold",
        value: "text-gold",
      };
    default:
      return {
        chip: "bg-primary/15 text-primary",
        dot: "bg-primary",
        value: "text-primary",
      };
  }
}

export function dangerPageHref(level?: DangerLevel) {
  if (!level) {
    return { pathname: DANGER_PAGE_PATH };
  }

  return {
    hash: DANGER_LEVEL_HASH[level],
    pathname: DANGER_PAGE_PATH,
  };
}
