import { z } from "zod";

import { listSearch, pageQuery } from "./common";

export const apiKeyCreateBody = z.object({
  expiresAt: z.iso
    .datetime()
    .refine((value) => Date.parse(value) > Date.now(), {
      message: "expiresAt must be in the future",
    })
    .nullable()
    .default(null),
  name: z.string().trim().min(1).max(100),
  note: z
    .string()
    .trim()
    .max(500)
    .transform((value) => value || null)
    .nullable()
    .default(null),
});

export const apiKeyListQuery = pageQuery.extend({ q: listSearch });

export const apiKeyParam = z.object({ id: z.uuid() });
