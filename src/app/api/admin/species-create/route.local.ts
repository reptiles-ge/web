import { adminUnavailableResponse } from "@/lib/adminRequest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function POST(request: Request) {
  return adminUnavailableResponse(request);
}
