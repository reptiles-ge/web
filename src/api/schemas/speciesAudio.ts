import { z } from "zod";

const text = (max: number) => z.string().trim().max(max).optional();

export const xenoCantoSearchQuery = z.strictObject({
  page: z.coerce.number().int().min(1).max(1000).default(1),
});

export const speciesAudioForm = z.strictObject({
  date: z
    .string()
    .trim()
    .regex(/^\d{4}(-\d{2}){0,2}$/)
    .optional(),
  expectedVersion: z.coerce.number().int().min(1),
  file: z.instanceof(File),
  location: text(300),
  recordist: z.string().trim().min(1).max(200),
  xenoCantoId: z.string().regex(/^\d{1,12}$/),
});
