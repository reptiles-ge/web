import handler from "vinext/server/fetch-handler";

import { maintenanceResponse } from "@/lib/maintenance";
import { withRatingApiSync } from "@/lib/ratingApiSync";
import { ratingRateLimitResponse } from "@/lib/ratingRateLimit";
import { withResponseCacheControl } from "@/lib/responseCacheControl";
import { canonicalRscRequest } from "@/lib/rscCanonicalRequest";
import { addScriptNonce } from "@/lib/scriptNonce";

export * from "vinext/server/fetch-handler";

type FetchHandler = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response>;
};

const base: FetchHandler = handler;

const worker: FetchHandler = {
  ...base,
  fetch: async (request, env, ctx) =>
    maintenanceResponse(request, env) ??
    (await ratingRateLimitResponse(request, env)) ??
    (await withRatingApiSync(request, env, ctx, async () =>
      addScriptNonce(
        request,
        withResponseCacheControl(
          request,
          await base.fetch(canonicalRscRequest(request), env, ctx),
        ),
      ),
    )),
};

export default worker;
