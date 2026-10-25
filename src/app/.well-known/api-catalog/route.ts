import { apiCatalogResponseHeaders, buildApiCatalog } from "@/lib/apiCatalog";

export const dynamic = "force-static";

export function GET() {
  return new Response(JSON.stringify(buildApiCatalog()), {
    headers: apiCatalogResponseHeaders(),
  });
}
