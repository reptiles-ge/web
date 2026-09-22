import { buildLlmsIndexText, llmsTextResponseHeaders } from "@/lib/llmsFiles";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsIndexText(), {
    headers: llmsTextResponseHeaders(),
  });
}
