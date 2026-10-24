import { z } from "zod";

export const contentViewInputSchema = z.object({
  id: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  kind: z.enum(["species", "news"]),
});

export type ContentViewInput = z.infer<typeof contentViewInputSchema>;

export type ContentViewKind = ContentViewInput["kind"];
