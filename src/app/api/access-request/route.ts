import { apiAccessRequestSchema } from "@/lib/apiAccessRequestInput";
import { createApiClient } from "@/lib/apiClient";
import {
  proxyReply,
  readProxiedBody,
  visitorHeaders,
} from "@/lib/siteApiProxy";

const PASSED_STATUSES = new Set([201, 400, 403, 429, 503]);

const reply = (status: number) => proxyReply(status, "Request not sent");

export async function POST(request: Request) {
  const read = await readProxiedBody(request);
  if (!read.ok) return reply(read.status);
  const parsed = apiAccessRequestSchema.safeParse(read.body);
  if (!parsed.success) return reply(400);
  try {
    const response = await createApiClient().v1["access-requests"].$post(
      { json: parsed.data },
      { headers: visitorHeaders(request) },
    );
    return reply(PASSED_STATUSES.has(response.status) ? response.status : 502);
  } catch {
    return reply(502);
  }
}
