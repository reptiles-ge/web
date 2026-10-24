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
  vi.mocked(fetchAdminAuthors).mockResolvedValue([CONTRIBUTOR, CREDIT_ONLY]);
  render(<AuthorsPage onSessionExpired={onSessionExpired} />);
  return onSessionExpired;
}

describe("AuthorsPage", () => {
  it("lists contributors and credit-only authors", async () => {
    open();
    expect(await screen.findByText("სანდრო ხახვა")).toBeInTheDocument();
    expect(screen.getByText("ჩარლზ შარპი")).toBeInTheDocument();
    expect(screen.getByText("contributor")).toBeInTheDocument();
    expect(screen.getByText("2 of 2 authors")).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText("Search authors"), "sharp");
    expect(screen.getByText("1 of 2 authors")).toBeInTheDocument();
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
});
