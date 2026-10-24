import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

import { serverEnv } from "@/lib/env";
import { findSitePageGroup, SITE_PAGE_GROUP_IDS } from "@/lib/sitePageGroups";
import { refreshSpeciesApiCache } from "@/lib/speciesApiRefresh";

const noindex = { "X-Robots-Tag": "noindex, nofollow" };

const body = z
  .strictObject({
    groups: z
      .array(z.enum(SITE_PAGE_GROUP_IDS as [string, ...string[]]))
      .min(1)
      .max(SITE_PAGE_GROUP_IDS.length)
      .optional(),
    tags: z
      .array(
        z
          .string()
          .regex(
            /^(?:authors|news|species|(?:author|news|species):[a-z0-9]+(?:-[a-z0-9]+)*)$/,
          ),
      )
      .min(1)
      .max(20)
      .optional(),
  })
  .refine((value) => value.groups || value.tags);

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
      { error: "Invalid tags or groups" },
      { headers: noindex, status: 400 },
    );
  }
  const { groups = [], tags = [] } = parsed.data;
  if (tags.length > 0) await refreshSpeciesApiCache(tags);
  for (const tag of tags) revalidateTag(tag, "max");
  for (const id of groups) {
    for (const route of findSitePageGroup(id)?.routes ?? []) {
      revalidatePath(route.path, route.type);
    }
  }
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
