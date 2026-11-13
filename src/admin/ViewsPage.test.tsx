import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SessionExpiredError } from "./species";
import { lastDays } from "./viewRange";
import { type AdminView, fetchAdminViews } from "./views";
import { ViewsPage } from "./ViewsPage";

vi.mock("./views", () => ({ fetchAdminViews: vi.fn() }));

const GIURZA: AdminView = {
  id: "macrovipera-lebetina",
  kind: "species",
  lastDay: "2026-10-24",
  name: { en: "Levantine viper", ka: "გიურზა" },
  views: 1240,
};

const ARTICLE: AdminView = {
  id: "new-checklist",
  kind: "news",
  lastDay: "2026-10-23",
  name: { en: null, ka: null },
  views: 37,
};

beforeEach(() => {
  vi.mocked(fetchAdminViews).mockReset();
});

function open() {
  vi.mocked(fetchAdminViews).mockResolvedValue(pageOf([GIURZA, ARTICLE]));
  render(<ViewsPage onSessionExpired={vi.fn()} />);
}

function pageOf(data: AdminView[], total = data.length, page = 1) {
  return {
    data,
    limit: 50,
    page,
    pageCount: Math.ceil(total / 50),
    total,
    views: data.reduce((sum, item) => sum + item.views, 0),
  };
}

describe("ViewsPage", () => {
  it("lists the most viewed pages with the period total", async () => {
    open();
    expect(await screen.findByRole("link", { name: "გიურზა" })).toHaveAttribute(
      "href",
      "/species/macrovipera-lebetina",
    );
    expect(screen.getByRole("link", { name: "new-checklist" })).toHaveAttribute(
      "href",
      "/news/new-checklist",
    );
    expect(screen.getByText("1,240")).toBeInTheDocument();
    expect(screen.getByText("1,277 views")).toBeInTheDocument();
    expect(screen.getByText("1–2 of 2 pages")).toBeInTheDocument();
    expect(fetchAdminViews).toHaveBeenCalledExactlyOnceWith({
      limit: 50,
      page: 1,
    });
  });

  it("asks the API for a preset range from page one", async () => {
    open();
    await screen.findByText("გიურზა");
    await userEvent.click(screen.getByPlaceholderText("All time"));
    await userEvent.click(await screen.findByText("7 days"));
    await vi.waitFor(() =>
      expect(fetchAdminViews).toHaveBeenLastCalledWith({
        ...lastDays(7),
        limit: 50,
        page: 1,
      }),
    );
  });

  it("reads a date range from the address and ignores a bad one", async () => {
    window.history.replaceState(
      null,
      "",
      "/views?from=2026-09-01&to=2026-09-30",
    );
    open();
    await screen.findByText("გიურზა");
    expect(fetchAdminViews).toHaveBeenLastCalledWith({
      from: "2026-09-01",
      limit: 50,
      page: 1,
      to: "2026-09-30",
    });
    expect(screen.getByPlaceholderText("All time")).toHaveValue("2026-09-01");
    window.history.replaceState(null, "", "/views?from=2026-02-30&to=soon");
    vi.mocked(fetchAdminViews).mockClear();
    open();
    await vi.waitFor(() =>
      expect(fetchAdminViews).toHaveBeenLastCalledWith({ limit: 50, page: 1 }),
    );
  });

  it("searches, filters by kind and pages on the server", async () => {
    vi.mocked(fetchAdminViews).mockResolvedValue(
      pageOf([GIURZA, ARTICLE], 120),
    );
    render(<ViewsPage onSessionExpired={vi.fn()} />);
    expect(await screen.findByText("1–2 of 120 pages")).toBeInTheDocument();
    await userEvent.click(within(screen.getByTitle("2")).getByRole("button"));
    await vi.waitFor(() =>
      expect(fetchAdminViews).toHaveBeenLastCalledWith({ limit: 50, page: 2 }),
    );
    const header = screen.getByRole("columnheader", { name: /Kind/ });
    await userEvent.click(within(header).getByRole("button"));
    await userEvent.click(
      await screen.findByRole("menuitem", { name: /news/ }),
    );
    await userEvent.click(screen.getByRole("button", { name: "OK" }));
    await vi.waitFor(() =>
      expect(fetchAdminViews).toHaveBeenLastCalledWith({
        kind: "news",
        limit: 50,
        page: 1,
      }),
    );
    await userEvent.type(screen.getByLabelText("Search pages"), "giurza");
    await vi.waitFor(() =>
      expect(fetchAdminViews).toHaveBeenLastCalledWith({
        kind: "news",
        limit: 50,
        page: 1,
        q: "giurza",
      }),
    );
  });

  it("sends an expired session back to sign-in", async () => {
    vi.mocked(fetchAdminViews).mockRejectedValue(new SessionExpiredError());
    const expired = vi.fn();
    render(<ViewsPage onSessionExpired={expired} />);
    await vi.waitFor(() => expect(expired).toHaveBeenCalledOnce());
  });
});
