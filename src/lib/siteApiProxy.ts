import {
  VISITOR_COUNTRY_HEADER,
  VISITOR_IP_HEADER,
} from "@/lib/visitorHeaders";

const noindex = { "X-Robots-Tag": "noindex, nofollow" };

const MAX_BODY_BYTES = 16 * 1024;

export type ProxiedBody =
  { body: Record<string, unknown>; ok: true } | { ok: false; status: number };

export function proxyReply(status: number, error: string) {
  if (status === 201) {
    return new Response(null, { headers: noindex, status });
  }
  return Response.json({ error }, { headers: noindex, status });
}

export async function readProxiedBody(request: Request): Promise<ProxiedBody> {
  const origin = new URL(request.url).origin;
  if (request.headers.get("origin") !== origin) {
    return { ok: false, status: 403 };
  }
  const text = await request.text();
  if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) {
    return { ok: false, status: 413 };
  }
  const body = parseObject(text);
  return body ? { body, ok: true } : { ok: false, status: 400 };
}

export function visitorHeaders(request: Request) {
  const headers: Record<string, string> = {
    Origin: new URL(request.url).origin,
  };
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

function parseObject(text: string) {
  try {
    const value: unknown = JSON.parse(text);
    return value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}
