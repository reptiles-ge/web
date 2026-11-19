import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { XenoCantoRecording } from "@/lib/xenoCanto";

import { encodeMp3 } from "./audioEncode";
import {
  downloadRecording,
  readXenoCantoKey,
  searchXenoCantoSounds,
  uploadSpeciesSound,
  XenoCantoKeyError,
} from "./sounds";
import { formatBytes, XenoCantoSoundsButton } from "./XenoCantoSoundsButton";

vi.mock("./sounds", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./sounds")>()),
  downloadRecording: vi.fn(),
  searchXenoCantoSounds: vi.fn(),
  uploadSpeciesSound: vi.fn(),
}));
vi.mock("./audioEncode", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./audioEncode")>()),
  encodeMp3: vi.fn(),
}));

function card(id: string) {
  return screen.getByText(`XC${id}`).closest(".ant-card") as HTMLElement;
}

async function openDialog() {
  await userEvent.click(screen.getByRole("button", { name: "Find sounds" }));
  return screen.findByRole("dialog");
}

function recording(
  id: string,
  overrides: Partial<XenoCantoRecording> = {},
): XenoCantoRecording {
  return {
    country: "Georgia",
    date: "2024-05-01",
    durationSeconds: 65,
    fileName: `XC${id}.mp3`,
    fileUrl: `https://xeno-canto.org/${id}/download`,
    format: "mp3",
    id,
    length: "1:05",
    licence: "CC BY-NC-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    location: "Vashlovani",
    pageUrl: `https://xeno-canto.org/${id}`,
    quality: "A",
    recordist: "Ana Recordist",
    scientificName: "Picus viridis",
    type: "song",
    ...overrides,
  };
}

function setup(currentUrl?: string) {
  const onAdded = vi.fn();
  const onSessionExpired = vi.fn();
  render(
    <XenoCantoSoundsButton
      currentUrl={currentUrl}
      id="picus-viridis"
      onAdded={onAdded}
      onSessionExpired={onSessionExpired}
      scientificName="Picus viridis"
      version={7}
    />,
  );
  return { onAdded, onSessionExpired };
}

beforeEach(() => {
  vi.mocked(searchXenoCantoSounds).mockReset();
  vi.mocked(downloadRecording).mockReset();
  vi.mocked(uploadSpeciesSound).mockReset();
  vi.mocked(encodeMp3).mockReset();
  URL.createObjectURL = vi.fn(() => "blob:sound");
  URL.revokeObjectURL = vi.fn();
  localStorage.setItem("reptiles-admin:xeno-canto-key", "saved-key");
});

describe("XenoCantoSoundsButton", () => {
  it("lists recordings with duration, format and licence, and shows the size after Listen", async () => {
    vi.mocked(searchXenoCantoSounds).mockResolvedValue({
      page: 1,
      pages: 1,
      recordings: [recording("1"), recording("2", { country: "Iran" })],
      total: 2,
    });
    vi.mocked(downloadRecording).mockResolvedValue(
      new Blob([new Uint8Array(2048)], { type: "audio/mpeg" }),
    );
    setup();
    await openDialog();
    expect(await screen.findByText("2 of 2 recordings")).toBeTruthy();
    const first = within(card("1"));
    expect(first.getByText("Georgia")).toBeTruthy();
    expect(first.getByText("⏱ 1:05")).toBeTruthy();
    expect(first.getByText("MP3")).toBeTruthy();
    expect(first.getByText("CC BY-NC-SA 4.0")).toBeTruthy();
    expect(first.getByText("size after Listen")).toBeTruthy();
    expect(within(card("2")).queryByText("Georgia")).toBeNull();
    await userEvent.click(first.getByRole("button", { name: "Listen" }));
    expect(await first.findByText("2 KB")).toBeTruthy();
    expect(first.getByLabelText("XC1").getAttribute("src")).toBe("blob:sound");
    expect(downloadRecording).toHaveBeenCalledWith(recording("1"));
  });

  it("adds an MP3 as it is and reports the new version", async () => {
    vi.mocked(searchXenoCantoSounds).mockResolvedValue({
      page: 1,
      pages: 1,
      recordings: [recording("1")],
      total: 1,
    });
    vi.mocked(downloadRecording).mockResolvedValue(
      new Blob([new Uint8Array(2048)], { type: "audio/mpeg" }),
    );
    vi.mocked(uploadSpeciesSound).mockResolvedValue(8);
    const { onAdded } = setup();
    await openDialog();
    await screen.findByText("XC1");
    await userEvent.click(
      within(card("1")).getByRole("button", { name: "Add" }),
    );
    await waitFor(() => expect(onAdded).toHaveBeenCalled());
    expect(onAdded.mock.calls[0]?.[0]).toBe(8);
    expect(encodeMp3).not.toHaveBeenCalled();
    const [id, picked, file, version] =
      vi.mocked(uploadSpeciesSound).mock.calls[0]!;
    expect([id, picked.id, file.name, file.type, version]).toStrictEqual([
      "picus-viridis",
      "1",
      "xc1.mp3",
      "audio/mpeg",
      7,
    ]);
  });

  it("encodes a WAV to MP3 and asks before replacing the current sound", async () => {
    vi.mocked(searchXenoCantoSounds).mockResolvedValue({
      page: 1,
      pages: 1,
      recordings: [
        recording("1"),
        recording("2", { fileName: "XC2.wav", format: "wav" }),
      ],
      total: 2,
    });
    vi.mocked(downloadRecording).mockResolvedValue(
      new Blob([new Uint8Array(4096)], { type: "audio/wav" }),
    );
    vi.mocked(encodeMp3).mockResolvedValue(
      new Blob([new Uint8Array(1024)], { type: "audio/mpeg" }),
    );
    vi.mocked(uploadSpeciesSound).mockResolvedValue(8);
    const { onAdded } = setup("https://xeno-canto.org/1");
    await openDialog();
    await screen.findByText("XC2");
    expect(
      within(card("1")).getByRole("button", { name: "Current sound" }),
    ).toHaveProperty("disabled", true);
    await userEvent.click(
      within(card("2")).getByRole("button", { name: "Add" }),
    );
    expect(uploadSpeciesSound).not.toHaveBeenCalled();
    expect(await screen.findByText("Replace the current sound?")).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: "OK" }));
    await waitFor(() => expect(onAdded).toHaveBeenCalled());
    expect(encodeMp3).toHaveBeenCalledTimes(1);
    expect(vi.mocked(uploadSpeciesSound).mock.calls[0]?.[2].size).toBe(1024);
  });

  it("shows upload errors on the card and loads more pages", async () => {
    vi.mocked(searchXenoCantoSounds)
      .mockResolvedValueOnce({
        page: 1,
        pages: 2,
        recordings: [recording("1")],
        total: 2,
      })
      .mockResolvedValueOnce({
        page: 2,
        pages: 2,
        recordings: [recording("1"), recording("3")],
        total: 2,
      });
    vi.mocked(downloadRecording).mockRejectedValue(new Error("blocked"));
    setup();
    await openDialog();
    await screen.findByText("XC1");
    await userEvent.click(
      within(card("1")).getByRole("button", { name: "Add" }),
    );
    expect(await within(card("1")).findByText("blocked")).toBeTruthy();
    await userEvent.click(screen.getByRole("button", { name: "Load more" }));
    expect(await screen.findByText("XC3")).toBeTruthy();
    expect(screen.getAllByText("XC1")).toHaveLength(1);
    expect(searchXenoCantoSounds).toHaveBeenLastCalledWith(
      "Picus viridis",
      2,
      "saved-key",
    );
  });

  it("asks for the key once, keeps it in the browser and searches with it", async () => {
    localStorage.removeItem("reptiles-admin:xeno-canto-key");
    vi.mocked(searchXenoCantoSounds).mockResolvedValue({
      page: 1,
      pages: 1,
      recordings: [recording("1")],
      total: 1,
    });
    setup();
    await openDialog();
    expect(searchXenoCantoSounds).not.toHaveBeenCalled();
    await userEvent.type(
      screen.getByLabelText("xeno-canto API key"),
      " new-key ",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Save and search" }),
    );
    expect(await screen.findByText("XC1")).toBeTruthy();
    expect(searchXenoCantoSounds).toHaveBeenCalledWith(
      "Picus viridis",
      1,
      "new-key",
    );
    expect(readXenoCantoKey()).toBe("new-key");
    await userEvent.click(
      screen.getByRole("button", { name: "Change xeno-canto key" }),
    );
    expect(readXenoCantoKey()).toBeNull();
    expect(screen.getByLabelText("xeno-canto API key")).toBeTruthy();
  });

  it("forgets a refused key and asks again", async () => {
    vi.mocked(searchXenoCantoSounds).mockRejectedValueOnce(
      new XenoCantoKeyError(),
    );
    setup();
    await openDialog();
    expect(await screen.findByText(/refused this API key/)).toBeTruthy();
    expect(searchXenoCantoSounds).toHaveBeenCalledWith(
      "Picus viridis",
      1,
      "saved-key",
    );
    expect(readXenoCantoKey()).toBeNull();
    expect(screen.getByLabelText("xeno-canto API key")).toBeTruthy();
  });
});

describe("formatBytes", () => {
  it("shows KB below a megabyte and MB above", () => {
    expect(formatBytes(100)).toBe("1 KB");
    expect(formatBytes(91_365)).toBe("89 KB");
    expect(formatBytes(3.5 * 1024 * 1024)).toBe("3.5 MB");
  });
});
