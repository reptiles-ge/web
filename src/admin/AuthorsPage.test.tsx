import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  type AdminAuthor,
  clearAuthorCache,
  clearAuthorsCache,
  fetchAdminAuthors,
} from "./authors";
import { AuthorsPage } from "./AuthorsPage";
import { SessionExpiredError } from "./species";

vi.mock("./authors", () => ({
  clearAuthorCache: vi.fn(),
  clearAuthorsCache: vi.fn(),
  fetchAdminAuthors: vi.fn(),
}));

const CONTRIBUTOR: AdminAuthor = {
  aliasCount: 3,
  id: "sandro-khakhva",
  image: null,
  isContributor: true,
  jobTitle: "herpetologist",
  kind: "person",
  name: { en: "Sandro Khakhva", ka: "სანდრო ხახვა" },
  photoCount: 42,
  role: "photographer",
};

const CREDIT_ONLY: AdminAuthor = {
  ...CONTRIBUTOR,
  aliasCount: 1,
  id: "charles-j-sharp",
  isContributor: false,
  jobTitle: null,
  name: { en: "Charles J. Sharp", ka: "ჩარლზ შარპი" },
  photoCount: 5,
  role: null,
};

beforeEach(() => {
  vi.mocked(fetchAdminAuthors).mockReset();
  vi.mocked(clearAuthorCache).mockReset();
  vi.mocked(clearAuthorsCache).mockReset();
});

async function confirmIn(popupTitle: string) {
  const popup = (await screen.findByText(popupTitle)).closest(
    ".ant-popover",
  ) as HTMLElement;
  await userEvent.click(
    within(popup).getByRole("button", { name: "Clear cache" }),
  );
}

function open(onSessionExpired = vi.fn()) {
  vi.mocked(fetchAdminAuthors).mockResolvedValue(
    pageOf([CONTRIBUTOR, CREDIT_ONLY]),
  );
  render(<AuthorsPage onSessionExpired={onSessionExpired} />);
  return onSessionExpired;
}

function pageOf(data: AdminAuthor[], total = data.length, page = 1) {
  return { data, limit: 50, page, pageCount: Math.ceil(total / 50), total };
}

describe("AuthorsPage", () => {
  it("lists contributors and credit-only authors from the first page", async () => {
    open();
    expect(await screen.findByText("სანდრო ხახვა")).toBeInTheDocument();
    expect(screen.getByText("ჩარლზ შარპი")).toBeInTheDocument();
    expect(screen.getByText("contributor")).toBeInTheDocument();
    expect(screen.getByText("1–2 of 2 authors")).toBeInTheDocument();
    expect(fetchAdminAuthors).toHaveBeenCalledExactlyOnceWith({
      limit: 50,
      page: 1,
    });
  });

  it("asks the API for the search once typing stops, from page one", async () => {
    open();
    await screen.findByText("სანდრო ხახვა");
    vi.mocked(fetchAdminAuthors).mockResolvedValue(pageOf([CREDIT_ONLY]));
    await userEvent.type(screen.getByLabelText("Search authors"), "sharp");
    expect(await screen.findByText("1–1 of 1 authors")).toBeInTheDocument();
    expect(fetchAdminAuthors).toHaveBeenCalledTimes(2);
    expect(fetchAdminAuthors).toHaveBeenLastCalledWith({
      limit: 50,
      page: 1,
      q: "sharp",
    });
  });

  it("loads the next page from the API", async () => {
    vi.mocked(fetchAdminAuthors).mockResolvedValue(
      pageOf([CONTRIBUTOR, CREDIT_ONLY], 120),
    );
    render(<AuthorsPage onSessionExpired={vi.fn()} />);
    expect(await screen.findByText("1–2 of 120 authors")).toBeInTheDocument();
    vi.mocked(fetchAdminAuthors).mockResolvedValue(
      pageOf([CREDIT_ONLY], 120, 2),
    );
    await userEvent.click(screen.getByTitle("2"));
    expect(await screen.findByText("51–51 of 120 authors")).toBeInTheDocument();
    expect(fetchAdminAuthors).toHaveBeenLastCalledWith({ limit: 50, page: 2 });
  });

  it("filters on the server and starts again from page one", async () => {
    open();
    await screen.findByText("სანდრო ხახვა");
    const header = screen.getByRole("columnheader", { name: /Page/ });
    await userEvent.click(within(header).getByRole("button"));
    await userEvent.click(await screen.findByText("Photo credit only"));
    await userEvent.click(screen.getByRole("button", { name: "OK" }));
    await vi.waitFor(() =>
      expect(fetchAdminAuthors).toHaveBeenLastCalledWith({
        contributor: false,
        kind: undefined,
        limit: 50,
        page: 1,
        role: undefined,
      }),
    );
  });

  it("shows an error with a retry", async () => {
    vi.mocked(fetchAdminAuthors).mockRejectedValue(new Error("down"));
    render(<AuthorsPage onSessionExpired={vi.fn()} />);
    expect(
      await screen.findByText("Could not load authors."),
    ).toBeInTheDocument();
    vi.mocked(fetchAdminAuthors).mockResolvedValue(pageOf([CONTRIBUTOR]));
    await userEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(await screen.findByText("სანდრო ხახვა")).toBeInTheDocument();
  });

  it("offers a row clear only on contributor rows", async () => {
    open();
    const contributorRow = (await screen.findByText("sandro-khakhva")).closest(
      "tr",
    )!;
    const creditRow = screen.getByText("charles-j-sharp").closest("tr")!;
    expect(
      within(creditRow).queryByRole("button", { name: "Clear cache" }),
    ).toBeNull();
    vi.mocked(clearAuthorCache).mockResolvedValue();
    await userEvent.click(
      within(contributorRow).getByRole("button", { name: "Clear cache" }),
    );
    await confirmIn("Clear this contributor's cache?");
    expect(clearAuthorCache).toHaveBeenCalledExactlyOnceWith("sandro-khakhva");
    expect(
      await screen.findByText("Cache cleared for sandro-khakhva."),
    ).toBeInTheDocument();
  });

  it("clears every author page from the header", async () => {
    open();
    await screen.findByText("სანდრო ხახვა");
    vi.mocked(clearAuthorsCache).mockResolvedValue();
    await userEvent.click(
      screen.getByRole("button", { name: "Clear authors cache" }),
    );
    await confirmIn("Clear the whole authors cache?");
    expect(clearAuthorsCache).toHaveBeenCalledOnce();
    expect(
      await screen.findByText("Authors cache cleared."),
    ).toBeInTheDocument();
  });

  it("sends an expired session back to sign-in", async () => {
    vi.mocked(fetchAdminAuthors).mockRejectedValue(new SessionExpiredError());
    const expired = vi.fn();
    render(<AuthorsPage onSessionExpired={expired} />);
    await vi.waitFor(() => expect(expired).toHaveBeenCalledOnce());
  });

  it("links each author to its detail page", async () => {
    open();
    expect(
      await screen.findByRole("link", { name: "ჩარლზ შარპი" }),
    ).toHaveAttribute("href", "/authors/charles-j-sharp");
  });
});
