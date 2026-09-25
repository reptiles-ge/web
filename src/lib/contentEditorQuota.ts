import { spawn } from "node:child_process";
import readline from "node:readline";

type QuotaSnapshot = {
  exhausted: boolean;
  remainingPercent: number | null;
  resetsAt: number | null;
};

const RED = "\u001b[31m";
const GREEN = "\u001b[32m";
const RESET = "\u001b[0m";
let blocked = false;
let pollTimer: NodeJS.Timeout | null = null;
let pendingRead: Promise<null | QuotaSnapshot> | null = null;

export class CodexQuotaError extends Error {
  constructor() {
    super("Codex usage limit reached");
  }
}

export async function assertCodexQuota(operationId: string) {
  if (!blocked) {
    const quota = await readQuota();
    if (quota?.exhausted) blockQuota(operationId, quota);
  }
  if (blocked) {
    console.error(`${RED}content-editor [${operationId}] გაჩერდი — Codex-ის ლიმიტი ამოიწურა. ახალი ტექსტი არ გაუშვა.${RESET}`);
    throw new CodexQuotaError();
  }
}

export async function reportCodexQuota(operationId: string, failure?: unknown) {
  const limitError = isCodexLimitError(failure);
  if (limitError) blockQuota(operationId);
  const quota = await readQuota();
  if (quota?.exhausted) blockQuota(operationId, quota);
  if (blocked) {
    if (!limitError) {
      console.error(`${RED}content-editor [${operationId}] გაჩერდი — Codex-ის ლიმიტი ამოიწურა. ახალი ტექსტი არ გაუშვა.${RESET}`);
    }
    return true;
  }
  if (quota) {
    const remaining = quota.remainingPercent === null ? "" : ` (${quota.remainingPercent}% დარჩა)`;
    console.info(`${GREEN}content-editor [${operationId}] ლიმიტი ხელმისაწვდომია${remaining} — შეგიძლია ახალი ტექსტი გაუშვა.${RESET}`);
  }
  return false;
}

export function isCodexLimitError(error: unknown) {
  return error instanceof CodexQuotaError ||
    (error instanceof Error && /usage limit|rate limit|quota exceeded|insufficient credits|too many requests/i.test(error.message));
}

export function parseCodexQuota(value: unknown): null | QuotaSnapshot {
  if (!value || typeof value !== "object") return null;
  const response = value as {
    rateLimits?: QuotaBucket | null;
    rateLimitsByLimitId?: Record<string, QuotaBucket>;
  };
  const bucket = response.rateLimitsByLimitId?.codex ?? response.rateLimits;
  if (!bucket) return null;
  const windows = [bucket.primary, bucket.secondary].filter(
    (window): window is QuotaWindow => Boolean(window),
  );
  if (!windows.length && !bucket.rateLimitReachedType) return null;
  const exhaustedWindows = windows.filter(
    (window) => typeof window.usedPercent === "number" && window.usedPercent >= 100,
  );
  const remaining = windows
    .filter((window) => typeof window.usedPercent === "number")
    .map((window) => Math.max(0, Math.round(100 - window.usedPercent!)));
  const resets = (exhaustedWindows.length ? exhaustedWindows : windows)
    .map((window) => window.resetsAt)
    .filter((time): time is number => typeof time === "number");
  return {
    exhausted: Boolean(bucket.rateLimitReachedType) || exhaustedWindows.length > 0,
    remainingPercent: remaining.length ? Math.min(...remaining) : null,
    resetsAt: resets.length ? Math.max(...resets) : null,
  };
}

type QuotaWindow = { resetsAt?: number | null; usedPercent?: number | null };
type QuotaBucket = {
  primary?: QuotaWindow | null;
  rateLimitReachedType?: string | null;
  secondary?: QuotaWindow | null;
};

function blockQuota(operationId: string, quota?: QuotaSnapshot) {
  if (!blocked) {
    const reset = quota?.resetsAt
      ? ` სავარაუდო აღდგენა: ${new Date(quota.resetsAt * 1000).toLocaleString("ka-GE")}.`
      : "";
    console.error(`${RED}content-editor [${operationId}] გაჩერდი — Codex-ის ლიმიტი ამოიწურა.${reset}${RESET}`);
  }
  blocked = true;
  schedulePoll();
}

function schedulePoll() {
  if (pollTimer) return;
  pollTimer = setTimeout(async () => {
    pollTimer = null;
    const quota = await readQuota();
    if (quota && !quota.exhausted) {
      blocked = false;
      console.info(`${GREEN}content-editor ლიმიტი ისევ ხელმისაწვდომია — შეგიძლია ახალი ტექსტი გაუშვა.${RESET}`);
    } else if (blocked) {
      schedulePoll();
    }
  }, 60_000);
  pollTimer.unref();
}

function readQuota() {
  if (!pendingRead) {
    pendingRead = readQuotaFromCodex()
      .catch(() => null)
      .finally(() => {
        pendingRead = null;
      });
  }
  return pendingRead;
}

function readQuotaFromCodex(): Promise<QuotaSnapshot> {
  return new Promise((resolve, reject) => {
    const child = spawn("codex", ["app-server"], {
      stdio: ["pipe", "pipe", "ignore"],
    });
    let done = false;
    const timeout = setTimeout(() => finish(new Error("Quota check timed out")), 10_000);
    const finish = (error?: Error, quota?: QuotaSnapshot) => {
      if (done) return;
      done = true;
      clearTimeout(timeout);
      child.kill();
      if (error) reject(error);
      else if (quota) resolve(quota);
      else reject(new Error("Quota status unavailable"));
    };
    const send = (message: unknown) => child.stdin.write(`${JSON.stringify(message)}\n`);
    child.on("error", finish);
    child.stdin.on("error", finish);
    child.on("close", () => finish(new Error("Codex app-server closed")));
    readline.createInterface({ input: child.stdout }).on("line", (line) => {
      try {
        const message = JSON.parse(line) as {
          error?: { message?: string };
          id?: number;
          result?: unknown;
        };
        if (message.id === 1) {
          if (message.error) throw new Error(message.error.message);
          send({ method: "initialized", params: {} });
          send({ id: 2, method: "account/rateLimits/read", params: {} });
        }
        if (message.id === 2) {
          if (message.error) throw new Error(message.error.message);
          finish(undefined, parseCodexQuota(message.result) ?? undefined);
        }
      } catch (error) {
        finish(error instanceof Error ? error : new Error("Invalid quota response"));
      }
    });
    send({
      id: 1,
      method: "initialize",
      params: {
        clientInfo: {
          name: "reptiles_content_editor",
          title: "Reptiles content editor",
          version: "0.1.0",
        },
      },
    });
  });
}
