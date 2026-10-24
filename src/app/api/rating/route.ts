import { createApiClient } from "@/lib/apiClient";
import { ratingInputSchema } from "@/lib/ratingInput";
import {
  proxyReply,
  readProxiedBody,
  visitorHeaders,
} from "@/lib/siteApiProxy";

const PASSED_STATUSES = new Set([201, 400, 403, 429]);

const reply = (status: number) => proxyReply(status, "Rating not sent");

export async function POST(request: Request) {
  const read = await readProxiedBody(request);
  if (!read.ok) return reply(read.status);
  const { body } = read;
  const parsed = ratingInputSchema.safeParse(body);
  if (!parsed.success) return reply(400);
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
      { headers: visitorHeaders(request) },
    );
    return reply(PASSED_STATUSES.has(response.status) ? response.status : 502);
  } catch {
    return reply(502);
  }
}
