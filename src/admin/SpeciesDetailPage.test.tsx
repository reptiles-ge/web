import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  type AdminFieldRecord,
  type AdminSpeciesRecord,
  clearSpeciesCache,
  deleteSpeciesPhoto,
  fetchAdminFieldRecords,
  fetchAdminSpeciesRecord,
  reorderSpeciesPhotos,
  saveSpeciesPhotoCredit,
  SessionExpiredError,
  setSpeciesCover,
} from "./species";
import { SpeciesDetailPage } from "./SpeciesDetailPage";

vi.mock("./species", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./species")>()),
  clearSpeciesCache: vi.fn(),
  deleteSpeciesPhoto: vi.fn(),
  fetchAdminFieldRecords: vi.fn(),
  fetchAdminSpeciesRecord: vi.fn(),
  reorderSpeciesPhotos: vi.fn(),
  saveSpeciesPhotoCredit: vi.fn(),
  setSpeciesCover: vi.fn(),
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
  vi.mocked(deleteSpeciesPhoto).mockReset().mockResolvedValue(8);
  vi.mocked(saveSpeciesPhotoCredit).mockReset().mockResolvedValue(8);
  vi.mocked(reorderSpeciesPhotos).mockReset().mockResolvedValue(8);
  vi.mocked(setSpeciesCover).mockReset().mockResolvedValue(8);
});

const SECOND = "https://cdn.reptiles.ge/images/giurza-3.jpg";
const FIRST = "https://cdn.reptiles.ge/images/giurza-2.jpg";

async function coverDialog() {
  const title = await screen.findByText("Cover preview", {
    selector: ".ant-modal-title",
  });
  return title.closest<HTMLElement>('[role="dialog"]')!;
}

function galleryRoles() {
  return screen
    .getAllByText(/^Gallery \d$/)
    .map((tag) => tag.closest("tr")!.querySelector("img")!.getAttribute("src"));
}

function withSecondPhoto(): AdminSpeciesRecord {
  const copy = structuredClone(RECORD);
  copy.record.base.gallery.push({
    credit: { photographer: "ნიკა" },
    src: "https://cdn.reptiles.ge/images/giurza-3.jpg",
  });
  copy.record.translations.en.gallery = [
    {
      credit: { location: "Shiraki", photographer: "Nika" },
      src: "https://cdn.reptiles.ge/images/giurza-3.jpg",
    },
  ];
  return copy;
}

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

  it("offers edit and delete on gallery photos only", async () => {
    show();
    const cover = (await screen.findByText("Desktop cover")).closest("tr")!;
    expect(within(cover).queryByRole("button", { name: "Edit" })).toBeNull();
    const gallery = screen.getByText("Gallery 1").closest("tr")!;
    expect(within(gallery).getByRole("button", { name: "Edit" })).toBeEnabled();
    expect(
      within(gallery).getByRole("button", { name: "Delete" }),
    ).toBeDisabled();
  });

  it("edits a photo credit with its English overlay and reloads", async () => {
    vi.mocked(fetchAdminSpeciesRecord).mockResolvedValue(withSecondPhoto());
    show();
    const row = (await screen.findByText("Gallery 2")).closest("tr")!;
    await userEvent.click(within(row).getByRole("button", { name: "Edit" }));
    const dialog = await screen.findByRole("dialog", {
      name: "Edit photo credit",
    });
    expect(
      within(dialog).getByLabelText("Photographer (Georgian)"),
    ).toHaveValue("ნიკა");
    expect(within(dialog).getByLabelText("Photographer (English)")).toHaveValue(
      "Nika",
    );
    expect(within(dialog).getByLabelText("Place (English)")).toHaveValue(
      "Shiraki",
    );
    const place = within(dialog).getByLabelText("Place (Georgian)");
    await userEvent.type(place, "შირაქი");
    await userEvent.click(within(dialog).getByRole("button", { name: "Save" }));
    await vi.waitFor(() =>
      expect(saveSpeciesPhotoCredit).toHaveBeenCalledExactlyOnceWith(
        "macrovipera-lebetina",
        "https://cdn.reptiles.ge/images/giurza-3.jpg",
        expect.objectContaining({
          georgiaField: false,
          location: "შირაქი",
          locationEn: "Shiraki",
          photographer: "ნიკა",
          photographerEn: "Nika",
        }),
        7,
      ),
    );
    expect(await screen.findByText("version 8")).toBeInTheDocument();
    expect(fetchAdminSpeciesRecord).toHaveBeenCalledTimes(2);
  });

  it("shows why a credit was refused", async () => {
    vi.mocked(saveSpeciesPhotoCredit).mockRejectedValue(
      new Error("საქართველოს ველის ფოტოს ადგილი სავალდებულოა"),
    );
    show();
    const row = (await screen.findByText("Gallery 1")).closest("tr")!;
    await userEvent.click(within(row).getByRole("button", { name: "Edit" }));
    const dialog = await screen.findByRole("dialog", {
      name: "Edit photo credit",
    });
    expect(
      within(dialog).getByRole("checkbox", {
        name: "Taken in Georgia (needs a place)",
      }),
    ).toBeChecked();
    await userEvent.click(within(dialog).getByRole("button", { name: "Save" }));
    expect(
      await within(dialog).findByText(
        "საქართველოს ველის ფოტოს ადგილი სავალდებულოა",
      ),
    ).toBeInTheDocument();
  });

  it("deletes a gallery photo after confirmation", async () => {
    vi.mocked(fetchAdminSpeciesRecord).mockResolvedValue(withSecondPhoto());
    show();
    const row = (await screen.findByText("Gallery 2")).closest("tr")!;
    await userEvent.click(within(row).getByRole("button", { name: "Delete" }));
    const popup = (await screen.findByText("Delete this photo?")).closest(
      ".ant-popover",
    ) as HTMLElement;
    await userEvent.click(
      within(popup).getByRole("button", { name: "Delete" }),
    );
    expect(deleteSpeciesPhoto).toHaveBeenCalledExactlyOnceWith(
      "macrovipera-lebetina",
      "https://cdn.reptiles.ge/images/giurza-3.jpg",
      7,
    );
    expect(
      await screen.findByText("Photo removed from the gallery."),
    ).toBeInTheDocument();
  });

  it("sends an expired session from a photo delete back to sign-in", async () => {
    vi.mocked(fetchAdminSpeciesRecord).mockResolvedValue(withSecondPhoto());
    vi.mocked(deleteSpeciesPhoto).mockRejectedValue(new SessionExpiredError());
    const expired = show();
    const row = (await screen.findByText("Gallery 2")).closest("tr")!;
    await userEvent.click(within(row).getByRole("button", { name: "Delete" }));
    const popup = (await screen.findByText("Delete this photo?")).closest(
      ".ant-popover",
    ) as HTMLElement;
    await userEvent.click(
      within(popup).getByRole("button", { name: "Delete" }),
    );
    await vi.waitFor(() => expect(expired).toHaveBeenCalledOnce());
  });

  it("moves a photo up and saves the new gallery order", async () => {
    vi.mocked(fetchAdminSpeciesRecord).mockResolvedValue(withSecondPhoto());
    show();
    const row = (await screen.findByText("Gallery 2")).closest("tr")!;
    expect(
      within(row).getByRole("button", { name: "Move Gallery 2 down" }),
    ).toBeDisabled();
    await userEvent.click(
      within(row).getByRole("button", { name: "Move Gallery 2 up" }),
    );
    expect(reorderSpeciesPhotos).toHaveBeenCalledExactlyOnceWith(
      "macrovipera-lebetina",
      [SECOND, FIRST],
      7,
    );
    expect(await screen.findByText("Gallery order saved.")).toBeInTheDocument();
    expect(galleryRoles()[0]).toContain("giurza-3");
    expect(await screen.findByText("version 8")).toBeInTheDocument();
  });

  it("reorders the gallery by dragging a row onto another", async () => {
    vi.mocked(fetchAdminSpeciesRecord).mockResolvedValue(withSecondPhoto());
    show();
    const second = (await screen.findByText("Gallery 2")).closest("tr")!;
    const first = screen.getByText("Gallery 1").closest("tr")!;
    expect(second).toHaveAttribute("draggable", "true");
    expect(screen.getByText("Desktop cover").closest("tr")).not.toHaveAttribute(
      "draggable",
    );
    const dataTransfer = { effectAllowed: "", setData: vi.fn() };
    fireEvent.dragStart(second, { dataTransfer });
    fireEvent.dragOver(first, { dataTransfer });
    fireEvent.drop(first, { dataTransfer });
    expect(dataTransfer.setData).toHaveBeenCalledWith("text/plain", SECOND);
    await vi.waitFor(() =>
      expect(reorderSpeciesPhotos).toHaveBeenCalledExactlyOnceWith(
        "macrovipera-lebetina",
        [SECOND, FIRST],
        7,
      ),
    );
  });

  it("puts the order back and explains when the save fails", async () => {
    vi.mocked(fetchAdminSpeciesRecord).mockResolvedValue(withSecondPhoto());
    vi.mocked(reorderSpeciesPhotos).mockRejectedValue(
      new Error("Someone saved a newer version."),
    );
    show();
    const row = (await screen.findByText("Gallery 2")).closest("tr")!;
    await userEvent.click(
      within(row).getByRole("button", { name: "Move Gallery 2 up" }),
    );
    expect(
      await screen.findByText("Someone saved a newer version."),
    ).toBeInTheDocument();
    expect(galleryRoles()[0]).toContain("giurza-2");
  });

  it("previews a photo as desktop and mobile cover and makes it the mobile cover", async () => {
    vi.mocked(fetchAdminSpeciesRecord).mockResolvedValue(withSecondPhoto());
    show();
    const row = (await screen.findByText("Gallery 2")).closest("tr")!;
    await userEvent.click(within(row).getByRole("button", { name: "Cover" }));
    const dialog = await coverDialog();
    const candidate = within(dialog).getByRole("region", {
      name: "This photo as cover",
    });
    expect(
      within(candidate).getAllByRole("img", { name: /header preview/ }),
    ).toHaveLength(3);
    expect(
      within(candidate)
        .getByRole("img", { name: "Desktop header preview" })
        .querySelector("img")!
        .getAttribute("src"),
    ).toContain("giurza-3");
    const now = within(dialog).getByRole("region", { name: "Covers now" });
    expect(
      within(now)
        .getAllByRole("img", { name: "Mobile header preview" })[0]!
        .querySelector("img")!
        .getAttribute("src"),
    ).toContain("giurza-m");
    await userEvent.click(
      within(dialog).getByRole("button", { name: "Make mobile cover" }),
    );
    expect(setSpeciesCover).toHaveBeenCalledExactlyOnceWith(
      "macrovipera-lebetina",
      SECOND,
      "mobile",
      7,
    );
    expect(await screen.findByText("Mobile cover saved.")).toBeInTheDocument();
  });

  it("disables the cover a photo already is and shows a refused save", async () => {
    const record = withSecondPhoto();
    record.record.base.image = FIRST;
    vi.mocked(fetchAdminSpeciesRecord).mockResolvedValue(record);
    vi.mocked(setSpeciesCover).mockRejectedValue(new Error("Cover refused"));
    show();
    const row = (await screen.findByText("Gallery 1")).closest("tr")!;
    await userEvent.click(within(row).getByRole("button", { name: "Cover" }));
    const dialog = await coverDialog();
    expect(
      within(dialog).getByRole("button", { name: "Make desktop cover" }),
    ).toBeDisabled();
    expect(within(dialog).getByText("this photo")).toBeInTheDocument();
    await userEvent.click(
      within(dialog).getByRole("button", { name: "Make both covers" }),
    );
    expect(
      await within(dialog).findByText("Cover refused"),
    ).toBeInTheDocument();
  });

  it("sends an expired session from a cover or order change back to sign-in", async () => {
    vi.mocked(fetchAdminSpeciesRecord).mockResolvedValue(withSecondPhoto());
    vi.mocked(setSpeciesCover).mockRejectedValue(new SessionExpiredError());
    vi.mocked(reorderSpeciesPhotos).mockRejectedValue(
      new SessionExpiredError(),
    );
    const expired = show();
    const row = (await screen.findByText("Gallery 2")).closest("tr")!;
    await userEvent.click(
      within(row).getByRole("button", { name: "Move Gallery 2 up" }),
    );
    await vi.waitFor(() => expect(expired).toHaveBeenCalledOnce());
    await userEvent.click(within(row).getByRole("button", { name: "Cover" }));
    const dialog = await coverDialog();
    await userEvent.click(
      within(dialog).getByRole("button", { name: "Make both covers" }),
    );
    await vi.waitFor(() => expect(expired).toHaveBeenCalledTimes(2));
  });
});
