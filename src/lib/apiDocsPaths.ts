export const API_DOCS_PATH = "/docs";
export const OPENAPI_SPEC_PATH = "/v1/docs/openapi.json";
export const API_CATALOG_PATH = "/.well-known/api-catalog";
export const OPENAPI_CONTENT_TYPE = "application/vnd.oai.openapi+json";
export const API_CATALOG_LINK = `<${API_CATALOG_PATH}>; rel="api-catalog"`;

export function apiDiscoveryLinkHeader() {
  return [
    `<${OPENAPI_SPEC_PATH}>; rel="service-desc"; type="${OPENAPI_CONTENT_TYPE}"`,
    `<${API_DOCS_PATH}>; rel="service-doc"; type="text/html"`,
    API_CATALOG_LINK,
  ].join(", ");
}
