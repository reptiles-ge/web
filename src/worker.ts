import handler from "vinext/server/fetch-handler";

import { apiDocsResponse } from "@/lib/apiDocsProxy";
import { maintenanceResponse } from "@/lib/maintenance";
import {
  htmlRequest,
  markdownResponse,
  prefersMarkdown,
  withAcceptVary,
} from "@/lib/markdownNegotiation";
import { withResponseCacheControl } from "@/lib/responseCacheControl";
import { addScriptNonce } from "@/lib/scriptNonce";

export * from "vinext/server/fetch-handler";

type FetchHandler = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response>;
};

const base: FetchHandler = handler;

const worker: FetchHandler = {
  ...base,
  fetch: async (request, env, ctx) => {
    const render = async (page: Request) =>
      withResponseCacheControl(page, await base.fetch(page, env, ctx));
    return (
      maintenanceResponse(request, env) ??
      (await apiDocsResponse(request, env)) ??
      (prefersMarkdown(request)
        ? markdownResponse(request, await render(htmlRequest(request)))
        : withAcceptVary(addScriptNonce(request, await render(request))))
    );
  },
};

export default worker;
