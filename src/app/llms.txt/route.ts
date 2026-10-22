import { buildLlmsIndexText } from "@/lib/llmsFiles";
import { llmsTextResponseHeaders } from "@/lib/robotsTxt";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsIndexText(), {
    headers: llmsTextResponseHeaders(),
  });
}
