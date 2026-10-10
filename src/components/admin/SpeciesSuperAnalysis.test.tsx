import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { SuperAnalysisJob } from "@/lib/speciesSuperAnalysisSchema";

import { SpeciesSuperAnalysis } from "@/components/admin/SpeciesSuperAnalysis";

const copy = {
  action: "Super Analysis",
  completed: "Completed",
  description: "Four stages",
  failed: "Failed",
  noChanges: "No changes",
  openPr: "Open draft PR",
  pending: "Pending",
  reconnecting: "Reconnecting",
  report: "Report",
  running: "Running",
  validation: "Validation",
};
const labels = {
  analysis: "Page",
  links: "Links",
  lookalikes: "Lookalikes",
  texts: "Texts",
};
const job: SuperAnalysisJob = {
  currentStage: "lookalikes",
  error: null,
  pullRequestUrl: null,
  runId: "run",
  speciesId: "test-species",
  status: "running",
  steps: [{ mode: "analysis", report: "Research checked" }],
};
const props = {
  copy,
  disabled: false,
  id: job.speciesId,
  labels,
  onBusyChange: vi.fn(),
};
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("Super Analysis progress panel", () => {
  it("reconnects to an active run, shows mandatory order and prevents duplicate launches", async () => {
    const fetcher = vi.fn().mockResolvedValue(Response.json(job));
    vi.stubGlobal("fetch", fetcher);
    render(<SpeciesSuperAnalysis {...props} />);
    await screen.findByText("Research checked");
    expect(
      screen.getAllByRole("listitem").map((item) => item.textContent),
    ).toEqual([
      "1. PageCompleted",
      "2. LookalikesRunning",
      "3. LinksPending",
      "4. TextsPending",
    ]);
    expect(
      screen.getByRole("button", { name: "Super Analysis" }),
    ).toBeDisabled();
    expect(props.onBusyChange).toHaveBeenCalledWith(true);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("starts through one POST and exposes a single final draft link", async () => {
    let started = false;
    const done = {
      ...job,
      currentStage: "validation",
      pullRequestUrl: "https://github.com/example/reptiles/pull/1",
      status: "completed",
    };
    const fetcher = vi.fn(async (_url, options) => {
      if (options?.method === "POST") started = true;
      return Response.json(started ? done : null);
    });
    vi.stubGlobal("fetch", fetcher);
    render(<SpeciesSuperAnalysis {...props} />);
    await waitFor(() => expect(props.onBusyChange).toHaveBeenCalledWith(false));
    fireEvent.click(screen.getByRole("button", { name: "Super Analysis" }));
    expect(
      await screen.findByRole("link", { name: "Open draft PR" }),
    ).toHaveAttribute("href", done.pullRequestUrl);
    expect(
      fetcher.mock.calls.filter(([, options]) => options?.method === "POST"),
    ).toHaveLength(1);
  });

  it("shows failed-stage diagnostics and preserves completed reports", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        Response.json({
          ...job,
          error: "Unverified evidence",
          status: "failed",
        }),
      ),
    );
    render(<SpeciesSuperAnalysis {...props} />);
    expect(
      await screen.findByText("Failed: Unverified evidence"),
    ).toBeVisible();
    expect(screen.getByText("Research checked")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Super Analysis" }),
    ).toBeEnabled();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
