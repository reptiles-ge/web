import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AdminSpeciesDrafts } from "./AdminSpeciesDrafts";

const refresh = vi.fn();

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh }) }));

const draft = {
  actor: "local-admin-ai",
  baseVersion: 3,
  changes: [{ after: "ახალი", before: "ძველი", path: "base.overview" }],
  createdAt: "2026-10-22T10:00:00.000Z",
  id: 7,
  source: "ai",
  summary: "Edit overview",
};

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockResolvedValue(Response.json({ status: "approved", version: 4 })),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("AdminSpeciesDrafts", () => {
  it("says when nothing waits for review", () => {
    render(<AdminSpeciesDrafts currentVersion={3} drafts={[]} id="x" />);
    expect(screen.getByText("დასადასტურებელი ცვლილება არ არის.")).toBeTruthy();
  });

  it("shows the change and approves it", async () => {
    render(
      <AdminSpeciesDrafts
        currentVersion={3}
        drafts={[draft]}
        id="testudo-graeca"
      />,
    );
    expect(screen.getByText("base.overview")).toBeTruthy();
    expect(screen.getByText("ძველი")).toBeTruthy();
    expect(screen.getByText("ახალი")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "დადასტურება" }));
    await waitFor(() => expect(refresh).toHaveBeenCalled());
    const [, init] = vi.mocked(fetch).mock.calls[0]!;
    expect(JSON.parse(String(init?.body))).toEqual({
      decision: "approve",
      draftId: 7,
      id: "testudo-graeca",
    });
  });

  it("blocks approval of a stale draft and shows API errors", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      Response.json({ error: "Draft not found" }, { status: 400 }),
    );
    render(<AdminSpeciesDrafts currentVersion={4} drafts={[draft]} id="x" />);
    expect(
      (screen.getByRole("button", { name: "დადასტურება" }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "უარყოფა" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Draft not found",
    );
    expect(refresh).not.toHaveBeenCalled();
  });
});
