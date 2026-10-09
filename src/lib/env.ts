import { z } from "zod";

import {
  AI_BACKENDS,
  AI_PROFILES,
  type AiProfile,
  CLAUDE_EFFORTS,
  type ClaudeEffort,
} from "@/lib/aiAgentProfiles";

const blankToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const optionalString = z.preprocess(
  blankToUndefined,
  z.string().trim().optional(),
);

const siteUrl = z.preprocess(
  blankToUndefined,
  z
    .string()
    .trim()
    .transform((value) =>
      /^https?:\/\//.test(value) ? value : `https://${value}`,
    )
    .transform((value) => value.replace(/\/+$/, ""))
    .pipe(z.string().url())
    .optional(),
);

function profileOverrides<T extends string>(
  accepts: (value: string) => boolean,
) {
  return z.preprocess(
    blankToUndefined,
    z
      .string()
      .trim()
      .transform((input, context) => {
        const overrides: Partial<Record<AiProfile, T>> = {};
        for (const pair of input.split(",")) {
          const [profile = "", setting = ""] = pair
            .split("=")
            .map((part) => part.trim());
          if (
            !AI_PROFILES.includes(profile as AiProfile) ||
            !accepts(setting)
          ) {
            context.addIssue({
              code: "custom",
              message: `Expected profile=value pairs; invalid "${pair}"`,
            });
            return z.NEVER;
          }
          overrides[profile as AiProfile] = setting as T;
        }
        return overrides;
      })
      .optional(),
  );
}

const publicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: siteUrl,
  NODE_ENV: z.preprocess(
    blankToUndefined,
    z.enum(["development", "production", "test"]).optional(),
  ),
  VERCEL_ENV: z.preprocess(
    blankToUndefined,
    z.enum(["development", "preview", "production"]).optional(),
  ),
});

const serverSchema = z.object({
  AI_BACKEND: z.preprocess(
    blankToUndefined,
    z.enum(AI_BACKENDS).default("claude"),
  ),
  AI_EFFORT_OVERRIDES: profileOverrides<ClaudeEffort>((value) =>
    CLAUDE_EFFORTS.includes(value as ClaudeEffort),
  ),
  AI_MODEL_OVERRIDES: profileOverrides<string>((value) =>
    /^claude-[a-z0-9-]+$/.test(value),
  ),
  BUNNY_CDN_BASE_URL: z.preprocess(
    blankToUndefined,
    z.string().trim().url().optional(),
  ),
  BUNNY_STORAGE_ACCESS_KEY: optionalString,
  BUNNY_STORAGE_REGION: optionalString,
  BUNNY_STORAGE_ZONE: optionalString,
  TELEGRAM_BOT_TOKEN: optionalString,
  TELEGRAM_CHAT_ID: optionalString,
});

export type PublicEnv = z.infer<typeof publicSchema>;
export type ServerEnv = z.infer<typeof serverSchema>;

export class EnvError extends Error {
  constructor(issues: z.ZodIssue[]) {
    super(
      `Invalid environment variables:\n${issues
        .map((issue) => `  ${issue.path.join(".")}: ${issue.message}`)
        .join("\n")}`,
    );
    this.name = "EnvError";
  }
}

export function publicEnv(): PublicEnv {
  return parse(publicSchema, {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
  });
}

export function serverEnv(): ServerEnv {
  return parse(serverSchema, {
    AI_BACKEND: process.env.AI_BACKEND,
    AI_EFFORT_OVERRIDES: process.env.AI_EFFORT_OVERRIDES,
    AI_MODEL_OVERRIDES: process.env.AI_MODEL_OVERRIDES,
    BUNNY_CDN_BASE_URL: process.env.BUNNY_CDN_BASE_URL,
    BUNNY_STORAGE_ACCESS_KEY: process.env.BUNNY_STORAGE_ACCESS_KEY,
    BUNNY_STORAGE_REGION: process.env.BUNNY_STORAGE_REGION,
    BUNNY_STORAGE_ZONE: process.env.BUNNY_STORAGE_ZONE,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
  });
}

export function validateEnv() {
  publicEnv();
  serverEnv();
}

function parse<T extends z.ZodTypeAny>(schema: T, input: unknown): z.infer<T> {
  const result = schema.safeParse(input);
  if (!result.success) throw new EnvError(result.error.issues);
  return result.data;
}
