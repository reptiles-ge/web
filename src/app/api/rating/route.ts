import { hasLocale } from "next-intl";

import { routing } from "@/i18n/routing";
import { notifyAdminTelegram } from "@/lib/adminTelegram";
import { createRateLimiter } from "@/lib/rateLimit";
import { absoluteUrl } from "@/lib/site";

const noindex = { "X-Robots-Tag": "noindex, nofollow" };
const MAX_PATH_LENGTH = 300;
const WINDOW_MS = 60_000;
const allowVisitor = createRateLimiter({ limit: 3, windowMs: WINDOW_MS });
const allowAll = createRateLimiter({ limit: 30, windowMs: WINDOW_MS });

type RatingBody = {
  locale?: unknown;
  path?: unknown;
  rating?: unknown;
};

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return Response.json(
      { error: "Forbidden" },
      { headers: noindex, status: 403 },
    );
  }

  let body: RatingBody;
  try {
    body = (await request.json()) as RatingBody;
  } catch {
    return invalid();
  }
  if (!body || typeof body !== "object") return invalid();

  const { locale, path, rating } = body;
  if (
    typeof rating !== "number" ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5 ||
    typeof path !== "string" ||
    path.length > MAX_PATH_LENGTH ||
    !/^\/(?!\/)\S*$/.test(path) ||
    !hasLocale(routing.locales, locale)
  ) {
    return invalid();
  }

  const visitor =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  if (!allowVisitor(visitor) || !allowAll("all")) {
    return Response.json(
      { error: "Too many ratings" },
      { headers: noindex, status: 429 },
    );
  }

  await notifyAdminTelegram(
    [
      `${"★".repeat(rating)}${"☆".repeat(5 - rating)} ${rating}/5`,
      absoluteUrl(path),
      locale,
    ].join("\n"),
  );
  return new Response(null, { headers: noindex, status: 204 });
}

function invalid() {
  return Response.json(
    { error: "Invalid rating" },
    { headers: noindex, status: 400 },
  );
}
