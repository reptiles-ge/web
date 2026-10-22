import { INDEXNOW_KEY } from "@/lib/indexNow";
import { llmsTextResponseHeaders } from "@/lib/robotsTxt";

export const dynamic = "force-static";

export function GET() {
  return new Response(INDEXNOW_KEY, {
    headers: llmsTextResponseHeaders({ noindex: true }),
  });
}
