import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { TrafficSourcesPage } from "./TrafficSourcesPage";
import { fetchAdminTrafficSources } from "./views";

vi.mock("./views", () => ({ fetchAdminTrafficSources: vi.fn() }));

beforeEach(() => {
  vi.mocked(fetchAdminTrafficSources).mockReset();
  window.history.replaceState(null, "", "/sources");
  vi.mocked(fetchAdminTrafficSources).mockResolvedValue({
    data: [
      {
        channel: "search",
        lastDay: "2026-10-24",
        path: "/snakes",
        referrer: "google.com",
        source: "google",
        visits: 75,
      },
      {
        channel: "direct",
        lastDay: "2026-10-23",
        path: "/",
        referrer: null,
        source: "direct",
        visits: 25,
      },
    ],
    limit: 50,
    page: 1,
    pageCount: 1,
    sources: [
      { channel: "search", source: "google", visits: 75 },
      { channel: "direct", source: "direct", visits: 25 },
    ],
    total: 2,
    visits: 100,
  });
});

describe("TrafficSourcesPage", () => {
  it("shows the source shares and each referrer with its landing page", async () => {
    render(<TrafficSourcesPage onSessionExpired={vi.fn()} />);
    expect(await screen.findByText("google.com")).toBeInTheDocument();
    expect(screen.getByText("/snakes")).toBeInTheDocument();
    expect(screen.getByText("100 visits")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /google 75 · 75%/ }),
    ).toBeInTheDocument();
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("filters by a source and clears it on a second click", async () => {
    render(<TrafficSourcesPage onSessionExpired={vi.fn()} />);
    const google = await screen.findByRole("button", { name: /google 75/ });
    await userEvent.click(google);
    await vi.waitFor(() =>
      expect(fetchAdminTrafficSources).toHaveBeenLastCalledWith({
        limit: 50,
        page: 1,
        source: "google",
      }),
    );
    await userEvent.click(
      await screen.findByRole("button", { name: /google 75/, pressed: true }),
    );
    await vi.waitFor(() =>
      expect(fetchAdminTrafficSources).toHaveBeenLastCalledWith({
        limit: 50,
        page: 1,
        source: undefined,
      }),
    );
  });
});
