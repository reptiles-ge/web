import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SessionExpiredError } from "./adminResponse";
import { DraftDetailPage } from "./DraftDetailPage";
import {
  type AdminDraftDetail,
  DraftDecisionError,
  fetchDraft,
  mergeDraft,
  rejectDraft,
} from "./drafts";

vi.mock("./drafts", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./drafts")>()),
  fetchDraft: vi.fn(),
  mergeDraft: vi.fn(),
  rejectDraft: vi.fn(),
}));

function detail({
  baseRecord = record("გველი ცხოვრობს ფერდობზე"),
  baseVersion = 3,
  live = record("გველი ცხოვრობს ფერდობზე"),
  status = "pending",
  version = 3,
}: {
  baseRecord?: null | ReturnType<typeof record>;
  baseVersion?: number;
  live?: ReturnType<typeof record>;
  status?: string;
  version?: number;
} = {}) {
  return {
    current: { record: live, version },
    draft: {
      actor: "claude",
      baseRecord,
      baseVersion,
      createdAt: "2026-10-20T10:00:00.000Z",
      decidedAt: status === "pending" ? null : "2026-10-21T10:00:00.000Z",
      decidedBy: status === "pending" ? null : "Nika",
      id: 4,
      record: record("გველი ბინადრობს ფერდობზე"),
      source: "ai",
      speciesId: "macrovipera-lebetina",
      status,
      summary: "Rewrite overview",
    },
  } as unknown as AdminDraftDetail;
}

function record(overview: string) {
  return {
    base: {
      commonName: "გიურზა",
      id: "macrovipera-lebetina",
      overview,
      scientificName: "Macrovipera lebetinus",
    },
  };
}

beforeEach(() => {
  vi.mocked(fetchDraft).mockReset().mockResolvedValue(detail());
  vi.mocked(mergeDraft).mockReset();
  vi.mocked(rejectDraft).mockReset();
});

async function confirm(button: string, title: string) {
  await userEvent.click(await screen.findByRole("button", { name: button }));
  const popup = (await screen.findByText(title)).closest(
    ".ant-popover",
  ) as HTMLElement;
  await userEvent.click(within(popup).getByRole("button", { name: button }));
}

describe("DraftDetailPage", () => {
  it("shows the changed fields with the changed words marked", async () => {
    render(<DraftDetailPage id="4" onSessionExpired={vi.fn()} />);
    const row = (await screen.findByText("base.overview")).closest("tr")!;
    expect(within(row).getByText("ცხოვრობს")).toHaveStyle({
      textDecoration: "line-through",
    });
    expect(within(row).getByText("ბინადრობს")).toBeInTheDocument();
    expect(screen.getByText("1 changed fields")).toBeInTheDocument();
    expect(screen.getByText("Rewrite overview")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Merge" })).toBeEnabled();
  });

  it("merges after confirmation and reloads", async () => {
    vi.mocked(mergeDraft).mockResolvedValue({
      revalidated: true,
      speciesId: "macrovipera-lebetina",
      status: "approved",
      version: 4,
    });
    render(<DraftDetailPage id="4" onSessionExpired={vi.fn()} />);
    await confirm("Merge", "Merge this draft?");
    expect(mergeDraft).toHaveBeenCalledExactlyOnceWith(4);
    expect(
      await screen.findByText(
        "Merged as version 4. The species page is refreshed.",
      ),
    ).toBeInTheDocument();
    await vi.waitFor(() => expect(fetchDraft).toHaveBeenCalledTimes(2));
  });

  it("warns when the merge could not clear the cache", async () => {
    vi.mocked(mergeDraft).mockResolvedValue({
      revalidated: false,
      speciesId: "macrovipera-lebetina",
      status: "approved",
      version: 4,
    });
    render(<DraftDetailPage id="4" onSessionExpired={vi.fn()} />);
    await confirm("Merge", "Merge this draft?");
    expect(
      await screen.findByText(
        "Merged as version 4, but the site cache could not be cleared. Use Clear cache on the species.",
      ),
    ).toBeInTheDocument();
  });

  it("rejects after confirmation", async () => {
    vi.mocked(rejectDraft).mockResolvedValue();
    render(<DraftDetailPage id="4" onSessionExpired={vi.fn()} />);
    await confirm("Reject", "Reject this draft?");
    expect(rejectDraft).toHaveBeenCalledExactlyOnceWith(4);
    expect(await screen.findByText("Draft rejected.")).toBeInTheDocument();
  });

  it("shows the API error when a decision fails", async () => {
    vi.mocked(rejectDraft).mockRejectedValue(
      new DraftDecisionError("Draft is already approved"),
    );
    render(<DraftDetailPage id="4" onSessionExpired={vi.fn()} />);
    await confirm("Reject", "Reject this draft?");
    expect(
      await screen.findByText("Draft is already approved"),
    ).toBeInTheDocument();
    expect(fetchDraft).toHaveBeenCalledOnce();
  });

  it("blocks merging a stale draft", async () => {
    vi.mocked(fetchDraft).mockResolvedValue(detail({ version: 5 }));
    render(<DraftDetailPage id="4" onSessionExpired={vi.fn()} />);
    expect(
      await screen.findByText(/It can no longer be merged/),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Merge" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Reject" })).toBeEnabled();
  });

  it("shows a decided draft without actions", async () => {
    vi.mocked(fetchDraft).mockResolvedValue(detail({ status: "approved" }));
    render(<DraftDetailPage id="4" onSessionExpired={vi.fn()} />);
    expect(
      await screen.findByText(/This draft is already decided/),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Merge" })).toBeNull();
    expect(screen.getByText(/^Nika,/)).toBeInTheDocument();
  });

  it("shows what a merged draft changed from its base version", async () => {
    vi.mocked(fetchDraft).mockResolvedValue(
      detail({
        live: record("გველი ბინადრობს ფერდობზე"),
        status: "approved",
        version: 4,
      }),
    );
    render(<DraftDetailPage id="4" onSessionExpired={vi.fn()} />);
    const row = (await screen.findByText("base.overview")).closest("tr")!;
    expect(within(row).getByText("ცხოვრობს")).toHaveStyle({
      textDecoration: "line-through",
    });
    expect(
      screen.getByRole("columnheader", { name: "Before (v3)" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/shows what it changed from version 3/),
    ).toBeInTheDocument();
  });

  it("falls back to the live record for a draft without a base copy", async () => {
    vi.mocked(fetchDraft).mockResolvedValue(
      detail({
        baseRecord: null,
        live: record("გველი ბინადრობს ფერდობზე"),
        status: "approved",
      }),
    );
    render(<DraftDetailPage id="4" onSessionExpired={vi.fn()} />);
    expect(
      await screen.findByText(/No copy of the record from before it was kept/),
    ).toBeInTheDocument();
    expect(
      screen.getByText("No differences from the live record."),
    ).toBeInTheDocument();
  });

  it("shows a missing draft and an expired session", async () => {
    vi.mocked(fetchDraft).mockResolvedValue(null);
    render(<DraftDetailPage id="9" onSessionExpired={vi.fn()} />);
    expect(await screen.findByText("Draft not found")).toBeInTheDocument();
  });

  it("sends an expired session back to sign-in on a decision", async () => {
    vi.mocked(mergeDraft).mockRejectedValue(new SessionExpiredError());
    const expired = vi.fn();
    render(<DraftDetailPage id="4" onSessionExpired={expired} />);
    await confirm("Merge", "Merge this draft?");
    await vi.waitFor(() => expect(expired).toHaveBeenCalledOnce());
  });
});
