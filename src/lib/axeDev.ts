import type { AxeResults, RunOptions } from "axe-core";

type AxeInstance = typeof import("axe-core");

let axe: AxeInstance | null = null;
let observer: MutationObserver | null = null;
let debounceTimer: null | ReturnType<typeof setTimeout> = null;
let idleHandle: null | number = null;
let running = false;
let started = false;
let configured = false;
let reportedKeys = new Set<string>();

const DEBOUNCE_MS = 800;
const IDLE_TIMEOUT_MS = 3000;

const IMPACT_ORDER: Readonly<Record<string, number>> = {
  critical: 0,
  minor: 3,
  moderate: 2,
  serious: 1,
};

const RUN_OPTIONS: RunOptions = {
  runOnly: {
    type: "tag",
    values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22a", "wcag22aa"],
  },
};

const AXE_CONTEXT = {
  exclude: ["#react-scan-root", "nextjs-portal", "[data-next-badge-root]"],
};

export function resetReportedKeys(): void {
  reportedKeys = new Set();
  scheduleScan();
}

export async function startAxeScanner(): Promise<void> {
  if (typeof window === "undefined") return;
  if (process.env.NODE_ENV === "production") return;
  if (started) return;

  const axeModule = await import("axe-core");
  axe = axeModule;
  configureAxe(axe);

  observer = new MutationObserver(scheduleScan);
  observer.observe(document.documentElement, {
    attributeFilter: [
      "open",
      "hidden",
      "aria-expanded",
      "aria-hidden",
      "aria-disabled",
      "disabled",
      "lang",
      "dir",
      "role",
      "tabindex",
      "aria-label",
      "aria-labelledby",
      "aria-describedby",
      "class",
      "style",
      "aria-checked",
      "aria-selected",
      "aria-current",
      "aria-pressed",
      "title",
      "placeholder",
      "aria-live",
      "aria-atomic",
      "aria-relevant",
      "aria-invalid",
      "aria-errormessage",
    ],
    attributes: true,
    characterData: false,
    childList: true,
    subtree: true,
  });

  started = true;
  console.info(
    "%caxe-core active — WCAG 2.2 AA",
    "background:#14532d;color:#fff;padding:4px 10px;border-radius:4px;font-weight:bold",
  );
  reportToTerminal({
    event: "active",
    path: `${window.location.pathname}${window.location.search}`,
  });
  scheduleScan();
}

export function stopAxeScanner(): void {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
  if (idleHandle !== null && typeof cancelIdleCallback === "function") {
    cancelIdleCallback(idleHandle);
    idleHandle = null;
  }
  observer?.disconnect();
  observer = null;
  running = false;
  started = false;
}

function configureAxe(instance: AxeInstance): void {
  if (configured) return;
  instance.configure({
    branding: "reptiles.ge",
    rules: [
      { enabled: true, id: "target-size" },
      { enabled: false, id: "color-contrast-enhanced" },
    ],
  });
  configured = true;
}

function logViolations(results: AxeResults): void {
  const newViolations = results.violations
    .map((violation) => {
      const nodes = violation.nodes.filter((node) => {
        const key = makeNodeKey(violation.id, node.target as string[]);
        if (reportedKeys.has(key)) return false;
        reportedKeys.add(key);
        return true;
      });
      return nodes.length ? { ...violation, nodes } : null;
    })
    .filter((violation) => violation !== null);

  if (!newViolations.length) return;

  const sorted = [...newViolations].sort(
    (a, b) =>
      (IMPACT_ORDER[a.impact ?? "minor"] ?? 3) -
      (IMPACT_ORDER[b.impact ?? "minor"] ?? 3),
  );

  reportToTerminal({
    path: `${window.location.pathname}${window.location.search}`,
    violations: sorted.map((violation) => ({
      help: violation.help,
      helpUrl: violation.helpUrl,
      id: violation.id,
      impact: violation.impact ?? null,
      nodes: violation.nodes.map((node) => ({
        html: node.html,
        summary: node.failureSummary ?? "",
        target: (node.target as string[]).join(", "),
      })),
    })),
  });

  console.group(
    `%caxe-core — ${sorted.length} WCAG 2.2 AA violations`,
    "background:#14532d;color:#fff;padding:3px 8px;border-radius:4px",
  );

  for (const violation of sorted) {
    const color =
      violation.impact === "critical"
        ? "#c0392b"
        : violation.impact === "serious"
          ? "#e67e22"
          : "#888";

    console.groupCollapsed(
      `%c[${violation.impact}] ${violation.id}`,
      `color:${color};font-weight:bold`,
    );
    console.info("Description:", violation.description);
    console.info(
      "WCAG:",
      violation.tags.filter((tag) => tag.startsWith("wcag")).join(", "),
    );
    console.info("Help:", violation.helpUrl);
    for (const node of violation.nodes) {
      console.warn("Element:", (node.target as string[]).join(", "));
      console.log("HTML:", node.html);
      console.info("Fix:", node.failureSummary);
    }
    console.groupEnd();
  }

  console.groupEnd();
}

function makeNodeKey(violationId: string, target: string[]): string {
  return `${violationId}::${target.join(",")}`;
}

function performScan(): void {
  if (typeof requestIdleCallback === "function") {
    if (idleHandle !== null) cancelIdleCallback(idleHandle);
    idleHandle = requestIdleCallback(
      () => {
        idleHandle = null;
        void runAxe();
      },
      { timeout: IDLE_TIMEOUT_MS },
    );
    return;
  }
  void runAxe();
}

function reportToTerminal(
  payload:
    | { event: "active"; path: string }
    | {
        path: string;
        violations: Array<{
          help: string;
          helpUrl: string;
          id: string;
          impact: null | string;
          nodes: Array<{ html: string; summary: string; target: string; }>;
        }>;
      },
) {
  if (process.env.NODE_ENV === "production") return;
  void fetch("/api/dev/axe", {
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    method: "POST",
  }).catch(() => {});
}

async function runAxe(): Promise<void> {
  if (!axe || running) return;
  running = true;
  try {
    const results = await axe.run(AXE_CONTEXT, RUN_OPTIONS);
    logViolations(results);
  } catch (error) {
    console.error("[axe-core] Scan error:", error);
  } finally {
    running = false;
  }
}

function scheduleScan(): void {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(performScan, DEBOUNCE_MS);
}
