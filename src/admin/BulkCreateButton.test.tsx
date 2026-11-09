import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { PhotoCandidate } from "./photoCandidates";
import type { EncodedPhoto } from "./photoEncoding";

import { SessionExpiredError } from "./adminResponse";
import { BulkCreateButton } from "./BulkCreateButton";
import {
  encodePhotoFile,
  importINaturalistLookup,
  type PhotoCreditFields,
  uploadSpeciesPhoto,
} from "./photos";
import { fetchAdminSpeciesRecord, reorderSpeciesPhotos } from "./species";

vi.mock("./photos", () => ({
  encodePhotoFile: vi.fn(),
  importINaturalistLookup: vi.fn(),
  uploadSpeciesPhoto: vi.fn(),
}));
vi.mock("./species", () => ({
  fetchAdminSpeciesRecord: vi.fn(),
  reorderSpeciesPhotos: vi.fn(),
}));

const CDN = "https://cdn.reptiles.ge/larus-genei";
let gallery: string[] = [];

const ENCODED = {
  derivatives: [],
  height: 1,
  width: 1,
} as unknown as EncodedPhoto;

function candidate(key: string, observer: string): PhotoCandidate {
  return {
    faves: 1,
    georgia: true,
    key,
    licence: "cc-by",
    lookup: { photoUrl: key } as PhotoCandidate["lookup"],
    observationUrl: `https://www.inaturalist.org/observations/${key}`,
    observedOn: "2025-05-01",
    observer,
    observerName: "",
    place: "Batumi",
    previewUrl: `https://example.test/${key}.jpg`,
    small: false,
  };
}

function card(index: number) {
  return screen
    .getByAltText(new RegExp(`^Observation ${index} by`))
    .closest(".ant-card") as HTMLElement;
}

function imported(key: string, photographer: string) {
  return {
    file: new File(["x"], `inaturalist-${key}.jpg`, { type: "image/jpeg" }),
    metadata: {
      date: "2025-05-01",
      georgiaField: key !== "2",
      lat: 41.6,
      license: "cc-by",
      lng: 41.6,
      location: `Place ${key}`,
      photographer,
      photographerName: photographer === "ana" ? "Ana B" : photographer,
      url: "",
    },
  };
}

function setup(candidates = [candidate("1", "ana"), candidate("2", "beka")]) {
  const onSessionExpired = vi.fn();
  const onUploaded = vi.fn();
  render(
    <BulkCreateButton
      candidates={candidates}
      id="larus-genei"
      onSessionExpired={onSessionExpired}
      onUploaded={onUploaded}
    />,
  );
  return { onSessionExpired, onUploaded, user: userEvent.setup() };
}

beforeEach(() => {
  vi.mocked(importINaturalistLookup)
    .mockReset()
    .mockImplementation(async (_id, lookup) =>
      lookup.photoUrl === "1" ? imported("1", "ana") : imported("2", "beka"),
    );
  vi.mocked(encodePhotoFile).mockReset().mockResolvedValue(ENCODED);
  gallery = [`${CDN}-old.jpg`];
  vi.mocked(uploadSpeciesPhoto)
    .mockReset()
    .mockImplementation(async (_id, credit: PhotoCreditFields) => {
      const src = `${CDN}-${credit.photographer}.jpg`;
      if (credit.photographer === "ana") {
        await new Promise((resolve) => setTimeout(resolve, 30));
      }
      gallery.push(src);
      return { optimized: true, photo: { src }, version: 2 };
    });
  vi.mocked(fetchAdminSpeciesRecord)
    .mockReset()
    .mockImplementation(
      async () =>
        ({
          record: { base: { gallery: gallery.map((src) => ({ src })) } },
          version: 7,
        }) as unknown as Awaited<ReturnType<typeof fetchAdminSpeciesRecord>>,
    );
  vi.mocked(reorderSpeciesPhotos).mockReset().mockResolvedValue(8);
});

async function openReady(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: "Bulk create" }));
  await waitFor(() =>
    expect(
      within(card(2)).getByLabelText("Photographer (Georgian)"),
    ).toHaveValue("beka"),
  );
}

describe("BulkCreateButton", () => {
  it("is off without saved photos", () => {
    setup([]);
    expect(screen.getByRole("button", { name: "Bulk create" })).toBeDisabled();
  });

  it("fills one form per saved photo from iNaturalist", async () => {
    const { user } = setup();
    await openReady(user);
    expect(importINaturalistLookup).toHaveBeenCalledTimes(2);
    expect(within(card(1)).getByLabelText("Place (English)")).toHaveValue(
      "Place 1",
    );
    expect(
      within(card(1)).getByLabelText("Taken in Georgia (needs a place)"),
    ).toBeChecked();
    expect(
      within(card(2)).getByLabelText("Taken in Georgia (needs a place)"),
    ).not.toBeChecked();
    expect(within(card(1)).getByText("Ana B")).toBeInTheDocument();
    expect(within(card(1)).getByLabelText("Source link")).toHaveValue("");
    for (const index of [1, 2]) {
      expect(
        within(card(index)).getByLabelText("Photographer (Georgian)"),
      ).toHaveAttribute("name", "photographer");
      expect(
        within(card(index)).getByLabelText("Place (English)"),
      ).toHaveAttribute("name", "locationEn");
    }
    const upload = screen.getByText("Upload 2 photos").closest("button")!;
    expect(upload).toHaveAttribute("type", "submit");
    expect(upload.getAttribute("form")).toBe(
      card(1).closest("form")?.getAttribute("id"),
    );
  });

  it("uploads every photo with its own credit in one click", async () => {
    const { onUploaded, user } = setup();
    await openReady(user);
    const place = within(card(1)).getByLabelText("Place (Georgian)");
    await user.clear(place);
    await user.type(place, "ბათუმი");
    await user.click(screen.getByRole("button", { name: "Upload 2 photos" }));
    await screen.findByText(/2 photos added to the gallery/);
    expect(uploadSpeciesPhoto).toHaveBeenCalledWith(
      "larus-genei",
      expect.objectContaining({
        georgiaField: true,
        location: "ბათუმი",
        photographer: "ana",
      }),
      ENCODED,
    );
    expect(uploadSpeciesPhoto).toHaveBeenCalledWith(
      "larus-genei",
      expect.objectContaining({ georgiaField: false, photographer: "beka" }),
      ENCODED,
    );
    expect(screen.getAllByText("Added")).toHaveLength(2);
    expect(onUploaded).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Upload").closest("button")).toBeDisabled();
  });

  it("uploads at the same time and keeps the saved order in the gallery", async () => {
    let running = 0;
    let most = 0;
    vi.mocked(encodePhotoFile).mockImplementation(async () => {
      running += 1;
      most = Math.max(most, running);
      await new Promise((resolve) => setTimeout(resolve, 10));
      running -= 1;
      return ENCODED;
    });
    const { user } = setup();
    await openReady(user);
    await user.click(screen.getByRole("button", { name: "Upload 2 photos" }));
    await screen.findByText(/2 photos added to the gallery/);
    expect(most).toBe(2);
    expect(gallery).toStrictEqual([
      `${CDN}-old.jpg`,
      `${CDN}-beka.jpg`,
      `${CDN}-ana.jpg`,
    ]);
    expect(reorderSpeciesPhotos).toHaveBeenCalledWith(
      "larus-genei",
      [`${CDN}-old.jpg`, `${CDN}-ana.jpg`, `${CDN}-beka.jpg`],
      7,
    );
  });

  it("warns when the order cannot be kept", async () => {
    vi.mocked(reorderSpeciesPhotos).mockRejectedValue(new Error("Nope"));
    const { onUploaded, user } = setup();
    await openReady(user);
    await user.click(screen.getByRole("button", { name: "Upload 2 photos" }));
    await screen.findByText(/their order could not be kept/);
    expect(onUploaded).toHaveBeenCalledTimes(1);
  });

  it("leaves a removed photo out", async () => {
    const { user } = setup();
    await openReady(user);
    await user.click(screen.getByRole("button", { name: "Remove photo 1" }));
    await user.click(screen.getByRole("button", { name: "Upload 1 photo" }));
    await screen.findByText(/1 photo added to the gallery/);
    expect(uploadSpeciesPhoto).toHaveBeenCalledWith(
      "larus-genei",
      expect.objectContaining({ photographer: "beka" }),
      ENCODED,
    );
  });

  it("keeps a failed photo to send again", async () => {
    vi.mocked(uploadSpeciesPhoto).mockRejectedValueOnce(
      new Error("Derivatives are missing"),
    );
    const { onUploaded, user } = setup();
    await openReady(user);
    await user.click(screen.getByRole("button", { name: "Upload 2 photos" }));
    await screen.findByText("Derivatives are missing");
    await screen.findByText(/1 photo added to the gallery/);
    expect(onUploaded).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole("button", { name: "Upload 1 photo" }));
    await screen.findByText(/2 photos added to the gallery/);
    expect(uploadSpeciesPhoto).toHaveBeenCalledTimes(3);
  });

  it("shows a photo that failed to load and retries it", async () => {
    vi.mocked(importINaturalistLookup).mockRejectedValueOnce(
      new Error("Could not download the iNaturalist photo"),
    );
    const { user } = setup([candidate("1", "ana")]);
    await user.click(screen.getByRole("button", { name: "Bulk create" }));
    await screen.findByText("Could not download the iNaturalist photo");
    expect(screen.getByRole("button", { name: "Upload" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Retry" }));
    await waitFor(() =>
      expect(
        within(card(1)).getByLabelText("Photographer (Georgian)"),
      ).toHaveValue("ana"),
    );
    expect(
      screen.getByRole("button", { name: "Upload 1 photo" }),
    ).toBeEnabled();
  });

  it("sends an expired session back to sign-in", async () => {
    vi.mocked(uploadSpeciesPhoto).mockRejectedValue(new SessionExpiredError());
    const { onSessionExpired, user } = setup();
    await openReady(user);
    await user.click(screen.getByRole("button", { name: "Upload 2 photos" }));
    await waitFor(() => expect(onSessionExpired).toHaveBeenCalled());
  });

  it("sends an expired session while loading back to sign-in", async () => {
    vi.mocked(importINaturalistLookup).mockRejectedValue(
      new SessionExpiredError(),
    );
    const { onSessionExpired, user } = setup();
    await user.click(screen.getByRole("button", { name: "Bulk create" }));
    await waitFor(() => expect(onSessionExpired).toHaveBeenCalled());
  });

  it("starts fresh after closing", async () => {
    const { user } = setup();
    await openReady(user);
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await openReady(user);
    expect(importINaturalistLookup).toHaveBeenCalledTimes(4);
  });
});
