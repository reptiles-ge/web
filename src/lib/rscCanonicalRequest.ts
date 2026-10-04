const RSC_HEADER = "RSC";
const RSC_CACHE_PARAM = "_rsc";

const VARIANT_HEADERS = [
  "X-Vinext-Interception-Context",
  "X-Vinext-Interception-Id",
  "X-Vinext-Mounted-Slots",
  "X-Vinext-Rsc-Render-Mode",
];

const CONTEXT_HEADERS = [
  "Next-Router-Prefetch",
  "Next-Router-Segment-Prefetch",
  "Next-Router-State-Tree",
  "Next-Url",
  "X-Vinext-Client-Reuse-Manifest",
  "X-Vinext-Rsc-State-Fingerprint",
];

export function canonicalRscRequest(request: Request): Request {
  if (request.method !== "GET" || request.headers.get(RSC_HEADER) !== "1") {
    return request;
  }
  if (VARIANT_HEADERS.some((name) => request.headers.has(name))) return request;
  if (!CONTEXT_HEADERS.some((name) => request.headers.has(name))) {
    return request;
  }

  const headers = new Headers(request.headers);
  for (const name of CONTEXT_HEADERS) headers.delete(name);

  const url = new URL(request.url);
  url.searchParams.delete(RSC_CACHE_PARAM);
  url.search = url.search
    ? `${url.search}&${RSC_CACHE_PARAM}`
    : RSC_CACHE_PARAM;

  return new Request(url, new Request(request, { headers }));
}
