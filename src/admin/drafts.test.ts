import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "../../tests/msw/server";
import { SessionExpiredError } from "./adminResponse";
import {
  DraftDecisionError,
  fetchDraft,
  fetchDrafts,
  isStale,
  mergeDraft,
  rejectDraft,
} from "./drafts";

const BASE = "https://api.reptiles.ge/v1/admin/drafts";

describe("drafts client", () => {
  it("lists drafts by status with credentials", async () => {
    let seen: null | string = null;
    let credentials: string | undefined;
    server.use(
      http.get(BASE, ({ request }) => {
        seen = new URL(request.url).searchParams.get("status");
        credentials = request.credentials;
        return HttpResponse.json({ data: [{ id: 3 }], total: 1 });
      }),
    );
    expect(await fetchDrafts("rejected")).toEqual([{ id: 3 }]);
    expect(seen).toBe("rejected");
    expect(credentials).toBe("include");
  });

  it("reads one draft and answers null when it is missing", async () => {
    server.use(
      http.get(`${BASE}/:id`, ({ params }) =>
        params.id === "4"
          ? HttpResponse.json({ data: { draft: { id: 4 } } })
          : HttpResponse.json({}, { status: 404 }),
      ),
    );
    expect(await fetchDraft("4")).toEqual({ draft: { id: 4 } });
    expect(await fetchDraft("5")).toBeNull();
  });

  it("reports an expired session", async () => {
    server.use(http.get(BASE, () => new HttpResponse(null, { status: 401 })));
    await expect(fetchDrafts("pending")).rejects.toBeInstanceOf(
      SessionExpiredError,
    );
    server.use(
      http.post(
        `${BASE}/:id/merge`,
        () => new HttpResponse(null, { status: 403 }),
      ),
    );
    await expect(mergeDraft(1)).rejects.toBeInstanceOf(SessionExpiredError);
  });

  it("merges and rejects", async () => {
    const posted: string[] = [];
    server.use(
      http.post(`${BASE}/:id/:action`, ({ params }) => {
        posted.push(`${params.id}/${params.action}`);
        return HttpResponse.json({
          data: {
            revalidated: true,
            speciesId: "x",
            status: "approved",
            version: 3,
          },
        });
      }),
    );
    expect((await mergeDraft(2)).version).toBe(3);
    await rejectDraft(2);
    expect(posted).toEqual(["2/merge", "2/reject"]);
  });

  it("explains a stale draft and passes other API errors through", async () => {
    server.use(
      http.post(`${BASE}/1/merge`, () =>
        HttpResponse.json(
          { error: { code: "version_conflict", message: "x" } },
          { status: 409 },
        ),
      ),
      http.post(`${BASE}/2/merge`, () =>
        HttpResponse.json(
          {
            error: {
              code: "invalid_request",
              message: "Draft is already approved",
            },
          },
          { status: 400 },
        ),
      ),
      http.post(
        `${BASE}/3/reject`,
        () => new HttpResponse("oops", { status: 500 }),
      ),
    );
    await expect(mergeDraft(1)).rejects.toThrow(
      "The species changed after this draft was made. Reject it and make a new draft.",
    );
    await expect(mergeDraft(2)).rejects.toThrow("Draft is already approved");
    const error = await rejectDraft(3).catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(DraftDecisionError);
    expect((error as Error).message).toBe("The request failed (500).");
  });

  it("calls a draft stale when the species moved on", () => {
    expect(isStale({ baseVersion: 2 }, 2)).toBe(false);
    expect(isStale({ baseVersion: 2 }, 3)).toBe(true);
  });
});
