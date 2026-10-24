import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

import { HTTPException } from "hono/http-exception";

export type ApiErrorCode =
  | "conflict"
  | "forbidden"
  | "internal_error"
  | "invalid_request"
  | "not_found"
  | "payload_too_large"
  | "rate_limited"
  | "site_unavailable"
  | "storage_failed"
  | "storage_unavailable"
  | "unauthorized"
  | "version_conflict";

export class ApiError extends HTTPException {
  readonly code: ApiErrorCode;
  readonly details?: unknown;

  constructor(
    status: ContentfulStatusCode,
    code: ApiErrorCode,
    message: string,
    details?: unknown,
  ) {
    super(status, { message });
    this.code = code;
    this.details = details;
  }
}

export function errorResponse(
  c: Context,
  status: ContentfulStatusCode,
  code: ApiErrorCode,
  message: string,
  details?: unknown,
) {
  return c.json(
    {
      error: {
        code,
        message,
        ...(details === undefined ? {} : { details }),
      },
    },
    status,
  );
}

export function handleError(error: Error, c: Context) {
  if (error instanceof ApiError) {
    return errorResponse(
      c,
      error.status as ContentfulStatusCode,
      error.code,
      error.message,
      error.details,
    );
  }
  if (error instanceof HTTPException) {
    return errorResponse(
      c,
      error.status as ContentfulStatusCode,
      codeForStatus(error.status),
      error.message,
    );
  }
  console.error(error);
  return errorResponse(c, 500, "internal_error", "Internal error");
}

function codeForStatus(status: number): ApiErrorCode {
  if (status === 401) return "unauthorized";
  if (status === 403) return "forbidden";
  if (status === 404) return "not_found";
  if (status === 409) return "version_conflict";
  if (status === 413) return "payload_too_large";
  if (status === 429) return "rate_limited";
  if (status >= 500) return "internal_error";
  return "invalid_request";
}
