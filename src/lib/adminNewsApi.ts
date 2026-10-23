import type { NewsArticle } from "@/data/newsTypes";

import { createApiClient } from "@/lib/apiClient";
import { serverEnv } from "@/lib/env";

type ApiErrorBody = {
  error?: {
    details?: Array<{ message: string; path: string }> | unknown;
    message?: string;
  };
};

type CreateJson = Parameters<ReturnType<typeof news>["$post"]>[0]["json"];

export async function createAdminNews(
  article: NewsArticle,
  options: { actor: string; dryRun: boolean; summary: string },
) {
  return unwrap(
    await news().$post({
      json: {
        actor: options.actor,
        article: article as unknown as CreateJson["article"],
        source: "import",
        summary: options.summary,
      },
      query: { dryRun: options.dryRun ? "true" : "false" },
    }),
  );
}

export async function publishAdminNews(
  slug: string,
  options: { actor: string; expectedVersion: number },
) {
  return unwrap(
    await news()[":slug"].status.$post({
      json: {
        actor: options.actor,
        expectedVersion: options.expectedVersion,
        source: "import",
        status: "published",
        summary: "Publish after import",
      },
      param: { slug },
    }),
  );
}

function news() {
  const token = serverEnv().API_WRITE_TOKEN;
  if (!token) throw new Error("API_WRITE_TOKEN is not set");
  return createApiClient({ token }).v1.admin.news;
}

async function unwrap<T>(response: {
  json: () => Promise<T>;
  ok: boolean;
  status: number;
}): Promise<T extends { data: infer D } ? D : never> {
  const body = (await response.json()) as unknown;
  if (!response.ok) {
    const error = (body as ApiErrorBody | null)?.error;
    const details = Array.isArray(error?.details)
      ? (error.details as Array<{ message: string; path: string }>).map(
          (entry) => `\n  ${entry.path}: ${entry.message}`,
        )
      : [];
    throw new Error(
      `${error?.message ?? `News API answered ${response.status}`}${details.join("")}`,
    );
  }
  return (body as { data: T extends { data: infer D } ? D : never }).data;
}
