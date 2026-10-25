import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";

import { parseToSiteDateTime } from "../src/lib/siteTime";

export type ContentGitDates = {
  lastModified: (relativePath: string) => string | undefined;
  status: string;
};

export type MessageNamespaceGitDates = {
  lastModified: (file: string, namespace: string) => string | undefined;
  status: string;
};

type BlobChange = {
  date: string;
  file: string;
  newSha: string;
  oldSha: string;
};

const EMPTY_BLOB = /^0+$/;

let historyStatus: null | string | undefined;

function git(args: string[], input?: string): null | string {
  try {
    return execFileSync("git", args, {
      encoding: "utf8",
      input,
      maxBuffer: 64 * 1024 * 1024,
      stdio: [input === undefined ? "ignore" : "pipe", "pipe", "ignore"],
      timeout: 120_000,
    });
  } catch {
    return null;
  }
}

function fetchMissingBlobs(shas: string[]) {
  if (git(["config", "--get", "remote.origin.promisor"])?.trim() !== "true") {
    return;
  }
  git(
    [
      "-c",
      "fetch.negotiationAlgorithm=noop",
      "fetch",
      "--quiet",
      "--no-tags",
      "--no-write-fetch-head",
      "--filter=blob:none",
      "origin",
      "--stdin",
    ],
    `${shas.join("\n")}\n`,
  );
}

function gitBlobs(shas: string[]): Buffer | null {
  fetchMissingBlobs(shas);
  try {
    return execFileSync("git", ["cat-file", "--batch"], {
      input: `${shas.join("\n")}\n`,
      maxBuffer: 2 * 1024 * 1024 * 1024,
      stdio: ["pipe", "pipe", "ignore"],
      timeout: 120_000,
    });
  } catch {
    return null;
  }
}

function historyUnavailable(): null | string {
  if (historyStatus === undefined) historyStatus = loadHistory();
  return historyStatus;
}

function loadHistory(): null | string {
  const shallow = git(["rev-parse", "--is-shallow-repository"])?.trim();
  if (!shallow) return "no git";
  if (shallow === "false") return null;
  const deepened =
    git(["config", "remote.origin.promisor", "true"]) !== null &&
    git(["config", "remote.origin.partialclonefilter", "blob:none"]) !== null &&
    git([
      "fetch",
      "--quiet",
      "--unshallow",
      "--filter=blob:none",
      "--no-tags",
      "origin",
    ]) !== null;
  return deepened ? null : "shallow clone, history fetch failed";
}

export function readContentGitDates(roots: string[]): ContentGitDates {
  const none = (status: string): ContentGitDates => ({
    lastModified: () => undefined,
    status,
  });

  const unavailable = historyUnavailable();
  if (unavailable) return none(unavailable);

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

export function readMessageNamespaceGitDates(
  files: string[],
  nestedNamespaces: readonly string[] = [],
): MessageNamespaceGitDates {
  const none = (status: string): MessageNamespaceGitDates => ({
    lastModified: () => undefined,
    status,
  });

  const unavailable = historyUnavailable();
  if (unavailable) return none(unavailable);

  const log = git([
    "log",
    "--format=%x00%cI",
    "--raw",
    "--no-abbrev",
    "--no-renames",
    "--",
    ...files,
  ]);
  if (log === null) return none("git log failed");

  const changes = parseBlobChanges(log);
  const shas = new Set<string>();
  for (const change of changes) {
    for (const sha of [change.oldSha, change.newSha]) {
      if (!EMPTY_BLOB.test(sha)) shas.add(sha);
    }
  }
  const blobs = readBlobNamespaceHashes([...shas], nestedNamespaces);
  if (!blobs) return none("git cat-file failed");

  const empty = new Map<string, string>();
  const dates = new Map<string, string>();
  for (const change of changes) {
    const before = blobs.get(change.oldSha) ?? empty;
    const after = blobs.get(change.newSha) ?? empty;
    for (const namespace of new Set([...before.keys(), ...after.keys()])) {
      const key = `${change.file}\0${namespace}`;
      if (dates.has(key)) continue;
      if (before.get(namespace) === after.get(namespace)) continue;
      dates.set(key, change.date);
    }
  }

  return {
    lastModified: (file, namespace) => dates.get(`${file}\0${namespace}`),
    status: `${dates.size} namespaces`,
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

function hashValue(value: unknown): string {
  return createHash("sha1").update(JSON.stringify(value)).digest("hex");
}

function namespaceHashes(
  text: string,
  nestedNamespaces: readonly string[],
): Map<string, string> {
  const hashes = new Map<string, string>();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return hashes;
  }
  if (!parsed || typeof parsed !== "object") return hashes;
  for (const [namespace, value] of Object.entries(parsed)) {
    hashes.set(namespace, hashValue(value));
  }
  for (const namespace of nestedNamespaces) {
    let value: unknown = parsed;
    for (const segment of namespace.split(".")) {
      value =
        value && typeof value === "object"
          ? (value as Record<string, unknown>)[segment]
          : undefined;
    }
    if (value !== undefined) hashes.set(namespace, hashValue(value));
  }
  return hashes;
}

function parseBlobChanges(log: string): BlobChange[] {
  const changes: BlobChange[] = [];
  let current: null | string = null;
  for (const line of log.split("\n")) {
    if (line.startsWith("\0")) {
      current = parseToSiteDateTime(line.slice(1).trim());
      continue;
    }
    if (!current || !line.startsWith(":")) continue;
    const [meta, file] = line.split("\t");
    const [, , oldSha, newSha] = meta.split(" ");
    if (!file || !oldSha || !newSha) continue;
    changes.push({ date: current, file, newSha, oldSha });
  }
  return changes;
}

function readBlobNamespaceHashes(
  shas: string[],
  nestedNamespaces: readonly string[],
): Map<string, Map<string, string>> | null {
  const result = new Map<string, Map<string, string>>();
  if (shas.length === 0) return result;
  const output = gitBlobs(shas);
  if (!output) return null;
  let offset = 0;
  while (offset < output.length) {
    const headerEnd = output.indexOf(10, offset);
    if (headerEnd === -1) break;
    const [sha, type, size] = output
      .subarray(offset, headerEnd)
      .toString("utf8")
      .split(" ");
    const start = headerEnd + 1;
    if (type !== "blob") {
      offset = start;
      continue;
    }
    const end = start + Number(size);
    result.set(
      sha,
      namespaceHashes(
        output.subarray(start, end).toString("utf8"),
        nestedNamespaces,
      ),
    );
    offset = end + 1;
  }
  return result;
}
