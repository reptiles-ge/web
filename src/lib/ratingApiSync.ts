import {
  type ApiFetcher,
  createApiClient,
  serviceBindingFetch,
} from "@/lib/apiClient";
import { ratingInputSchema } from "@/lib/ratingInput";

const RATING_PATH = "/api/rating";

type RatingApiEnv = {
  API?: ApiFetcher;
  API_WRITE_TOKEN?: string;
};

type WaitUntil = {
  waitUntil: (promise: Promise<unknown>) => void;
};

export async function sendRatingToApi(request: Request, env: unknown) {
  const { API: binding, API_WRITE_TOKEN: token } = readEnv(env);
  if (!binding || !token) return;
  try {
    const parsed = ratingInputSchema.safeParse(await request.json());
    if (!parsed.success) return;
    const api = createApiClient({
      fetch: serviceBindingFetch(binding),
      token,
    });
    const response = await api.v1.ratings.$post({
      json: {
        ...parsed.data,
        country: request.headers.get("cf-ipcountry"),
      },
    });
    if (response.status !== 201) {
      console.error(`Rating API sync failed with ${response.status}`);
    }
  } catch {
    console.error("Rating API sync failed");
  }
}

export async function withRatingApiSync(
  request: Request,
  env: unknown,
  ctx: unknown,
  respond: () => Promise<Response>,
) {
  const copy = isRatingRequest(request) ? request.clone() : null;
  const response = await respond();
  if (copy && response.status === 204 && hasWaitUntil(ctx)) {
    ctx.waitUntil(sendRatingToApi(copy, env));
  }
  return response;
}

function hasWaitUntil(ctx: unknown): ctx is WaitUntil {
  return (
    !!ctx &&
    typeof ctx === "object" &&
    "waitUntil" in ctx &&
    typeof ctx.waitUntil === "function"
  );
}

function isRatingRequest(request: Request) {
  return (
    request.method === "POST" && new URL(request.url).pathname === RATING_PATH
  );
}

function readEnv(env: unknown): RatingApiEnv {
  if (!env || typeof env !== "object") return {};
  const { API, API_WRITE_TOKEN } = env as Record<string, unknown>;
  return {
    API:
      API &&
      typeof API === "object" &&
      typeof (API as ApiFetcher).fetch === "function"
        ? (API as ApiFetcher)
        : undefined,
    API_WRITE_TOKEN:
      typeof API_WRITE_TOKEN === "string" && API_WRITE_TOKEN
        ? API_WRITE_TOKEN
        : undefined,
  };
}
