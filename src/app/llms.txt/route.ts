import { readFileSync } from "node:fs";
import path from "node:path";

import { llmsTextResponseHeaders } from "@/lib/llmsFiles";

export const dynamic = "force-static";

export function GET() {
  const body = readFileSync(
    path.join(process.cwd(), "public", "llms.txt"),
    "utf8",
  );

  return new Response(body, {
    headers: llmsTextResponseHeaders(),
  });
}
