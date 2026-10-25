import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { EncodedPhoto } from "./photoEncoding";

import { SessionExpiredError } from "./adminResponse";
import {
  encodePhotoFile,
  importINaturalistPhoto,
  uploadSpeciesPhoto,
} from "./photos";
import { PhotoUploadButton } from "./PhotoUploadButton";

vi.mock("./photos", () => ({
  encodePhotoFile: vi.fn(),
  importINaturalistPhoto: vi.fn(),
  uploadSpeciesPhoto: vi.fn(),
}));

const ENCODED = {
  derivatives: [],
  height: 1,
  width: 1,
} as unknown as EncodedPhoto;

async function choose(
  user: ReturnType<typeof userEvent.setup>,
  names: string[],
) {
  await user.click(screen.getByRole("button", { name: "Add photos" }));
  const input = document.querySelector<HTMLInputElement>('input[type="file"]')!;
  await user.upload(
    input,
    names.map((name) => new File(["x"], name, { type: "image/jpeg" })),
  );
}

function setup() {
  const onSessionExpired = vi.fn();
  const onUploaded = vi.fn();
  render(
    <PhotoUploadButton
      id="bufo-viridis"
      onSessionExpired={onSessionExpired}
      onUploaded={onUploaded}
    />,
  );
  return { onSessionExpired, onUploaded, user: userEvent.setup() };
}

beforeEach(() => {
  vi.mocked(importINaturalistPhoto).mockReset();
  vi.mocked(encodePhotoFile).mockReset().mockResolvedValue(ENCODED);
  vi.mocked(uploadSpeciesPhoto)
    .mockReset()
    .mockResolvedValue({
      optimized: true,
      photo: { src: "https://cdn.reptiles.ge/bufo-viridis-1.jpg" },
      version: 2,
    });
});

describe("PhotoUploadButton", () => {
  it("compresses and uploads each photo with the credit, then reloads", async () => {
    const { onUploaded, user } = setup();
    await choose(user, ["one.jpg", "two.jpg"]);
    await user.type(screen.getByLabelText("Photographer (Georgian)"), "ანა");
    await user.type(screen.getByLabelText("Place (Georgian)"), "ვაშლოვანი");
    await user.click(screen.getByLabelText("Taken in Georgia (needs a place)"));
    await user.click(screen.getByRole("button", { name: "Upload" }));
    await screen.findByText(
      /2 photos added to the gallery\. The site shows them after you clear this species' cache/,
    );
    expect(encodePhotoFile).toHaveBeenCalledTimes(2);
    expect(uploadSpeciesPhoto).toHaveBeenCalledWith(
      "bufo-viridis",
      expect.objectContaining({
        georgiaField: true,
        location: "ვაშლოვანი",
        photographer: "ანა",
      }),
      ENCODED,
    );
    expect(screen.getAllByText("Added")).toHaveLength(2);
    expect(onUploaded).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Upload" })).toBeDisabled();
  });

  it("shows why a photo failed and keeps going", async () => {
    vi.mocked(uploadSpeciesPhoto)
      .mockRejectedValueOnce(new Error("Derivatives are missing"))
      .mockResolvedValueOnce({
        optimized: true,
        photo: { src: "https://cdn.reptiles.ge/bufo-viridis-1.jpg" },
        version: 2,
      });
    const { onUploaded, user } = setup();
    await choose(user, ["bad.jpg", "good.jpg"]);
    await user.click(screen.getByRole("button", { name: "Upload" }));
    await screen.findByText("Derivatives are missing");
    await screen.findByText(/1 photo added to the gallery/);
    expect(screen.getByText("Failed")).toBeInTheDocument();
    expect(onUploaded).toHaveBeenCalledTimes(1);
  });

  it("does not reload when nothing was added", async () => {
    vi.mocked(encodePhotoFile).mockRejectedValue(new Error("Unreadable"));
    const { onUploaded, user } = setup();
    await choose(user, ["bad.jpg"]);
    await user.click(screen.getByRole("button", { name: "Upload" }));
    await screen.findByText("Unreadable");
    expect(uploadSpeciesPhoto).not.toHaveBeenCalled();
    expect(onUploaded).not.toHaveBeenCalled();
    expect(screen.queryByText(/added to the gallery/)).not.toBeInTheDocument();
  });

  it("sends an expired session back to sign-in", async () => {
    vi.mocked(uploadSpeciesPhoto).mockRejectedValue(new SessionExpiredError());
    const { onSessionExpired, user } = setup();
    await choose(user, ["one.jpg"]);
    await user.click(screen.getByRole("button", { name: "Upload" }));
    await waitFor(() => expect(onSessionExpired).toHaveBeenCalled());
  });

  it("clears the chosen files when closed", async () => {
    const { user } = setup();
    await choose(user, ["one.jpg"]);
    expect(screen.getByRole("button", { name: "Upload" })).toBeEnabled();
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await user.click(screen.getByRole("button", { name: "Add photos" }));
    expect(screen.getByRole("button", { name: "Upload" })).toBeDisabled();
  });

  it("fills the photo and credit from an iNaturalist observation", async () => {
    const file = new File(["x"], "inaturalist-42-7.jpg", {
      type: "image/jpeg",
    });
    vi.mocked(importINaturalistPhoto).mockResolvedValue({
      file,
      metadata: {
        date: "2026-05-10",
        georgiaField: true,
        lat: 41.81667,
        license: "cc-by",
        lng: 45.35,
        location: "Vashlovani",
        photographer: "ana",
        url: "https://www.inaturalist.org/photos/7",
      },
    });
    const { user } = setup();
    await user.click(screen.getByRole("button", { name: "Add photos" }));
    await user.type(
      screen.getByLabelText("iNaturalist observation"),
      "https://www.inaturalist.org/observations/42{Enter}",
    );
    await screen.findByText(
      "Filled in from iNaturalist. Photo licence: cc-by.",
    );
    expect(importINaturalistPhoto).toHaveBeenCalledWith(
      "bufo-viridis",
      "https://www.inaturalist.org/observations/42",
    );
    expect(screen.getByText("inaturalist-42-7.jpg")).toBeInTheDocument();
    expect(screen.getByLabelText("Place (English)")).toHaveValue("Vashlovani");
    expect(
      screen.getByLabelText("Taken in Georgia (needs a place)"),
    ).toBeChecked();
    expect(uploadSpeciesPhoto).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Upload" }));
    await screen.findByText(/1 photo added to the gallery/);
    expect(encodePhotoFile).toHaveBeenCalledWith(file);
    expect(uploadSpeciesPhoto).toHaveBeenCalledWith(
      "bufo-viridis",
      expect.objectContaining({
        date: "2026-05-10",
        lat: "41.81667",
        lng: "45.35",
        photographer: "ana",
        url: "https://www.inaturalist.org/photos/7",
      }),
      ENCODED,
    );
  });

  it("shows why an iNaturalist import failed", async () => {
    vi.mocked(importINaturalistPhoto).mockRejectedValue(
      new Error("iNaturalist observation not found"),
    );
    const { user } = setup();
    await user.click(screen.getByRole("button", { name: "Add photos" }));
    await user.type(
      screen.getByLabelText("iNaturalist observation"),
      "https://www.inaturalist.org/observations/1",
    );
    await user.click(screen.getByRole("button", { name: "Fetch" }));
    await screen.findByText("iNaturalist observation not found");
    expect(screen.getByRole("button", { name: "Upload" })).toBeDisabled();
  });

  it("sends an expired session from the iNaturalist import back to sign-in", async () => {
    vi.mocked(importINaturalistPhoto).mockRejectedValue(
      new SessionExpiredError(),
    );
    const { onSessionExpired, user } = setup();
    await user.click(screen.getByRole("button", { name: "Add photos" }));
    await user.type(
      screen.getByLabelText("iNaturalist observation"),
      "https://www.inaturalist.org/observations/1",
    );
    await user.click(screen.getByRole("button", { name: "Fetch" }));
    await waitFor(() => expect(onSessionExpired).toHaveBeenCalled());
  });
});
