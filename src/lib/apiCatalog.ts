import { API_ORIGIN } from "@/lib/apiClient";
import {
  API_DOCS_PATH,
  OPENAPI_CONTENT_TYPE,
  OPENAPI_SPEC_PATH,
} from "@/lib/apiDocsPaths";
import { absoluteUrl } from "@/lib/site";

export const API_CATALOG_CONTENT_TYPE =
  'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"';

export function apiCatalogResponseHeaders() {
  return {
    "Cache-Control":
      "public, max-age=3600, s-maxage=3600, stale-while-revalidate=604800",
    "Content-Type": API_CATALOG_CONTENT_TYPE,
  };
}

export function buildApiCatalog() {
  return {
    linkset: [
      {
        anchor: `${API_ORIGIN}/v1`,
        "service-desc": [
          { href: absoluteUrl(OPENAPI_SPEC_PATH), type: OPENAPI_CONTENT_TYPE },
        ],
        "service-doc": [
          { href: absoluteUrl(API_DOCS_PATH), type: "text/html" },
        ],
        "service-meta": [
          { href: absoluteUrl("/developers"), type: "text/html" },
        ],
      },
    ],
  };
}
