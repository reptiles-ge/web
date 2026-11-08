import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { EncodedPhoto } from "./photoEncoding";

import { GalleryPhotoButtons } from "./GalleryPhotoButtons";
import {
  fetchPhotoCandidates,
  findINaturalistTaxon,
  type PhotoCandidate,
} from "./photoCandidates";
import {
  encodePhotoFile,
  importINaturalistLookup,
  uploadSpeciesPhoto,
} from "./photos";

vi.mock("./photoCandidates", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./photoCandidates")>()),
  fetchPhotoCandidates: vi.fn(),
  findINaturalistTaxon: vi.fn(),
}));
vi.mock("./photos", () => ({
  encodePhotoFile: vi.fn(),
  importINaturalistLookup: vi.fn(),
  importINaturalistPhoto: vi.fn(),
  uploadSpeciesPhoto: vi.fn(),
}));

const OBSERVATION = "https://www.inaturalist.org/observations/42";

const CANDIDATE = {
  faves: 2,
  georgia: true,
  key: "42-7",
  licence: "cc-by",
  lookup: { photoUrl: "photo-7" },
  observationUrl: OBSERVATION,
  observedOn: "2025-05-01",
  observer: "ana",
  observerName: "",
  place: "Batumi",
  previewUrl: "https://example.test/7.jpg",
  small: false,
} as unknown as PhotoCandidate;

beforeEach(() => {
  vi.mocked(findINaturalistTaxon).mockResolvedValue({ id: 1 });
  vi.mocked(fetchPhotoCandidates).mockResolvedValue({
    candidates: [CANDIDATE],
    total: 1,
  });
  vi.mocked(importINaturalistLookup).mockResolvedValue({
    file: new File(["x"], "inaturalist-42-7.jpg", { type: "image/jpeg" }),
    metadata: {
      date: "2025-05-01",
      georgiaField: true,
      lat: 41.6,
      license: "cc-by",
      lng: 41.6,
      location: "Batumi",
      photographer: "ana",
      photographerName: "",
      url: "https://www.inaturalist.org/photos/7",
    },
  });
  vi.mocked(encodePhotoFile).mockResolvedValue({} as EncodedPhoto);
  vi.mocked(uploadSpeciesPhoto).mockResolvedValue({
    optimized: true,
    photo: { src: "https://cdn.reptiles.ge/x.jpg" },
    version: 2,
  });
});

describe("GalleryPhotoButtons", () => {
  it("opens the upload dialog with the picked photo and its observation, and keeps the list open after the upload", async () => {
    const onUploaded = vi.fn();
    render(
      <GalleryPhotoButtons
        gallery={[]}
        id="larus-genei"
        onSessionExpired={vi.fn()}
        onUploaded={onUploaded}
        scientificName="Larus genei"
      />,
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Find photos" }));
    await user.click(await screen.findByRole("button", { name: "Add" }));
    expect(await screen.findByLabelText("iNaturalist observation")).toHaveValue(
      OBSERVATION,
    );
    expect(screen.getByText("inaturalist-42-7.jpg")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Upload" }));
    await screen.findByText(/1 photo added to the gallery/);
    expect(onUploaded).toHaveBeenCalledTimes(1);
    const dialogs = () => screen.getAllByRole("dialog");
    const upload = dialogs().find((dialog) =>
      within(dialog).queryByLabelText("iNaturalist observation"),
    );
    await user.click(
      within(upload!).getAllByRole("button", { name: "Close" }).at(-1)!,
    );
    const list = dialogs().find((dialog) =>
      within(dialog).queryByText("Find photos on iNaturalist"),
    );
    expect(list).toBeDefined();
    expect(within(list!).getByAltText("Photo by ana")).toBeInTheDocument();
  });
});
