import { routing } from "@/i18n/routing";
import { buildLlmsFullText } from "@/lib/llmsFiles";
import { loadLlmsSpecies } from "@/lib/llmsResponse";
import { llmsTextResponseHeaders } from "@/lib/robotsTxt";

export const dynamic = "force-static";

export async function GET() {
  return new Response(
    buildLlmsFullText(await loadLlmsSpecies(routing.defaultLocale)),
    {
      headers: llmsTextResponseHeaders({ noindex: true }),
    },
  );
}
