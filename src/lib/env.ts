import { z } from "zod";

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

const publicSchema = z.object({
  NEXT_PUBLIC_API_ORIGIN: siteUrl,
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
  API_WRITE_TOKEN: optionalString,
  R2_ACCESS_KEY_ID: optionalString,
  R2_ACCOUNT_ID: z.preprocess(
    blankToUndefined,
    z
      .string()
      .trim()
      .regex(/^[0-9a-f]{32}$/, "Expected a 32-character Cloudflare account id")
      .optional(),
  ),
  R2_BUCKET: optionalString,
  R2_SECRET_ACCESS_KEY: optionalString,
  REVALIDATE_TOKEN: optionalString,
  SITE_API_KEY: optionalString,
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

let publicEnvCache: undefined | { key: string; value: PublicEnv };

export function publicEnv(): PublicEnv {
  const raw = {
    NEXT_PUBLIC_API_ORIGIN: process.env.NEXT_PUBLIC_API_ORIGIN,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
  };
  const key = JSON.stringify(raw);
  if (publicEnvCache?.key !== key) {
    publicEnvCache = { key, value: parse(publicSchema, raw) };
  }
  return publicEnvCache.value;
}

export function serverEnv(): ServerEnv {
  return parse(serverSchema, {
    API_WRITE_TOKEN: process.env.API_WRITE_TOKEN,
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
    R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
    R2_BUCKET: process.env.R2_BUCKET,
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
    REVALIDATE_TOKEN: process.env.REVALIDATE_TOKEN,
    SITE_API_KEY: process.env.SITE_API_KEY,
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
