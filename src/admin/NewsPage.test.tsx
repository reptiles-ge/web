import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { type AdminNews, fetchAdminNews } from "./news";
import { NewsPage } from "./NewsPage";
import { SessionExpiredError } from "./species";

vi.mock("./news", () => ({ fetchAdminNews: vi.fn() }));

const PUBLISHED: AdminNews = {
  id: "batumi-raptor-count",
  image: null,
  lastEditedAt: "2026-10-20T08:00:00.000Z",
  locales: ["ka", "en", "ru", "tr"],
  photoCount: 3,
  publishedAt: "2026-10-20",
  series: "field-notes",
  status: "published",
  title: { en: "Batumi raptor count", ka: "ბათუმის აღრიცხვა" },
  updatedAt: null,
  version: 2,
};

const DRAFT: AdminNews = {
  ...PUBLISHED,
  id: "cave-isopods",
  lastEditedAt: null,
  locales: ["ka", "en"],
  series: null,
  status: "draft",
  title: { en: "Cave isopods", ka: "გამოქვაბულის მარმოსები" },
  version: 1,
};

function show(onSessionExpired = vi.fn()) {
  render(<NewsPage onSessionExpired={onSessionExpired} />);
  return onSessionExpired;
}

beforeEach(() => {
  vi.mocked(fetchAdminNews).mockReset();
});

describe("NewsPage", () => {
  it("lists drafts and published articles with their locales", async () => {
    vi.mocked(fetchAdminNews).mockResolvedValue([PUBLISHED, DRAFT]);
    show();
    expect(await screen.findByText("ბათუმის აღრიცხვა")).toBeInTheDocument();
    const draftRow = screen.getByText("cave-isopods").closest("tr")!;
    expect(within(draftRow).getByText("draft")).toBeInTheDocument();
    expect(within(draftRow).queryByText("ru")).toBeNull();
    expect(screen.getByText("field-notes")).toBeInTheDocument();
    expect(screen.getByText("2 of 2 articles")).toBeInTheDocument();
  });

  it("filters by title or slug", async () => {
    vi.mocked(fetchAdminNews).mockResolvedValue([PUBLISHED, DRAFT]);
    show();
    const search = await screen.findByLabelText("Search articles");
    await userEvent.type(search, "isopod");
    expect(screen.queryByText("ბათუმის აღრიცხვა")).toBeNull();
    expect(screen.getByText("1 of 2 articles")).toBeInTheDocument();
    await userEvent.clear(search);
    await userEvent.type(search, "ბათუმ");
    expect(screen.getByText("1 of 2 articles")).toBeInTheDocument();
  });

  it("sends an expired session back to sign-in", async () => {
    vi.mocked(fetchAdminNews).mockRejectedValue(new SessionExpiredError());
    const expired = show();
    await vi.waitFor(() => expect(expired).toHaveBeenCalledOnce());
  });

  it("shows an error with a retry", async () => {
    vi.mocked(fetchAdminNews)
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce([DRAFT]);
    show();
    await screen.findByText("Could not load articles.");
    const [retry] = screen.getAllByRole("button", { name: "Retry" });
    await userEvent.click(retry!);
    expect(await screen.findByText("cave-isopods")).toBeInTheDocument();
    expect(fetchAdminNews).toHaveBeenCalledTimes(2);
  });
});
