import { execFileSync } from "node:child_process";

import { parseToSiteDateTime } from "../src/lib/siteTime";

export type ContentGitDates = {
  lastModified: (relativePath: string) => string | undefined;
  status: string;
};

function git(args: string[]): null | string {
  try {
    return execFileSync("git", args, {
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
      stdio: ["ignore", "pipe", "ignore"],
      timeout: 60_000,
    });
  } catch {
    return null;
  }
}

export function readContentGitDates(roots: string[]): ContentGitDates {
  const none = (status: string): ContentGitDates => ({
    lastModified: () => undefined,
    status,
  });

  const shallow = git(["rev-parse", "--is-shallow-repository"])?.trim();
  if (!shallow) return none("no git");
  if (shallow !== "false") return none("shallow clone, skipped");

  const log = git(["log", "--format=%x00%cI", "--name-only", "--", ...roots]);
  if (log === null) return none("git log failed");

  const dates = new Map<string, string>();
  let current: null | string = null;
  for (const line of log.split("\n")) {
    if (line.startsWith("\0")) {
      current = parseToSiteDateTime(line.slice(1).trim());
      continue;
    }
    const file = line.trim();
    if (!file || !current || dates.has(file)) continue;
    dates.set(file, current);
  }

  return {
    lastModified: (relativePath) => dates.get(relativePath),
    status: `${dates.size} files`,
  };
}

export function laterDateTime(
  base: string,
  candidate: string | undefined,
): string {
  if (!candidate) return base;
  const candidateTime = Date.parse(candidate);
  if (Number.isNaN(candidateTime)) return base;
  return candidateTime > Date.parse(base) ? candidate : base;
}
