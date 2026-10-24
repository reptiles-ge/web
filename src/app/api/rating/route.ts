import { createApiClient } from "@/lib/apiClient";
import { ratingInputSchema } from "@/lib/ratingInput";
import {
  VISITOR_COUNTRY_HEADER,
  VISITOR_IP_HEADER,
} from "@/lib/visitorHeaders";

const noindex = { "X-Robots-Tag": "noindex, nofollow" };

const MAX_BODY_BYTES = 16 * 1024;

const PASSED_STATUSES = new Set([201, 400, 403, 429]);

type RatingBody = Record<
  "feedback" | "pages" | "referrer" | "seconds",
  unknown
>;

export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  if (request.headers.get("origin") !== origin) return reply(403);
  const text = await request.text();
  if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) {
    return reply(413);
  }
  const body = parseBody(text);
  const parsed = ratingInputSchema.safeParse(body);
  if (!body || !parsed.success) return reply(400);
  const { locale, path, rating } = parsed.data;
  try {
    const response = await createApiClient().v1.ratings.$post(
      {
        json: {
          feedback: body.feedback,
          locale,
          pages: body.pages,
          path,
          rating,
          referrer: body.referrer,
          seconds: body.seconds,
        },
      },
      { headers: visitorHeaders(request, origin) },
    );
    return reply(PASSED_STATUSES.has(response.status) ? response.status : 502);
  } catch {
    return reply(502);
  }
}

function parseBody(text: string) {
  try {
    const value: unknown = JSON.parse(text);
    return value && typeof value === "object" && !Array.isArray(value)
      ? (value as RatingBody)
      : null;
  } catch {
    return null;
  }
}

function reply(status: number) {
  if (status === 201) {
    return new Response(null, { headers: noindex, status });
  }
  return Response.json(
    { error: "Rating not sent" },
    { headers: noindex, status },
  );
}

function visitorHeaders(request: Request, origin: string) {
  const headers: Record<string, string> = { Origin: origin };
  for (const [name, value] of [
    ["Accept-Language", request.headers.get("accept-language")],
    ["User-Agent", request.headers.get("user-agent")],
    [VISITOR_COUNTRY_HEADER, request.headers.get("cf-ipcountry")],
    [VISITOR_IP_HEADER, request.headers.get("cf-connecting-ip")],
  ] as const) {
    if (value) headers[name] = value;
  }
  return headers;
}
