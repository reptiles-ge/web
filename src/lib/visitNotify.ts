export const VISIT_COOKIE = "rp_v";
export const VISIT_STORAGE_KEY = "reptiles-visit";

const PATH_MAX = 200;
const REFERRER_MAX = 300;

export function createVisitLimiter(windowMs: number) {
  const lastByKey = new Map<string, number>();

  return {
    take(key: string, now = Date.now()) {
      const last = lastByKey.get(key);
      if (last !== undefined && now - last < windowMs) return false;
      lastByKey.set(key, now);
      if (lastByKey.size > 8_000) {
        for (const [entry, at] of lastByKey) {
          if (now - at > windowMs) lastByKey.delete(entry);
        }
      }
      return true;
    },
  };
}

export const visitLimiter = createVisitLimiter(60_000);

export function formatVisitMessage(input: {
  path: string;
  referrer?: string;
}) {
  const lines = ["ახალი ვიზიტი", `გვერდი: ${input.path}`];
  if (input.referrer) lines.push(`წყარო: ${input.referrer}`);
  return lines.join("\n");
}

export function readVisitPath(body: unknown) {
  if (!body || typeof body !== "object") return null;
  const record = body as Record<string, unknown>;
  const path = sanitizeVisitPath(record.path);
  if (!path) return null;
  return {
    path,
    referrer: sanitizeVisitReferrer(record.referrer),
  };
}

export function sanitizeVisitPath(value: unknown) {
  if (typeof value !== "string") return null;
  const path = value.trim();
  if (!path.startsWith("/")) return null;
  if (path.length > PATH_MAX) return null;
  if (path.includes("://")) return null;
  if (/[\u0000-\u001f\u007f]/.test(path)) return null;
  return path;
}

export function sanitizeVisitReferrer(value: unknown) {
  if (typeof value !== "string") return undefined;
  const raw = value.trim();
  if (!raw || raw.length > REFERRER_MAX) return undefined;
  if (/[\u0000-\u001f\u007f]/.test(raw)) return undefined;
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

export function visitClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 64);
  }
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real.slice(0, 64);
  return "unknown";
}

export function visitOriginAllowed(request: Request, originUrl: URL) {
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      return new URL(origin).origin === originUrl.origin;
    } catch {
      return false;
    }
  }
  return request.headers.get("sec-fetch-site") === "same-origin";
}
