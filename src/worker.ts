import handler from "vinext/server/fetch-handler";

import { apiDocsResponse } from "@/lib/apiDocsProxy";
import { maintenanceResponse } from "@/lib/maintenance";
import {
  htmlRequest,
  markdownPathRequest,
  markdownResponse,
  prefersMarkdown,
  withMarkdownAlternate,
} from "@/lib/markdownNegotiation";
import { withResponseCacheControl } from "@/lib/responseCacheControl";
import { addScriptNonce } from "@/lib/scriptNonce";
import { trailingSlashResponse } from "@/lib/trailingSlash";

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
    const markdownPage =
      markdownPathRequest(request) ??
      (prefersMarkdown(request) ? request : undefined);
    return (
      maintenanceResponse(request, env) ??
      (await apiDocsResponse(request, env)) ??
      trailingSlashResponse(request) ??
      (markdownPage
        ? markdownResponse(
            markdownPage,
            await render(htmlRequest(markdownPage)),
          )
        : withMarkdownAlternate(
            request,
            addScriptNonce(request, await render(request)),
          ))
    );
  },
};

export default worker;
