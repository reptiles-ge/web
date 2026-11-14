import { serverEnv } from "@/lib/env";
import { purgeSiteCache } from "@/lib/responseStoreDataCache";

const noindex = { "X-Robots-Tag": "noindex, nofollow" };

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
  const purged = await purgeSiteCache().catch((error: unknown) => {
    console.error("Site cache purge failed", error);
    return false;
  });
  if (!purged) {
    return Response.json(
      { error: "The site cache could not be purged" },
      { headers: noindex, status: 503 },
    );
  }
  return Response.json({ revalidated: true }, { headers: noindex });
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
