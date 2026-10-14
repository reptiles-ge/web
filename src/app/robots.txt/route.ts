import { buildRobotsTxt, llmsTextResponseHeaders } from "@/lib/llmsFiles";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildRobotsTxt(), {
    headers: llmsTextResponseHeaders(),
  });
}
