import { revalidateTag } from "next/cache";
import { z } from "zod";

import { serverEnv } from "@/lib/env";
import { refreshSpeciesApiCache } from "@/lib/speciesApiRefresh";

const noindex = { "X-Robots-Tag": "noindex, nofollow" };

const body = z.strictObject({
  tags: z
    .array(z.string().regex(/^species(?::[a-z0-9]+(?:-[a-z0-9]+)*)?$/))
    .min(1)
    .max(20),
});

export async function POST(request: Request) {
  const token = serverEnv().REVALIDATE_TOKEN;
  if (
    !token ||
    !(await sameSecret(request.headers.get("authorization"), token))
  ) {
    return Response.json(
      { error: "Unauthorized" },
      { headers: noindex, status: 401 },
    );
  }
  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid tags" },
      { headers: noindex, status: 400 },
    );
  }
  await refreshSpeciesApiCache(parsed.data.tags);
  for (const tag of parsed.data.tags) revalidateTag(tag, "max");
  return new Response(null, { headers: noindex, status: 204 });
}

async function sameSecret(header: null | string, token: string) {
  const encoder = new TextEncoder();
  const [left, right] = await Promise.all(
    [header ?? "", `Bearer ${token}`].map((value) =>
      crypto.subtle.digest("SHA-256", encoder.encode(value)),
    ),
  );
  const a = new Uint8Array(left!);
  const b = new Uint8Array(right!);
  return a.every((byte, index) => byte === b[index]);
}
