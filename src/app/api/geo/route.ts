import { normalizeCountry } from "@/lib/languageSuggestion";

export const dynamic = "force-dynamic";

const headers = {
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow",
};

export function GET(request: Request) {
  return Response.json(
    { country: normalizeCountry(request.headers.get("cf-ipcountry")) },
    { headers },
  );
}
