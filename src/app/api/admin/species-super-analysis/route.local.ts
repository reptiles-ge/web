import { localAdminForbiddenResponse } from "@/lib/adminAccess";
import {
  adminUnavailableResponse,
  isLocalAdminOriginRequest,
} from "@/lib/adminRequest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  let origin = request.headers.get("origin");
  if (!origin) {
    try {
      origin = new URL(request.headers.get("referer") ?? "").origin;
    } catch {
      return localAdminForbiddenResponse();
    }
  }
  if (
    !isLocalAdminOriginRequest(
      new Request(request.url, { headers: { origin } }),
    )
  )
    return localAdminForbiddenResponse();
  return Response.json(null, {
    headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
  });
}

export async function POST(request: Request) {
  return adminUnavailableResponse(request);
}
