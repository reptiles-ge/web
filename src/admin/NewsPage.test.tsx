import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  type AdminNews,
  clearNewsCache,
  clearNewsSectionCache,
  fetchAdminNews,
} from "./news";
import { NewsPage } from "./NewsPage";
import { SessionExpiredError } from "./species";

vi.mock("./news", () => ({
  clearNewsCache: vi.fn(),
  clearNewsSectionCache: vi.fn(),
  fetchAdminNews: vi.fn(),
}));

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
  vi.mocked(clearNewsCache).mockReset();
  vi.mocked(clearNewsSectionCache).mockReset();
});

async function clearRow(slug: string) {
  const row = (await screen.findByText(slug)).closest("tr")!;
  await userEvent.click(
    within(row).getByRole("button", { name: "Clear cache" }),
  );
  const popup = (
    await screen.findByText("Clear this article's cache?")
  ).closest(".ant-popover") as HTMLElement;
  await userEvent.click(
    within(popup).getByRole("button", { name: "Clear cache" }),
  );
}

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

  it("clears one article's cache from its row after confirmation", async () => {
    vi.mocked(fetchAdminNews).mockResolvedValue([PUBLISHED, DRAFT]);
    vi.mocked(clearNewsCache).mockResolvedValue();
    show();
    await clearRow("batumi-raptor-count");
    expect(clearNewsCache).toHaveBeenCalledExactlyOnceWith(
      "batumi-raptor-count",
    );
    expect(
      await screen.findByText("Cache cleared for batumi-raptor-count."),
    ).toBeInTheDocument();
  });

  it("reports a failed clear", async () => {
    vi.mocked(fetchAdminNews).mockResolvedValue([PUBLISHED]);
    vi.mocked(clearNewsCache).mockImplementation(async () => {
      throw new Error("502");
    });
    const expired = show();
    await clearRow("batumi-raptor-count");
    expect(
      await screen.findByText(
        "The article cache could not be cleared. Try again in a minute.",
      ),
    ).toBeInTheDocument();
    expect(expired).not.toHaveBeenCalled();
  });

  it("sends an expired session back to sign-in from a row action", async () => {
    vi.mocked(fetchAdminNews).mockResolvedValue([PUBLISHED]);
    vi.mocked(clearNewsCache).mockImplementation(async () => {
      throw new SessionExpiredError();
    });
    const expired = show();
    await clearRow("batumi-raptor-count");
    await vi.waitFor(() => expect(expired).toHaveBeenCalledOnce());
  });

  it("clears the whole news section from the header after confirmation", async () => {
    vi.mocked(fetchAdminNews).mockResolvedValue([PUBLISHED]);
    vi.mocked(clearNewsSectionCache).mockResolvedValue();
    show();
    await screen.findByText("batumi-raptor-count");
    await userEvent.click(
      screen.getByRole("button", { name: "Clear news cache" }),
    );
    const popup = (
      await screen.findByText("Clear the whole news cache?")
    ).closest(".ant-popover") as HTMLElement;
    await userEvent.click(
      within(popup).getByRole("button", { name: "Clear cache" }),
    );
    expect(clearNewsSectionCache).toHaveBeenCalledOnce();
    expect(clearNewsCache).not.toHaveBeenCalled();
    expect(await screen.findByText("News cache cleared.")).toBeInTheDocument();
  });
});
