import { z } from "zod";

const USER_ROLES = ["admin"] as const;

const email = z.string().trim().toLowerCase().pipe(z.email().max(254));

export const loginBody = z.object({
  email,
  password: z.string().min(1).max(256),
});

export const userCreateBody = z.object({
  email,
  name: z.string().trim().min(1).max(100),
  password: z.string().min(12).max(256),
  role: z.enum(USER_ROLES),
});
