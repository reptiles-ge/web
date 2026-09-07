import { buildRobotsTxt, llmsTextResponseHeaders } from "@/lib/llmsFiles";

export function GET() {
  return new Response(buildRobotsTxt(), {
    headers: llmsTextResponseHeaders(),
  });
}
