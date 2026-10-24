import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  type AdminFieldRecord,
  type AdminSpeciesRecord,
  clearSpeciesCache,
  fetchAdminFieldRecords,
  fetchAdminSpeciesRecord,
  SessionExpiredError,
} from "./species";
import { SpeciesDetailPage } from "./SpeciesDetailPage";

vi.mock("./species", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./species")>()),
  clearSpeciesCache: vi.fn(),
  fetchAdminFieldRecords: vi.fn(),
  fetchAdminSpeciesRecord: vi.fn(),
}));

const RECORD = {
  record: {
    base: {
      commonName: "გიურზა",
      gallery: [
        {
          credit: {
            authorId: "laura-bobby-bok",
            date: "2024-05-01",
            lat: 41.5,
            lng: 45.1,
            location: "Vashlovani",
            photographer: "Laura",
            url: "https://example.org/laura",
          },
          photoConfidence: "georgia-field",
          src: "https://cdn.reptiles.ge/images/giurza-2.jpg",
        },
      ],
      image: "https://cdn.reptiles.ge/macrovipera-lebetina-laura-1.jpg",
      imageCredit: { photographer: "Sandro" },
      mobileImage: "https://cdn.reptiles.ge/images/giurza-m.jpg",
      scientificName: "Macrovipera lebetinus",
    },
    group: "snake",
    status: "published",
    translations: { en: { commonName: "Levantine viper" } },
  },
  version: 7,
} as unknown as AdminSpeciesRecord;

const LOCATIONS: AdminFieldRecord[] = [
  { evidence: "observation", lat: 41.4, lng: 46.2, locality: "Shiraki" },
  {
    lat: 41.3,
    lng: 45.9,
    locality: "Eagle Gorge",
    observerName: "N. Shamiladze",
    source: "iNaturalist",
    url: "https://www.inaturalist.org/observations/1",
  },
];

function show(id = "macrovipera-lebetina", onSessionExpired = vi.fn()) {
  render(<SpeciesDetailPage id={id} onSessionExpired={onSessionExpired} />);
  return onSessionExpired;
}

beforeEach(() => {
  vi.mocked(fetchAdminSpeciesRecord).mockReset().mockResolvedValue(RECORD);
  vi.mocked(fetchAdminFieldRecords).mockReset().mockResolvedValue(LOCATIONS);
  vi.mocked(clearSpeciesCache).mockReset();
});

describe("SpeciesDetailPage", () => {
  it("shows the species with its covers and gallery under Photos", async () => {
    show();
    expect(
      await screen.findByRole("heading", { name: "გიურზა" }),
    ).toBeInTheDocument();
    expect(screen.getByText("version 7")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Photos (3)" })).toBeInTheDocument();
    for (const role of ["Desktop cover", "Mobile cover", "Gallery 1"]) {
      expect(screen.getByText(role)).toBeInTheDocument();
    }
    expect(screen.getByRole("link", { name: "Laura" })).toHaveAttribute(
      "href",
      "/authors/laura-bobby-bok",
    );
    expect(screen.getByText("Sandro").closest("a")).toBeNull();
    const galleryRow = screen.getByText("Gallery 1").closest("tr")!;
    expect(
      within(galleryRow).getByRole("link", { name: "link" }),
    ).toHaveAttribute("href", "https://example.org/laura");
    expect(screen.getByText("georgia-field")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "← Species" })).toHaveAttribute(
      "href",
      "/species",
    );
    expect(fetchAdminSpeciesRecord).toHaveBeenCalledWith(
      "macrovipera-lebetina",
    );
    expect(fetchAdminFieldRecords).toHaveBeenCalledWith("macrovipera-lebetina");
  });

  it("lists field records under Locations", async () => {
    show();
    await userEvent.click(
      await screen.findByRole("tab", { name: "Locations (2)" }),
    );
    expect(await screen.findByText("Shiraki")).toBeInTheDocument();
    const row = screen.getByText("Eagle Gorge").closest("tr")!;
    expect(within(row).getByText("N. Shamiladze")).toBeInTheDocument();
    expect(
      within(row).getByRole("link", { name: "iNaturalist" }),
    ).toHaveAttribute("href", "https://www.inaturalist.org/observations/1");
    expect(
      within(row).getByRole("link", { name: "41.3000, 45.9000" }),
    ).toHaveAttribute(
      "href",
      "https://www.openstreetmap.org/?mlat=41.3&mlon=45.9#map=12/41.3/45.9",
    );
  });

  it("clears this species' cache after confirmation", async () => {
    vi.mocked(clearSpeciesCache).mockResolvedValue();
    show();
    await userEvent.click(
      await screen.findByRole("button", { name: "Clear cache" }),
    );
    const popup = (
      await screen.findByText("Clear this species' cache?")
    ).closest(".ant-popover") as HTMLElement;
    await userEvent.click(
      within(popup).getByRole("button", { name: "Clear cache" }),
    );
    expect(clearSpeciesCache).toHaveBeenCalledExactlyOnceWith(
      "macrovipera-lebetina",
    );
    expect(
      await screen.findByText("Cache cleared for macrovipera-lebetina."),
    ).toBeInTheDocument();
  });

  it("shows 404 for an unknown species", async () => {
    vi.mocked(fetchAdminSpeciesRecord).mockResolvedValue(null);
    vi.mocked(fetchAdminFieldRecords).mockResolvedValue(null);
    show("no-such-species");
    expect(await screen.findByText("Species not found")).toBeInTheDocument();
  });

  it("offers a retry on errors", async () => {
    vi.mocked(fetchAdminSpeciesRecord).mockRejectedValueOnce(
      new Error("offline"),
    );
    show();
    await screen.findByText("Could not load this species.");
    await userEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(
      await screen.findByRole("heading", { name: "გიურზა" }),
    ).toBeInTheDocument();
  });

  it("sends an expired session back to sign-in", async () => {
    vi.mocked(fetchAdminSpeciesRecord).mockRejectedValue(
      new SessionExpiredError(),
    );
    const expired = show();
    await vi.waitFor(() => expect(expired).toHaveBeenCalledOnce());
  });

  it("previews a photo through its optimized variant, not the original", async () => {
    show();
    const row = (await screen.findByText("Desktop cover")).closest("tr")!;
    const thumbnail = row.querySelector("img")!;
    expect(thumbnail).toHaveAttribute(
      "src",
      "https://cdn.reptiles.ge/optimized/macrovipera-lebetina-laura-1-320.webp",
    );
    await userEvent.click(thumbnail);
    await vi.waitFor(() =>
      expect(
        document.querySelector(
          'img[src="https://cdn.reptiles.ge/optimized/macrovipera-lebetina-laura-1-1600.webp"]',
        ),
      ).not.toBeNull(),
    );
    expect(
      document.querySelector(
        'img[src="https://cdn.reptiles.ge/macrovipera-lebetina-laura-1.jpg"]',
      ),
    ).toBeNull();
  });
});
