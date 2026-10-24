import type { InferResponseType } from "hono/client";

import type { Page } from "@/lib/pagination";

import { checkAdminResponse, SessionExpiredError } from "./adminResponse";
import { api } from "./apiClient";
import { type PagedQuery, toQueryParams } from "./pagination";

export type AdminDraft = InferResponseType<
  typeof api.v1.admin.drafts.$get,
  200
>["data"][number];

export type AdminDraftDetail = InferResponseType<
  (typeof api.v1.admin.drafts)[":draftId"]["$get"],
  200
>["data"];

export type DraftStatus = AdminDraft["status"];

export const DRAFT_STATUS_COLORS: Record<DraftStatus, string> = {
  approved: "green",
  pending: "gold",
  rejected: "default",
};

export class DraftDecisionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DraftDecisionError";
  }
}

export async function fetchDraft(id: string): Promise<AdminDraftDetail | null> {
  const response = await api.v1.admin.drafts[":draftId"].$get({
    param: { draftId: id },
  });
  const status: number = response.status;
  if (status === 404 || status === 400) return null;
  checkAdminResponse(response, "Draft failed");
  return (await response.json()).data;
}

export async function fetchDrafts(
  query: PagedQuery<{ status: DraftStatus }>,
): Promise<Page<AdminDraft>> {
  const response = await api.v1.admin.drafts.$get({
    query: toQueryParams(query),
  });
  checkAdminResponse(response, "Drafts list failed");
  return response.json();
}

export function isStale(draft: { baseVersion: number }, version: number) {
  return draft.baseVersion !== version;
}

export async function mergeDraft(id: number) {
  const response = await api.v1.admin.drafts[":draftId"].merge.$post({
    param: { draftId: String(id) },
  });
  if (response.ok) return (await response.json()).data;
  throw await decisionError(response);
}

export async function rejectDraft(id: number) {
  const response = await api.v1.admin.drafts[":draftId"].reject.$post({
    param: { draftId: String(id) },
  });
  if (response.ok) return;
  throw await decisionError(response);
}

async function decisionError(response: Response) {
  if (response.status === 401 || response.status === 403) {
    return new SessionExpiredError();
  }
  if (response.status === 409) {
    return new DraftDecisionError(
      "The species changed after this draft was made. Reject it and make a new draft.",
    );
  }
  const body = (await response.json().catch(() => null)) as null | {
    error?: { message?: string };
  };
  return new DraftDecisionError(
    body?.error?.message ?? `The request failed (${response.status}).`,
  );
}
