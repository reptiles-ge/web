import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "ქართული გველგესლები — Reptiles";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/jpeg";

const ogFiles: Record<string, string> = {
  "vipera-dinniki": "vipera-dinniki.jpg",
  "macrovipera-lebetina": "macrovipera-lebetina.jpg",
  "vipera-ammodytes": "vipera-ammodytes.jpg",
};

const ogRemote: Record<string, string> = {
  "vipera-kaznakovi":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Kaukasusotter_%28Vipera_kaznakovi%29_K%C3%B6rperansicht.jpg/1280px-Kaukasusotter_%28Vipera_kaznakovi%29_K%C3%B6rperansicht.jpg",
};

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (ogRemote[id]) {
    const res = await fetch(ogRemote[id], {
      headers: {
        "User-Agent": "ReptilesGE/1.0 (educational; reptiles.ge)",
      },
      next: { revalidate: 60 * 60 * 24 * 30 },
    });
    if (res.ok) {
      const buffer = Buffer.from(await res.arrayBuffer());
      return new Response(buffer, {
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }
  }

  const file = ogFiles[id] ?? "vipera-dinniki.jpg";
  const buffer = await readFile(
    join(process.cwd(), "public/images/og", file),
  );

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
