import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "სახეობის Open Graph სურათი";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/jpeg";

const ogFiles: Record<string, string> = {
  "vipera-dinniki": "vipera-dinniki.jpg",
  "macrovipera-lebetina": "macrovipera-lebetina.jpg",
};

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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
