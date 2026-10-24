import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthorDetailPage } from "./AuthorDetailPage";
import {
  type AdminAuthorPhoto,
  type AdminAuthorRecord,
  clearAuthorCache,
  fetchAdminAuthorPhotos,
  fetchAdminAuthorRecord,
} from "./authors";
import { SessionExpiredError } from "./species";

vi.mock("./authors", () => ({
  clearAuthorCache: vi.fn(),
  fetchAdminAuthorPhotos: vi.fn(),
  fetchAdminAuthorRecord: vi.fn(),
}));

const AUTHOR = {
  affiliations: ["ilia-state-university"],
  aliases: ["Sandro Khakhva", "S. Khakhva"],
  id: "sandro-khakhva",
  isContributor: true,
  jobTitle: "herpetologist",
  kind: "person",
  links: { inaturalist: "https://www.inaturalist.org/people/sandro" },
  portraitClass: null,
  portraitSrc: null,
  role: "photographer",
  texts: {
    en: { bio: "Field herpetologist.", name: "Sandro Khakhva" },
    ka: { bio: "ჰერპეტოლოგი.", name: "სანდრო ხახვა" },
  },
} as unknown as AdminAuthorRecord;

const PHOTOS: AdminAuthorPhoto[] = [
  {
    date: "2024-05-01",
    location: "Vashlovani",
    role: "hero",
    speciesId: "macrovipera-lebetina",
    speciesName: { en: "Levantine viper", ka: "გიურზა" },
    src: "https://cdn.reptiles.ge/macrovipera-lebetina-laura-1.jpg",
    status: "published",
  },
  {
    date: "2024-05-01",
    location: "Vashlovani",
    role: "gallery",
    speciesId: "macrovipera-lebetina",
    speciesName: { en: "Levantine viper", ka: "გიურზა" },
    src: "https://cdn.reptiles.ge/macrovipera-lebetina-laura-1.jpg",
    status: "published",
  },
];

function show(id = "sandro-khakhva", onSessionExpired = vi.fn()) {
  render(<AuthorDetailPage id={id} onSessionExpired={onSessionExpired} />);
  return onSessionExpired;
}

beforeEach(() => {
  vi.mocked(fetchAdminAuthorRecord).mockReset().mockResolvedValue(AUTHOR);
  vi.mocked(fetchAdminAuthorPhotos).mockReset().mockResolvedValue(PHOTOS);
  vi.mocked(clearAuthorCache).mockReset();
});

describe("AuthorDetailPage", () => {
  it("shows the profile with texts per locale, aliases and links", async () => {
    show();
    expect(
      await screen.findByRole("heading", { name: "სანდრო ხახვა" }),
    ).toBeInTheDocument();
    expect(screen.getByText("contributor")).toBeInTheDocument();
    expect(screen.getByText("S. Khakhva")).toBeInTheDocument();
    expect(screen.getByText("ilia-state-university")).toBeInTheDocument();
    expect(screen.getByText("Field herpetologist.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "iNaturalist" })).toHaveAttribute(
      "href",
      "https://www.inaturalist.org/people/sandro",
    );
    expect(screen.getByRole("link", { name: "← Authors" })).toHaveAttribute(
      "href",
      "/authors",
    );
  });

  it("lists credited photos linked to their species, a cover and the same gallery photo as two rows", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    show();
    await userEvent.click(
      await screen.findByRole("tab", { name: "Photos (2)" }),
    );
    const [speciesLink] = await screen.findAllByRole("link", {
      name: "გიურზა",
    });
    expect(speciesLink).toHaveAttribute(
      "href",
      "/species/macrovipera-lebetina",
    );
    expect(screen.getByText("hero")).toBeInTheDocument();
    const row = screen.getByText("gallery").closest("tr")!;
    expect(row.querySelector("img")).toHaveAttribute(
      "src",
      "https://cdn.reptiles.ge/optimized/macrovipera-lebetina-laura-1-320.webp",
    );
    expect(
      error.mock.calls.some(([message]) =>
        String(message).includes("same key"),
      ),
    ).toBe(false);
    error.mockRestore();
  });

  it("clears a contributor's cache, and offers none to credit-only authors", async () => {
    vi.mocked(clearAuthorCache).mockResolvedValue();
    show();
    await userEvent.click(
      await screen.findByRole("button", { name: "Clear cache" }),
    );
    const popup = (
      await screen.findByText("Clear this contributor's cache?")
    ).closest(".ant-popover") as HTMLElement;
    await userEvent.click(
      within(popup).getByRole("button", { name: "Clear cache" }),
    );
    expect(clearAuthorCache).toHaveBeenCalledExactlyOnceWith("sandro-khakhva");
  });

  it("hides the clear for an author without a contributor page", async () => {
    vi.mocked(fetchAdminAuthorRecord).mockResolvedValue({
      ...AUTHOR,
      isContributor: false,
    });
    show();
    expect(await screen.findByText("photo credit only")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Clear cache" })).toBeNull();
  });

  it("shows 404 for an unknown author", async () => {
    vi.mocked(fetchAdminAuthorRecord).mockResolvedValue(null);
    show("nobody");
    expect(await screen.findByText("Author not found")).toBeInTheDocument();
  });

  it("sends an expired session back to sign-in", async () => {
    vi.mocked(fetchAdminAuthorRecord).mockRejectedValue(
      new SessionExpiredError(),
    );
    const expired = show();
    await vi.waitFor(() => expect(expired).toHaveBeenCalledOnce());
  });
});
