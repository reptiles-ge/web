import { adminUnavailableResponse } from "@/lib/adminRequest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return adminUnavailableResponse(request);
}
