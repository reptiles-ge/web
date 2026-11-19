import {
  xenoCantoLocation,
  type XenoCantoPage,
  type XenoCantoRecording,
} from "@/lib/xenoCanto";

import { checkAdminResponse, checkAdminSave } from "./adminResponse";
import { api } from "./apiClient";

export const MAX_SOUND_BYTES = 20 * 1024 * 1024;

export class SoundSearchUnavailableError extends Error {
  constructor() {
    super(
      "xeno-canto search is not set up. Add the XENO_CANTO_API_KEY secret to the API.",
    );
    this.name = "SoundSearchUnavailableError";
  }
}

export async function downloadRecording(
  recording: Pick<XenoCantoRecording, "fileUrl">,
): Promise<Blob> {
  const response = await fetch(recording.fileUrl, { credentials: "omit" });
  if (!response.ok) {
    throw new Error(
      `The recording could not be downloaded: ${response.status}`,
    );
  }
  return response.blob();
}

export async function searchXenoCantoSounds(
  id: string,
  page: number,
): Promise<XenoCantoPage> {
  const response = await api.v1.admin.species[":id"].sounds["xeno-canto"].$get({
    param: { id },
    query: { page: String(page) },
  });
  const status: number = response.status;
  if (status === 503) throw new SoundSearchUnavailableError();
  if (status === 502) {
    throw new Error("xeno-canto did not answer. Try again in a minute.");
  }
  checkAdminResponse(response, "Sound search failed");
  return (await response.json()).data;
}

export async function uploadSpeciesSound(
  id: string,
  recording: XenoCantoRecording,
  file: File,
  expectedVersion: number,
): Promise<number> {
  const optional = Object.fromEntries(
    Object.entries({
      date: recording.date,
      location: xenoCantoLocation(recording),
    }).flatMap(([key, value]) =>
      value && value.trim() ? [[key, value.trim().slice(0, 300)]] : [],
    ),
  );
  const response = await api.v1.admin.species[":id"].audio.$post({
    form: {
      ...optional,
      expectedVersion: String(expectedVersion),
      file,
      recordist: recording.recordist.slice(0, 200) || "xeno-canto",
      xenoCantoId: recording.id,
    },
    param: { id },
  });
  await checkAdminSave(response, "Sound upload failed");
  return ((await response.json()) as { data: { version: number } }).data
    .version;
}
