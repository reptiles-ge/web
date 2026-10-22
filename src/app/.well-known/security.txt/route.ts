import { llmsTextResponseHeaders } from "@/lib/robotsTxt";
import { buildSecurityTxt } from "@/lib/securityTxt";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildSecurityTxt(), {
    headers: llmsTextResponseHeaders(),
  });
}
