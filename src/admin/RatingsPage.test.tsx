import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  type AdminRating,
  type AdminRatingsPage,
  fetchAdminRatings,
} from "./ratings";
import { RatingsPage } from "./RatingsPage";
import { SessionExpiredError } from "./species";

vi.mock("./ratings", () => ({ fetchAdminRatings: vi.fn() }));

const FIRST = { limit: 50, page: 1 };

function page(overrides: Partial<AdminRatingsPage> = {}): AdminRatingsPage {
  return {
    data: [
      rating({ id: 3 }),
      rating({ feedback: "ფოტო აკლია", id: 2, path: "/xvlikebi", rating: 2 }),
    ],
    limit: 50,
    page: 1,
    pageCount: 1,
    summary: {
      average: 3.5,
      byRating: { 1: 0, 2: 1, 3: 0, 4: 0, 5: 1 },
      count: 2,
    },
    total: 2,
    ...overrides,
  };
}

function rating(overrides: Partial<AdminRating>): AdminRating {
  return {
    country: "GE",
    createdAt: "2026-10-22T10:00:00.000Z",
    feedback: null,
    id: 1,
    locale: "ka",
    path: "/gvelebi/giurza",
    rating: 5,
    ...overrides,
  };
}

beforeEach(() => {
  vi.mocked(fetchAdminRatings).mockReset();
});

describe("RatingsPage", () => {
  it("lists ratings with feedback, page links and the summary", async () => {
    vi.mocked(fetchAdminRatings).mockResolvedValue(page());
    render(<RatingsPage onSessionExpired={vi.fn()} />);
    expect(await screen.findByText("ფოტო აკლია")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "/xvlikebi" })).toHaveAttribute(
      "href",
      "https://reptiles.ge/xvlikebi",
    );
    expect(screen.getByText("1–2 of 2 ratings")).toBeInTheDocument();
    expect(screen.getByText("Average")).toBeInTheDocument();
    expect(screen.getByTitle("All ratings")).toBeInTheDocument();
    expect(fetchAdminRatings).toHaveBeenCalledExactlyOnceWith(FIRST);
  });

  it("keeps a malformed page path readable instead of failing", async () => {
    vi.mocked(fetchAdminRatings).mockResolvedValue(
      page({ data: [rating({ id: 4, path: "/%E0" })], total: 1 }),
    );
    render(<RatingsPage onSessionExpired={vi.fn()} />);
    expect(await screen.findByText("/%E0")).toBeInTheDocument();
  });

  it("shows a dash when there are no ratings yet", async () => {
    vi.mocked(fetchAdminRatings).mockResolvedValue(
      page({
        data: [],
        summary: { average: null, byRating: {}, count: 0 },
        total: 0,
      }),
    );
    render(<RatingsPage onSessionExpired={vi.fn()} />);
    expect(await screen.findByText("0 of 0 ratings")).toBeInTheDocument();
  });

  it("filters by rating", async () => {
    vi.mocked(fetchAdminRatings).mockResolvedValue(page());
    render(<RatingsPage onSessionExpired={vi.fn()} />);
    await screen.findByText("ფოტო აკლია");
    await userEvent.click(screen.getByLabelText("Filter by rating"));
    await userEvent.click(await screen.findByTitle("2 ★"));
    await vi.waitFor(() =>
      expect(fetchAdminRatings).toHaveBeenLastCalledWith({
        ...FIRST,
        rating: 2,
      }),
    );
    await userEvent.click(screen.getByLabelText("Filter by rating"));
    await userEvent.click(await screen.findByTitle("All ratings"));
    await vi.waitFor(() =>
      expect(fetchAdminRatings).toHaveBeenLastCalledWith({
        ...FIRST,
        rating: undefined,
      }),
    );
  });

  it("loads the next page from the API", async () => {
    vi.mocked(fetchAdminRatings).mockResolvedValue(
      page({ pageCount: 2, total: 52 }),
    );
    render(<RatingsPage onSessionExpired={vi.fn()} />);
    expect(await screen.findByText("1–2 of 52 ratings")).toBeInTheDocument();
    vi.mocked(fetchAdminRatings).mockResolvedValue(
      page({
        data: [rating({ id: 1, path: "/kuebi" })],
        page: 2,
        pageCount: 2,
        total: 52,
      }),
    );
    await userEvent.click(screen.getByTitle("2"));
    expect(await screen.findByText("/kuebi")).toBeInTheDocument();
    expect(screen.getByText("51–51 of 52 ratings")).toBeInTheDocument();
    expect(fetchAdminRatings).toHaveBeenLastCalledWith({ limit: 50, page: 2 });
  });

  it("asks the API for the feedback search", async () => {
    vi.mocked(fetchAdminRatings).mockResolvedValue(page());
    render(<RatingsPage onSessionExpired={vi.fn()} />);
    await screen.findByText("ფოტო აკლია");
    vi.mocked(fetchAdminRatings).mockResolvedValue(
      page({ data: [rating({ feedback: "ფოტო აკლია", id: 2 })], total: 1 }),
    );
    await userEvent.type(screen.getByLabelText("Search ratings"), "ფოტო");
    expect(await screen.findByText("1–1 of 1 ratings")).toBeInTheDocument();
    expect(fetchAdminRatings).toHaveBeenLastCalledWith({ ...FIRST, q: "ფოტო" });
  });

  it("returns to sign-in when the session has expired", async () => {
    vi.mocked(fetchAdminRatings).mockRejectedValue(new SessionExpiredError());
    const onSessionExpired = vi.fn();
    render(<RatingsPage onSessionExpired={onSessionExpired} />);
    await vi.waitFor(() => expect(onSessionExpired).toHaveBeenCalledOnce());
  });

  it("offers a retry when loading fails", async () => {
    vi.mocked(fetchAdminRatings)
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce(page());
    render(<RatingsPage onSessionExpired={vi.fn()} />);
    const alert = await screen.findByText("Could not load ratings.");
    await userEvent.click(
      within(alert.closest(".ant-alert") as HTMLElement).getByRole("button", {
        name: "Retry",
      }),
    );
    expect(await screen.findByText("ფოტო აკლია")).toBeInTheDocument();
    expect(fetchAdminRatings).toHaveBeenCalledTimes(2);
  });
});
