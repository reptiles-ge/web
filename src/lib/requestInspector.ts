const PREFIX = "[request-inspector]";

const INSPECTED_HEADERS = [
  "accept",
  "accept-language",
  "cf-connecting-ip",
  "cf-ipcountry",
  "cf-ray",
  "cf-visitor",
  "forwarded",
  "host",
  "next-router-prefetch",
  "next-url",
  "origin",
  "purpose",
  "referer",
  "rsc",
  "sec-fetch-dest",
  "sec-fetch-mode",
  "sec-fetch-site",
  "sec-purpose",
  "user-agent",
  "x-forwarded-for",
  "x-forwarded-host",
  "x-forwarded-port",
  "x-forwarded-proto",
  "x-next-intl-locale",
  "x-real-ip",
] as const;

export type RequestSnapshot = {
  cookieNames: string[];
  headers: Partial<Record<(typeof INSPECTED_HEADERS)[number], string>>;
  method?: string;
  pathname?: string;
  query?: string;
  source: string;
  url?: string;
};

type HeaderReader = Pick<Headers, "get">;

export function inspectProxyRequest(request: {
  cookies: { getAll(): { name: string }[] };
  headers: HeaderReader;
  method: string;
  nextUrl: URL;
}) {
  if (process.env.NODE_ENV !== "development") return;
  const scope = requestInspectorScope();
  if (!scope) return;
  if (!matchesInspectorScope(scope, request.nextUrl.pathname)) return;
  if (isBackgroundRequest(request.headers)) return;
  logRequestSnapshot(
    snapshotRequest(
      "proxy",
      request.headers,
      request.cookies.getAll().map((cookie) => cookie.name),
      request.nextUrl,
      request.method,
    ),
  );
}

export function isBackgroundRequest(headers: HeaderReader): boolean {
  const purpose = `${headers.get("purpose") ?? ""} ${headers.get("sec-purpose") ?? ""}`;
  return (
    headers.get("rsc") === "1" ||
    headers.get("next-router-prefetch") !== null ||
    /prefetch/i.test(purpose)
  );
}

export function logRequestSnapshot(snapshot: RequestSnapshot) {
  console.info(PREFIX, JSON.stringify(snapshot, null, 2));
}

export function matchesInspectorScope(
  scope: readonly string[],
  pathname: string,
): boolean {
  if (scope.length === 0) return true;
  return scope.some(
    (path) =>
      path === "" || pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function requestInspectorScope(): null | string[] {
  if (process.env.NODE_ENV !== "development") return null;
  const value = process.env.REQUEST_INSPECTOR?.trim();
  if (!value) return null;
  if (value === "*" || value === "1") return [];
  const paths = value
    .split(",")
    .map((path) => path.trim())
    .filter((path) => path.startsWith("/"))
    .map((path) => path.replace(/\/$/, ""));
  return paths.length > 0 ? paths : null;
}

export function snapshotRequest(
  source: string,
  headers: HeaderReader,
  cookieNames: readonly string[],
  url?: URL,
  method?: string,
): RequestSnapshot {
  const picked: RequestSnapshot["headers"] = {};
  for (const name of INSPECTED_HEADERS) {
    const value = headers.get(name);
    if (value !== null) picked[name] = value;
  }
  return {
    cookieNames: [...new Set(cookieNames)].sort(),
    headers: picked,
    method,
    pathname: url?.pathname,
    query: url?.search || undefined,
    source,
    url: url?.href,
  };
}
