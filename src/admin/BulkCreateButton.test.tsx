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
  uploadSpeciesPhoto,
} from "./photos";

vi.mock("./photos", () => ({
  encodePhotoFile: vi.fn(),
  importINaturalistLookup: vi.fn(),
  uploadSpeciesPhoto: vi.fn(),
}));

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
    .getByAltText(new RegExp(`^Photo ${index} by`))
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
  vi.mocked(uploadSpeciesPhoto)
    .mockReset()
    .mockResolvedValue({
      optimized: true,
      photo: { src: "https://cdn.reptiles.ge/larus-genei-1.jpg" },
      version: 2,
    });
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
  });

  it("uploads every photo with its own credit in one click", async () => {
    const { onUploaded, user } = setup();
    await openReady(user);
    const place = within(card(1)).getByLabelText("Place (Georgian)");
    await user.clear(place);
    await user.type(place, "ბათუმი");
    await user.click(screen.getByRole("button", { name: "Upload 2 photos" }));
    await screen.findByText(/2 photos added to the gallery/);
    expect(uploadSpeciesPhoto).toHaveBeenNthCalledWith(
      1,
      "larus-genei",
      expect.objectContaining({
        georgiaField: true,
        location: "ბათუმი",
        photographer: "ana",
      }),
      ENCODED,
    );
    expect(uploadSpeciesPhoto).toHaveBeenNthCalledWith(
      2,
      "larus-genei",
      expect.objectContaining({ georgiaField: false, photographer: "beka" }),
      ENCODED,
    );
    expect(screen.getAllByText("Added")).toHaveLength(2);
    expect(onUploaded).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Upload" })).toBeDisabled();
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
