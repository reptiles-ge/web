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
  setSpeciesStatuses,
} from "./species";
import { SpeciesPage } from "./SpeciesPage";

vi.mock("./species", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./species")>()),
  clearSpeciesCache: vi.fn(),
  fetchAdminSpecies: vi.fn(),
  setSpeciesStatuses: vi.fn(),
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
  vi.mocked(setSpeciesStatuses).mockReset();
});

async function confirmStatus(count: number, status: string) {
  const popup = (
    await screen.findByText(`Set ${count} species to ${status}?`)
  ).closest(".ant-popover") as HTMLElement;
  await userEvent.click(
    within(popup).getByRole("button", { name: "Set status" }),
  );
}

async function selectRow(id: string) {
  const row = (await screen.findByText(id)).closest("tr")!;
  await userEvent.click(within(row).getByRole("checkbox"));
}

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
    await userEvent.click(within(screen.getByTitle("3")).getByRole("button"));
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

  it("keeps the filters, search and page in the URL", async () => {
    vi.mocked(fetchAdminSpecies).mockResolvedValue(PAGE);
    render(<SpeciesPage onSessionExpired={vi.fn()} />);
    await screen.findByText("გიურზა");
    const header = screen.getByRole("columnheader", { name: /Status/ });
    await userEvent.click(within(header).getByRole("button"));
    await userEvent.click(await screen.findByText("draft"));
    await userEvent.click(screen.getByRole("button", { name: "OK" }));
    await userEvent.type(screen.getByLabelText("Search species"), "bubo");
    await vi.waitFor(() =>
      expect(window.location.search).toBe("?status=draft&q=bubo"),
    );
  });

  it("restores the filters and search from the URL after a reload", async () => {
    window.history.replaceState(
      null,
      "",
      "/species?group=bird&status=nope&q=bubo&page=2&limit=20",
    );
    vi.mocked(fetchAdminSpecies).mockResolvedValue(PAGE);
    render(<SpeciesPage onSessionExpired={vi.fn()} />);
    await screen.findByText("გიურზა");
    expect(fetchAdminSpecies).toHaveBeenCalledExactlyOnceWith({
      group: "bird",
      limit: 20,
      page: 2,
      q: "bubo",
    });
    expect(screen.getByLabelText("Search species")).toHaveValue("bubo");
    expect(window.location.search).toBe("?group=bird&q=bubo&page=2&limit=20");
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

  it("sets the status of the selected species in one request", async () => {
    vi.mocked(fetchAdminSpecies).mockResolvedValue(PAGE);
    vi.mocked(setSpeciesStatuses).mockResolvedValue([
      { id: "bubo-bubo", status: "changed", version: 2 },
      {
        code: "invalid_request",
        id: "macrovipera-lebetina",
        message: "The species is already published",
        status: "failed",
      },
    ]);
    render(<SpeciesPage onSessionExpired={vi.fn()} />);
    const apply = await screen.findByRole("button", {
      name: "Set status (0)",
    });
    expect(apply).toBeDisabled();
    await selectRow("bubo-bubo");
    await selectRow("macrovipera-lebetina");
    await userEvent.click(
      screen.getByRole("button", { name: "Set status (2)" }),
    );
    await confirmStatus(2, "published");
    await vi.waitFor(() =>
      expect(setSpeciesStatuses).toHaveBeenCalledExactlyOnceWith(
        [
          { expectedVersion: 1, id: "bubo-bubo" },
          { expectedVersion: 1, id: "macrovipera-lebetina" },
        ],
        "published",
      ),
    );
    expect(
      await screen.findByText(/Set 1 of 2 species to published/),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        "Not changed: macrovipera-lebetina (The species is already published)",
      ),
    ).toBeInTheDocument();
    await vi.waitFor(() => expect(fetchAdminSpecies).toHaveBeenCalledTimes(2));
    expect(screen.getByText("Set status (0)")).toBeInTheDocument();
  });

  it("sends the chosen status and reports a refused request", async () => {
    vi.mocked(fetchAdminSpecies).mockResolvedValue(PAGE);
    vi.mocked(setSpeciesStatuses).mockRejectedValue(
      new Error("Status change failed: 429"),
    );
    render(<SpeciesPage onSessionExpired={vi.fn()} />);
    await selectRow("macrovipera-lebetina");
    await userEvent.click(screen.getByLabelText("New status"));
    await userEvent.click((await screen.findAllByTitle("unpublished")).at(-1)!);
    await userEvent.click(
      screen.getByRole("button", { name: "Set status (1)" }),
    );
    await confirmStatus(1, "unpublished");
    expect(
      await screen.findByText("Status change failed: 429"),
    ).toBeInTheDocument();
    expect(setSpeciesStatuses).toHaveBeenCalledExactlyOnceWith(
      [{ expectedVersion: 1, id: "macrovipera-lebetina" }],
      "unpublished",
    );
  });

  it("returns to sign-in when the session expires during a status change", async () => {
    vi.mocked(fetchAdminSpecies).mockResolvedValue(PAGE);
    vi.mocked(setSpeciesStatuses).mockRejectedValue(new SessionExpiredError());
    const onSessionExpired = vi.fn();
    render(<SpeciesPage onSessionExpired={onSessionExpired} />);
    await selectRow("bubo-bubo");
    await userEvent.click(
      screen.getByRole("button", { name: "Set status (1)" }),
    );
    await confirmStatus(1, "published");
    await vi.waitFor(() => expect(onSessionExpired).toHaveBeenCalledOnce());
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
