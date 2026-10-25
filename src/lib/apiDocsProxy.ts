import { API_ORIGIN } from "@/lib/apiClient";
import { API_DOCS_PATH, OPENAPI_SPEC_PATH } from "@/lib/apiDocsPaths";

const API_DOCS_PATHS: Record<string, string> = {
  [API_DOCS_PATH]: "/v1/docs",
  [OPENAPI_SPEC_PATH]: OPENAPI_SPEC_PATH,
};

type ServiceBinding = { fetch: (request: Request) => Promise<Response> };

export function apiDocsResponse(
  request: Request,
  env: unknown,
): null | Promise<Response> {
  const url = new URL(request.url);
  const target = API_DOCS_PATHS[url.pathname];
  if (!target) return null;

  const api = apiBinding(env);
  if (!api) return null;

  return api.fetch(new Request(`${API_ORIGIN}${target}${url.search}`, request));
}

function apiBinding(env: unknown): null | ServiceBinding {
  if (typeof env !== "object" || env === null || !("API" in env)) return null;
  const { API } = env;
  return typeof API === "object" &&
    API !== null &&
    "fetch" in API &&
    typeof API.fetch === "function"
    ? (API as ServiceBinding)
    : null;
}
