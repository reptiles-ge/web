export type ImageProbe = {
  format: ProbedFormat;
  height: number;
  width: number;
};

type ProbedFormat = "avif" | "jpeg" | "png" | "webp";

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

const SOF_MARKERS = new Set([
  0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf,
]);

const AVIF_BRANDS = new Set(["avif", "avis"]);

export function probeImage(bytes: Uint8Array): ImageProbe | null {
  return (
    probeJpeg(bytes) ?? probePng(bytes) ?? probeWebp(bytes) ?? probeAvif(bytes)
  );
}

function ascii(bytes: Uint8Array, offset: number, length: number) {
  if (offset + length > bytes.length) return "";
  return String.fromCharCode(...bytes.subarray(offset, offset + length));
}

function probeAvif(bytes: Uint8Array): ImageProbe | null {
  if (ascii(bytes, 4, 4) !== "ftyp") return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const ftypSize = view.getUint32(0);
  if (ftypSize < 16 || ftypSize > bytes.length) return null;
  const brands = [ascii(bytes, 8, 4)];
  for (let offset = 16; offset + 4 <= ftypSize; offset += 4) {
    brands.push(ascii(bytes, offset, 4));
  }
  if (!brands.some((brand) => AVIF_BRANDS.has(brand))) return null;
  const limit = Math.min(bytes.length - 16, 64 * 1024);
  for (let offset = ftypSize; offset < limit; offset += 1) {
    if (
      bytes[offset] === 0x69 &&
      bytes[offset + 1] === 0x73 &&
      bytes[offset + 2] === 0x70 &&
      bytes[offset + 3] === 0x65
    ) {
      const width = view.getUint32(offset + 8);
      const height = view.getUint32(offset + 12);
      return valid({ format: "avif", height, width });
    }
  }
  return null;
}

function probeJpeg(bytes: Uint8Array): ImageProbe | null {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 2;
  while (offset + 9 < bytes.length) {
    if (bytes[offset] !== 0xff) return null;
    const marker = bytes[offset + 1]!;
    if (marker === 0xff) {
      offset += 1;
      continue;
    }
    if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2;
      continue;
    }
    const length = view.getUint16(offset + 2);
    if (length < 2) return null;
    if (SOF_MARKERS.has(marker)) {
      return valid({
        format: "jpeg",
        height: view.getUint16(offset + 5),
        width: view.getUint16(offset + 7),
      });
    }
    offset += 2 + length;
  }
  return null;
}

function probePng(bytes: Uint8Array): ImageProbe | null {
  if (bytes.length < 24) return null;
  if (PNG_SIGNATURE.some((value, index) => bytes[index] !== value)) return null;
  if (ascii(bytes, 12, 4) !== "IHDR") return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return valid({
    format: "png",
    height: view.getUint32(20),
    width: view.getUint32(16),
  });
}

function probeWebp(bytes: Uint8Array): ImageProbe | null {
  if (ascii(bytes, 0, 4) !== "RIFF" || ascii(bytes, 8, 4) !== "WEBP") {
    return null;
  }
  const chunk = ascii(bytes, 12, 4);
  if (chunk === "VP8 " && bytes.length >= 30) {
    if (bytes[23] !== 0x9d || bytes[24] !== 0x01 || bytes[25] !== 0x2a) {
      return null;
    }
    return valid({
      format: "webp",
      height: (bytes[28]! | (bytes[29]! << 8)) & 0x3fff,
      width: (bytes[26]! | (bytes[27]! << 8)) & 0x3fff,
    });
  }
  if (chunk === "VP8L" && bytes.length >= 25) {
    if (bytes[20] !== 0x2f) return null;
    const bits =
      bytes[21]! | (bytes[22]! << 8) | (bytes[23]! << 16) | (bytes[24]! << 24);
    return valid({
      format: "webp",
      height: ((bits >>> 14) & 0x3fff) + 1,
      width: (bits & 0x3fff) + 1,
    });
  }
  if (chunk === "VP8X" && bytes.length >= 30) {
    return valid({
      format: "webp",
      height: (bytes[27]! | (bytes[28]! << 8) | (bytes[29]! << 16)) + 1,
      width: (bytes[24]! | (bytes[25]! << 8) | (bytes[26]! << 16)) + 1,
    });
  }
  return null;
}

function valid(probe: ImageProbe): ImageProbe | null {
  return probe.width > 0 && probe.height > 0 ? probe : null;
}
