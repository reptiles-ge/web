import handler from "vinext/server/fetch-handler";

import { maintenanceResponse } from "@/lib/maintenance";
import { canonicalRscRequest } from "@/lib/rscCanonicalRequest";

export * from "vinext/server/fetch-handler";

type FetchHandler = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response>;
};

const base: FetchHandler = handler;

const worker: FetchHandler = {
  ...base,
  fetch: async (request, env, ctx) =>
    maintenanceResponse(request, env) ??
    base.fetch(canonicalRscRequest(request), env, ctx),
};

export default worker;
