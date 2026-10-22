import type { ValidationTargets } from "hono";
import type { z } from "zod";

import { zValidator } from "@hono/zod-validator";

import { ApiError } from "./errors";

export function validate<
  Target extends keyof ValidationTargets,
  Schema extends z.ZodType,
>(target: Target, schema: Schema) {
  return zValidator(target, schema, (result) => {
    if (!result.success) {
      throw new ApiError(
        400,
        "invalid_request",
        `Invalid ${target}`,
        result.error.issues.map((issue) => ({
          message: issue.message,
          path: issue.path.join("."),
        })),
      );
    }
  });
}
