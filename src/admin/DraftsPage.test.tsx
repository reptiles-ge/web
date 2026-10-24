import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { toPage } from "@/lib/pagination";

import { SessionExpiredError } from "./adminResponse";
import { type AdminDraft, fetchDrafts } from "./drafts";
import { DraftsPage } from "./DraftsPage";

vi.mock("./drafts", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./drafts")>()),
  fetchDrafts: vi.fn(),
}));

function draft(overrides: Partial<AdminDraft>): AdminDraft {
  return {
    actor: "claude",
    baseVersion: 3,
    commonName: "გიურზა",
    createdAt: "2026-10-20T10:00:00.000Z",
    decidedAt: null,
    decidedBy: null,
    id: 1,
    scientificName: "Macrovipera lebetinus",
    source: "ai",
    speciesId: "macrovipera-lebetina",
    speciesVersion: 3,
    status: "pending",
    summary: "Rewrite overview",
    ...overrides,
  };
}

beforeEach(() => {
  vi.mocked(fetchDrafts)
    .mockReset()
    .mockImplementation(async ({ limit, page, q, status }) => {
      const data =
        status === "pending"
          ? [
              draft({ id: 2 }),
              draft({
                commonName: "კავკასიური აგამა",
                id: 1,
                speciesId: "paralaudakia-caucasia",
                speciesVersion: 5,
                summary: "Fix facts",
              }),
            ]
          : [
              draft({
                decidedAt: "2026-10-21T09:00:00.000Z",
                decidedBy: "Nika",
                id: 7,
                status,
              }),
            ];
      const found = q
        ? data.filter((item) => item.speciesId.includes(q))
        : data;
      return toPage(found, found.length, { limit, page });
    });
});

describe("DraftsPage", () => {
  it("lists pending drafts and marks the stale ones", async () => {
    render(<DraftsPage onSessionExpired={vi.fn()} />);
    const ready = (await screen.findByText("#2")).closest("tr")!;
    expect(within(ready).getByText("ready · v3")).toBeInTheDocument();
    expect(within(ready).getByText("Rewrite overview")).toBeInTheDocument();
    expect(within(ready).getByText("#2")).toHaveAttribute("href", "/drafts/2");
    const stale = screen.getByText("#1").closest("tr")!;
    expect(within(stale).getByText("stale · v3 → v5")).toBeInTheDocument();
    expect(fetchDrafts).toHaveBeenCalledExactlyOnceWith({
      limit: 50,
      page: 1,
      status: "pending",
    });
    expect(screen.getByText("1–2 of 2 drafts")).toBeInTheDocument();
    await userEvent.type(
      screen.getByLabelText("Search drafts"),
      "paralaudakia",
    );
    expect(await screen.findByText("1–1 of 1 drafts")).toBeInTheDocument();
    expect(screen.queryByText("#2")).toBeNull();
    expect(fetchDrafts).toHaveBeenLastCalledWith({
      limit: 50,
      page: 1,
      q: "paralaudakia",
      status: "pending",
    });
  });

  it("switches to decided drafts", async () => {
    render(<DraftsPage onSessionExpired={vi.fn()} />);
    await screen.findByText("#2");
    await userEvent.click(screen.getByText("approved"));
    const row = (await screen.findByText("#7")).closest("tr")!;
    expect(within(row).getByText("Nika")).toBeInTheDocument();
    expect(fetchDrafts).toHaveBeenLastCalledWith({
      limit: 50,
      page: 1,
      status: "approved",
    });
  });

  it("sends an expired session back to sign-in", async () => {
    vi.mocked(fetchDrafts).mockRejectedValue(new SessionExpiredError());
    const expired = vi.fn();
    render(<DraftsPage onSessionExpired={expired} />);
    await vi.waitFor(() => expect(expired).toHaveBeenCalledOnce());
  });
});
