import handler from "vinext/server/fetch-handler";

import { canonicalRscRequest } from "@/lib/rscCanonicalRequest";

export * from "vinext/server/fetch-handler";

type FetchHandler = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response>;
};

const base: FetchHandler = handler;

const worker: FetchHandler = {
  ...base,
  fetch: (request, env, ctx) =>
    base.fetch(canonicalRscRequest(request), env, ctx),
};

export default worker;
