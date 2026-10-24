import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { toPage } from "@/lib/pagination";

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

const FIRST = { limit: 50, page: 1 };

function pageOf(data: AdminNews[]) {
  return toPage(data, data.length, FIRST);
}

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
    vi.mocked(fetchAdminNews).mockResolvedValue(pageOf([PUBLISHED, DRAFT]));
    show();
    expect(await screen.findByText("ბათუმის აღრიცხვა")).toBeInTheDocument();
    const draftRow = screen.getByText("cave-isopods").closest("tr")!;
    expect(within(draftRow).getByText("draft")).toBeInTheDocument();
    expect(within(draftRow).queryByText("ru")).toBeNull();
    expect(screen.getByText("field-notes")).toBeInTheDocument();
    expect(screen.getByText("1–2 of 2 articles")).toBeInTheDocument();
    expect(fetchAdminNews).toHaveBeenCalledExactlyOnceWith(FIRST);
  });

  it("asks the API for the title or slug search", async () => {
    vi.mocked(fetchAdminNews).mockResolvedValue(pageOf([PUBLISHED, DRAFT]));
    show();
    const search = await screen.findByLabelText("Search articles");
    vi.mocked(fetchAdminNews).mockResolvedValue(pageOf([DRAFT]));
    await userEvent.type(search, "isopod");
    expect(await screen.findByText("1–1 of 1 articles")).toBeInTheDocument();
    expect(screen.queryByText("ბათუმის აღრიცხვა")).toBeNull();
    expect(fetchAdminNews).toHaveBeenLastCalledWith({ ...FIRST, q: "isopod" });
  });

  it("filters by status on the server from page one", async () => {
    vi.mocked(fetchAdminNews).mockResolvedValue(pageOf([PUBLISHED, DRAFT]));
    show();
    await screen.findByText("ბათუმის აღრიცხვა");
    const header = screen.getByRole("columnheader", { name: /Status/ });
    await userEvent.click(within(header).getByRole("button"));
    await userEvent.click(
      await screen.findByRole("menuitem", { name: /draft/ }),
    );
    await userEvent.click(screen.getByRole("button", { name: "OK" }));
    await vi.waitFor(() =>
      expect(fetchAdminNews).toHaveBeenLastCalledWith({
        ...FIRST,
        series: undefined,
        status: "draft",
      }),
    );
  });

  it("sends an expired session back to sign-in", async () => {
    vi.mocked(fetchAdminNews).mockRejectedValue(new SessionExpiredError());
    const expired = show();
    await vi.waitFor(() => expect(expired).toHaveBeenCalledOnce());
  });

  it("shows an error with a retry", async () => {
    vi.mocked(fetchAdminNews)
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce(pageOf([DRAFT]));
    show();
    await screen.findByText("Could not load articles.");
    const [retry] = screen.getAllByRole("button", { name: "Retry" });
    await userEvent.click(retry!);
    expect(await screen.findByText("cave-isopods")).toBeInTheDocument();
    expect(fetchAdminNews).toHaveBeenCalledTimes(2);
  });

  it("clears one article's cache from its row after confirmation", async () => {
    vi.mocked(fetchAdminNews).mockResolvedValue(pageOf([PUBLISHED, DRAFT]));
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
    vi.mocked(fetchAdminNews).mockResolvedValue(pageOf([PUBLISHED]));
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
    vi.mocked(fetchAdminNews).mockResolvedValue(pageOf([PUBLISHED]));
    vi.mocked(clearNewsCache).mockImplementation(async () => {
      throw new SessionExpiredError();
    });
    const expired = show();
    await clearRow("batumi-raptor-count");
    await vi.waitFor(() => expect(expired).toHaveBeenCalledOnce());
  });

  it("clears the whole news section from the header after confirmation", async () => {
    vi.mocked(fetchAdminNews).mockResolvedValue(pageOf([PUBLISHED]));
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
