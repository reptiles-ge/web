import { buildRobotsTxt, llmsTextResponseHeaders } from "@/lib/robotsTxt";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildRobotsTxt(), {
    headers: llmsTextResponseHeaders(),
  });
}
