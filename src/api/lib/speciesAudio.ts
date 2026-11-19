import type { SpeciesAudio } from "@/data/speciesTypes";

import type { SpeciesRecord } from "../db/speciesRows";

import { ApiError } from "./errors";

const MAX_AUDIO_BYTES = 20 * 1024 * 1024;

const MIN_AUDIO_BYTES = 1024;

export async function checkMp3(file: File) {
  if (file.size < MIN_AUDIO_BYTES || file.size > MAX_AUDIO_BYTES) {
    throw new ApiError(
      400,
      "invalid_request",
      "The sound must be an MP3 between 1 KB and 20 MB",
    );
  }
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!isMp3(bytes)) {
    throw new ApiError(400, "invalid_request", "The sound is not an MP3 file");
  }
  return bytes;
}

export function setSpeciesAudio(record: SpeciesRecord, audio: SpeciesAudio) {
  const previous = record.base.audio;
  record.base.audio = Object.fromEntries(
    Object.entries(audio).filter(
      ([, value]) => typeof value === "string" && value.trim(),
    ),
  ) as SpeciesAudio;
  return { audio: record.base.audio, previous: previous?.src ?? null };
}

function isMp3(bytes: Uint8Array) {
  let offset = 0;
  if (bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) {
    const size =
      ((bytes[6]! & 0x7f) << 21) |
      ((bytes[7]! & 0x7f) << 14) |
      ((bytes[8]! & 0x7f) << 7) |
      (bytes[9]! & 0x7f);
    offset = 10 + size + (bytes[5]! & 0x10 ? 10 : 0);
  }
  const first = bytes[offset];
  const second = bytes[offset + 1];
  if (first === undefined || second === undefined) return false;
  const layer = (second >> 1) & 0x03;
  return first === 0xff && (second & 0xe0) === 0xe0 && layer === 0x01;
}
