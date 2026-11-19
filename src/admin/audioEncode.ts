const MP3_KBPS = 128;

const BLOCK = 1152 * 64;

const SAMPLE_RATE = 44_100;

export async function encodeMp3(blob: Blob): Promise<Blob> {
  const { Mp3Encoder } = await import("@breezystack/lamejs");
  const context = new AudioContext({ sampleRate: SAMPLE_RATE });
  try {
    const audio = await context.decodeAudioData(await blob.arrayBuffer());
    const samples = mono(audio);
    const encoder = new Mp3Encoder(1, audio.sampleRate, MP3_KBPS);
    const parts: BlobPart[] = [];
    for (let start = 0; start < samples.length; start += BLOCK) {
      const chunk = encoder.encodeBuffer(
        samples.subarray(start, start + BLOCK),
      );
      if (chunk.length) parts.push(new Uint8Array(chunk));
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    const tail = encoder.flush();
    if (tail.length) parts.push(new Uint8Array(tail));
    return new Blob(parts, { type: "audio/mpeg" });
  } finally {
    void context.close();
  }
}

export function needsEncoding(format: string, size: number, maxBytes: number) {
  return format.toLowerCase() !== "mp3" || size > maxBytes;
}

function mono(audio: AudioBuffer) {
  const channels = Array.from({ length: audio.numberOfChannels }, (_, index) =>
    audio.getChannelData(index),
  );
  const samples = new Int16Array(audio.length);
  for (let index = 0; index < audio.length; index += 1) {
    let sum = 0;
    for (const channel of channels) sum += channel[index]!;
    const value = Math.max(-1, Math.min(1, sum / channels.length));
    samples[index] = value < 0 ? value * 0x8000 : value * 0x7fff;
  }
  return samples;
}
