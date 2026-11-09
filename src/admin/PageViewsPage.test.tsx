import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PageViewsPage } from "./PageViewsPage";
import { SessionExpiredError } from "./species";
import { lastDays } from "./viewRange";
import { fetchAdminPageViews } from "./views";

vi.mock("./views", () => ({ fetchAdminPageViews: vi.fn() }));

const HOME = { lastDay: "2026-10-24", path: "/", views: 4200 };
const KAKHETI = { lastDay: "2026-10-22", path: "/regions/kakheti", views: 31 };

beforeEach(() => {
  vi.mocked(fetchAdminPageViews).mockReset();
  window.history.replaceState(null, "", "/page-views");
});

function resolveWith(total = 2) {
  vi.mocked(fetchAdminPageViews).mockResolvedValue({
    data: [HOME, KAKHETI],
    limit: 50,
    page: 1,
    pageCount: Math.ceil(total / 50),
    total,
    views: 4231,
  });
}

describe("PageViewsPage", () => {
  it("lists every page with its views and the total", async () => {
    resolveWith();
    render(<PageViewsPage onSessionExpired={vi.fn()} />);
    expect(await screen.findByText("/regions/kakheti")).toBeInTheDocument();
    expect(screen.getByText("4,200")).toBeInTheDocument();
    expect(screen.getByText("4,231 views")).toBeInTheDocument();
    expect(fetchAdminPageViews).toHaveBeenCalledExactlyOnceWith({
      limit: 50,
      page: 1,
    });
  });

  it("asks the API for a date range, a language and a path", async () => {
    resolveWith();
    render(<PageViewsPage onSessionExpired={vi.fn()} />);
    await screen.findByText("/regions/kakheti");
    await userEvent.click(screen.getByPlaceholderText("All time"));
    await userEvent.click(await screen.findByText("30 days"));
    await vi.waitFor(() =>
      expect(fetchAdminPageViews).toHaveBeenLastCalledWith({
        ...lastDays(30),
        limit: 50,
        page: 1,
      }),
    );
    await userEvent.click(screen.getByLabelText("Language"));
    await userEvent.click(await screen.findByTitle("EN"));
    await vi.waitFor(() =>
      expect(fetchAdminPageViews).toHaveBeenLastCalledWith({
        ...lastDays(30),
        lang: "en",
        limit: 50,
        page: 1,
      }),
    );
    await userEvent.type(screen.getByLabelText("Search pages"), "regions");
    await vi.waitFor(() =>
      expect(fetchAdminPageViews).toHaveBeenLastCalledWith({
        ...lastDays(30),
        lang: "en",
        limit: 50,
        page: 1,
        q: "regions",
      }),
    );
  });

  it("sends an expired session back to sign-in", async () => {
    vi.mocked(fetchAdminPageViews).mockRejectedValue(new SessionExpiredError());
    const expired = vi.fn();
    render(<PageViewsPage onSessionExpired={expired} />);
    await vi.waitFor(() => expect(expired).toHaveBeenCalledOnce());
  });
});
