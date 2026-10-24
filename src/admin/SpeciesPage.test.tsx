import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { toPage } from "@/lib/pagination";

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

const FIRST = { limit: 50, page: 1 };

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

const PAGE = toPage(LIST, LIST.length, FIRST);

beforeEach(() => {
  vi.mocked(fetchAdminSpecies).mockReset();
  vi.mocked(clearSpeciesCache).mockReset();
  vi.mocked(clearSiteCache).mockReset();
});

describe("SpeciesPage", () => {
  it("lists every species with its status and drafts", async () => {
    vi.mocked(fetchAdminSpecies).mockResolvedValue(PAGE);
    render(<SpeciesPage onSessionExpired={vi.fn()} />);
    expect(await screen.findByText("გიურზა")).toBeInTheDocument();
    expect(screen.getByText("ბუ")).toBeInTheDocument();
    expect(screen.getByText("unpublished")).toBeInTheDocument();
    expect(screen.getByText("1–2 of 2 species")).toBeInTheDocument();
    expect(fetchAdminSpecies).toHaveBeenCalledExactlyOnceWith(FIRST);
  });

  it("asks the API for the search once typing stops", async () => {
    vi.mocked(fetchAdminSpecies).mockResolvedValue(PAGE);
    render(<SpeciesPage onSessionExpired={vi.fn()} />);
    await screen.findByText("გიურზა");
    vi.mocked(fetchAdminSpecies).mockResolvedValue(
      toPage(LIST.slice(1), 1, FIRST),
    );
    await userEvent.type(screen.getByLabelText("Search species"), "bubo");
    expect(await screen.findByText("1–1 of 1 species")).toBeInTheDocument();
    expect(screen.queryByText("გიურზა")).toBeNull();
    expect(fetchAdminSpecies).toHaveBeenLastCalledWith({ ...FIRST, q: "bubo" });
  });

  it("loads the next page from the API", async () => {
    vi.mocked(fetchAdminSpecies).mockResolvedValue(toPage(LIST, 146, FIRST));
    render(<SpeciesPage onSessionExpired={vi.fn()} />);
    expect(await screen.findByText("1–2 of 146 species")).toBeInTheDocument();
    vi.mocked(fetchAdminSpecies).mockResolvedValue(
      toPage(LIST.slice(1), 146, { limit: 50, page: 3 }),
    );
    await userEvent.click(screen.getByTitle("3"));
    expect(
      await screen.findByText("101–101 of 146 species"),
    ).toBeInTheDocument();
    expect(fetchAdminSpecies).toHaveBeenLastCalledWith({ limit: 50, page: 3 });
  });

  it("filters by group on the server from page one", async () => {
    vi.mocked(fetchAdminSpecies).mockResolvedValue(PAGE);
    render(<SpeciesPage onSessionExpired={vi.fn()} />);
    await screen.findByText("გიურზა");
    const header = screen.getByRole("columnheader", { name: /Group/ });
    await userEvent.click(within(header).getByRole("button"));
    await userEvent.click(await screen.findByText("turtle"));
    await userEvent.click(screen.getByRole("button", { name: "OK" }));
    await vi.waitFor(() =>
      expect(fetchAdminSpecies).toHaveBeenLastCalledWith({
        ...FIRST,
        group: "turtle",
        status: undefined,
      }),
    );
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
      .mockResolvedValueOnce(PAGE);
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
    vi.mocked(fetchAdminSpecies).mockResolvedValue(PAGE);
    render(<SpeciesPage onSessionExpired={vi.fn()} />);
    expect(await screen.findByRole("link", { name: "გიურზა" })).toHaveAttribute(
      "href",
      "/species/macrovipera-lebetina",
    );
  });

  it("clears one species from its row", async () => {
    vi.mocked(fetchAdminSpecies).mockResolvedValue(PAGE);
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
    vi.mocked(fetchAdminSpecies).mockResolvedValue(PAGE);
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
