export const REVALIDATED_ASSET_CACHE_CONTROL =
  "public, max-age=604800, stale-while-revalidate=86400";

export const SITEMAP_CACHE_CONTROL = "public, max-age=3600, s-maxage=3600";

const CACHE_CONTROL_BY_PATH: Record<string, string> = {
  "/apple-icon.png": REVALIDATED_ASSET_CACHE_CONTROL,
  "/favicon.ico": REVALIDATED_ASSET_CACHE_CONTROL,
  "/icon.png": REVALIDATED_ASSET_CACHE_CONTROL,
  "/sitemap.xml": SITEMAP_CACHE_CONTROL,
};

export function withResponseCacheControl(
  request: Request,
  response: Response,
): Response {
  if (response.status !== 200) return response;
  if (request.method !== "GET" && request.method !== "HEAD") return response;
  const cacheControl = CACHE_CONTROL_BY_PATH[new URL(request.url).pathname];
  if (!cacheControl) return response;

  const cached = new Response(response.body, response);
  cached.headers.set("Cache-Control", cacheControl);
  return cached;
}
