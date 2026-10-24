import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SessionExpiredError } from "./species";
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

  it("asks the API for another period from page one", async () => {
    open();
    await screen.findByText("გიურზა");
    await userEvent.click(screen.getByText("7 days"));
    await vi.waitFor(() =>
      expect(fetchAdminViews).toHaveBeenLastCalledWith({
        days: 7,
        limit: 50,
        page: 1,
      }),
    );
    await userEvent.click(screen.getByText("All time"));
    await vi.waitFor(() =>
      expect(fetchAdminViews).toHaveBeenLastCalledWith({
        days: undefined,
        limit: 50,
        page: 1,
      }),
    );
  });

  it("searches, filters by kind and pages on the server", async () => {
    vi.mocked(fetchAdminViews).mockResolvedValue(
      pageOf([GIURZA, ARTICLE], 120),
    );
    render(<ViewsPage onSessionExpired={vi.fn()} />);
    expect(await screen.findByText("1–2 of 120 pages")).toBeInTheDocument();
    await userEvent.click(screen.getByTitle("2"));
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
