import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { clearSiteCache } from "./site";
import {
  type AdminSpecies,
  clearSpeciesCache,
  fetchAdminSpecies,
  SessionExpiredError,
} from "./species";
import { SpeciesPage } from "./SpeciesPage";

vi.mock("./species", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./species")>()),
  clearSpeciesCache: vi.fn(),
  fetchAdminSpecies: vi.fn(),
}));

vi.mock("./site", () => ({ clearSiteCache: vi.fn() }));

async function confirmIn(popupTitle: string) {
  const popup = (await screen.findByText(popupTitle)).closest(
    ".ant-popover",
  ) as HTMLElement;
  await userEvent.click(
    within(popup).getByRole("button", { name: "Clear cache" }),
  );
}

function species(overrides: Partial<AdminSpecies>): AdminSpecies {
  return {
    commonName: { en: "Levantine viper", ka: "გიურზა" },
    danger: "High",
    group: "snake",
    id: "macrovipera-lebetina",
    image: null,
    lastEditedAt: null,
    pendingDrafts: 0,
    photoCount: 8,
    scientificName: "Macrovipera lebetinus",
    slug: "giurza",
    status: "published",
    version: 1,
    ...overrides,
  };
}

const LIST = [
  species({}),
  species({
    commonName: { en: "Eurasian eagle-owl", ka: "ბუ" },
    danger: null,
    group: "bird",
    id: "bubo-bubo",
    pendingDrafts: 2,
    scientificName: "Bubo bubo",
    slug: "bubo-bubo",
    status: "unpublished",
  }),
];

beforeEach(() => {
  vi.mocked(fetchAdminSpecies).mockReset();
  vi.mocked(clearSpeciesCache).mockReset();
  vi.mocked(clearSiteCache).mockReset();
});

describe("SpeciesPage", () => {
  it("lists every species with its status and drafts", async () => {
    vi.mocked(fetchAdminSpecies).mockResolvedValue(LIST);
    render(<SpeciesPage onSessionExpired={vi.fn()} />);
    expect(await screen.findByText("გიურზა")).toBeInTheDocument();
    expect(screen.getByText("ბუ")).toBeInTheDocument();
    expect(screen.getByText("unpublished")).toBeInTheDocument();
    expect(screen.getByText("2 of 2 species")).toBeInTheDocument();
  });

  it("searches by name, scientific name or id", async () => {
    vi.mocked(fetchAdminSpecies).mockResolvedValue(LIST);
    render(<SpeciesPage onSessionExpired={vi.fn()} />);
    await screen.findByText("გიურზა");
    await userEvent.type(screen.getByLabelText("Search species"), "bubo");
    expect(screen.queryByText("გიურზა")).toBeNull();
    expect(screen.getByText("1 of 2 species")).toBeInTheDocument();
  });

  it("returns to sign-in when the session has expired", async () => {
    vi.mocked(fetchAdminSpecies).mockRejectedValue(new SessionExpiredError());
    const onSessionExpired = vi.fn();
    render(<SpeciesPage onSessionExpired={onSessionExpired} />);
    await vi.waitFor(() => expect(onSessionExpired).toHaveBeenCalledOnce());
  });

  it("offers a retry when loading fails", async () => {
    vi.mocked(fetchAdminSpecies)
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce(LIST);
    render(<SpeciesPage onSessionExpired={vi.fn()} />);
    const alert = await screen.findByText("Could not load species.");
    await userEvent.click(
      within(alert.closest(".ant-alert") as HTMLElement).getByRole("button", {
        name: "Retry",
      }),
    );
    expect(await screen.findByText("გიურზა")).toBeInTheDocument();
    expect(fetchAdminSpecies).toHaveBeenCalledTimes(2);
  });

  it("links each species to its detail page", async () => {
    vi.mocked(fetchAdminSpecies).mockResolvedValue(LIST);
    render(<SpeciesPage onSessionExpired={vi.fn()} />);
    expect(await screen.findByRole("link", { name: "გიურზა" })).toHaveAttribute(
      "href",
      "/species/macrovipera-lebetina",
    );
  });

  it("clears one species from its row", async () => {
    vi.mocked(fetchAdminSpecies).mockResolvedValue(LIST);
    vi.mocked(clearSpeciesCache).mockResolvedValue();
    render(<SpeciesPage onSessionExpired={vi.fn()} />);
    const row = (await screen.findByText("bubo-bubo")).closest("tr")!;
    await userEvent.click(
      within(row).getByRole("button", { name: "Clear cache" }),
    );
    await confirmIn("Clear this species' cache?");
    expect(clearSpeciesCache).toHaveBeenCalledExactlyOnceWith("bubo-bubo");
    expect(
      await screen.findByText("Cache cleared for bubo-bubo."),
    ).toBeInTheDocument();
  });

  it("clears every species page from the header", async () => {
    vi.mocked(fetchAdminSpecies).mockResolvedValue(LIST);
    vi.mocked(clearSiteCache).mockResolvedValue(["bubo-bubo"]);
    render(<SpeciesPage onSessionExpired={vi.fn()} />);
    await screen.findByText("bubo-bubo");
    await userEvent.click(
      screen.getByRole("button", { name: "Clear species cache" }),
    );
    await confirmIn("Clear the whole species cache?");
    expect(clearSiteCache).toHaveBeenCalledOnce();
    expect(
      await screen.findByText(
        "Species cache cleared. 1 recently edited species refetched.",
      ),
    ).toBeInTheDocument();
  });
});
