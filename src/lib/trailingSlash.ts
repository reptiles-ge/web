const PROXY_SKIPPED_PATH = /^\/(?:api|admin|_next|_vercel|.*\..*)/;

export function trailingSlashResponse(request: Request): null | Response {
  const url = new URL(request.url);
  if (url.pathname === "/" || !url.pathname.endsWith("/")) return null;
  if (url.hostname === "www.reptiles.ge") return null;
  if (!PROXY_SKIPPED_PATH.test(url.pathname)) return null;
  const pathname = url.pathname.replace(/\/+$/, "") || "/";
  return new Response(null, {
    headers: { Location: `${pathname}${url.search}` },
    status: 308,
  });
}
