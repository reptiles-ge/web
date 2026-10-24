import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  type AdminSpecies,
  fetchAdminSpecies,
  SessionExpiredError,
} from "./species";
import { SpeciesPage } from "./SpeciesPage";

vi.mock("./species", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./species")>()),
  fetchAdminSpecies: vi.fn(),
}));

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
});
