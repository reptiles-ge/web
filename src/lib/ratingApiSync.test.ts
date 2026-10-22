import { afterEach, describe, expect, it, vi } from "vitest";

import { app } from "@/api/app";
import { createTestDatabase } from "@/api/testing/sqliteDatabase";

import { sendRatingToApi, withRatingApiSync } from "./ratingApiSync";

const TOKEN = "test-token";

function context() {
  const pending: Array<Promise<unknown>> = [];
  return {
    ctx: { waitUntil: (promise: Promise<unknown>) => pending.push(promise) },
    settle: () => Promise.all(pending),
  };
}

function ratingRequest(body: unknown, path = "/api/rating", method = "POST") {
  return new Request(`https://reptiles.ge${path}`, {
    body: method === "POST" ? JSON.stringify(body) : undefined,
    headers: { "cf-ipcountry": "GE", "Content-Type": "application/json" },
    method,
  });
}

function setup(token = TOKEN) {
  const database = createTestDatabase();
  const apiEnv = { API_WRITE_TOKEN: TOKEN, DB: database.db };
  const fetch = vi.fn(
    async (input: Request | string | URL, init?: RequestInit) =>
      app.request(input, init, apiEnv),
  );
  const siteEnv = { API: { fetch }, API_WRITE_TOKEN: token };
  const rows = () =>
    database.sqlite
      .prepare(
        "SELECT rating, path, locale, feedback, country FROM site_ratings",
      )
      .all();
  return { fetch, rows, siteEnv };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("withRatingApiSync", () => {
  it("copies an accepted rating to the API after responding", async () => {
    const { rows, siteEnv } = setup();
    const { ctx, settle } = context();
    const request = ratingRequest({
      feedback: "ფოტო აკლია",
      locale: "ka",
      path: "/gvelebi",
      rating: 4,
    });
    const response = await withRatingApiSync(
      request,
      siteEnv,
      ctx,
      async () => {
        await request.json();
        return new Response(null, { status: 204 });
      },
    );
    expect(response.status).toBe(204);
    await settle();
    expect(rows()).toEqual([
      {
        country: "GE",
        feedback: "ფოტო აკლია",
        locale: "ka",
        path: "/gvelebi",
        rating: 4,
      },
    ]);
  });

  it("skips other requests, rejected ratings and a missing waitUntil", async () => {
    const { fetch, siteEnv } = setup();
    const { ctx, settle } = context();
    const ok = async () => new Response(null, { status: 204 });
    const body = { locale: "ka", path: "/", rating: 5 };
    await withRatingApiSync(
      ratingRequest(body, "/api/other"),
      siteEnv,
      ctx,
      ok,
    );
    await withRatingApiSync(
      ratingRequest(body, "/api/rating", "GET"),
      siteEnv,
      ctx,
      ok,
    );
    await withRatingApiSync(ratingRequest(body), siteEnv, ctx, async () =>
      Response.json({ error: "Invalid rating" }, { status: 400 }),
    );
    await withRatingApiSync(ratingRequest(body), siteEnv, {}, ok);
    await settle();
    expect(fetch).not.toHaveBeenCalled();
  });
});

describe("sendRatingToApi", () => {
  it("does nothing without the binding or the token", async () => {
    const { fetch, siteEnv } = setup();
    const body = { locale: "ka", path: "/", rating: 5 };
    await sendRatingToApi(ratingRequest(body), null);
    await sendRatingToApi(ratingRequest(body), { API: siteEnv.API });
    await sendRatingToApi(ratingRequest(body), {
      API: { fetch: "nope" },
      API_WRITE_TOKEN: TOKEN,
    });
    await sendRatingToApi(ratingRequest(body), {
      ...siteEnv,
      API_WRITE_TOKEN: "",
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("ignores a body that fails the shared rating rules", async () => {
    const { fetch, siteEnv } = setup();
    await sendRatingToApi(
      ratingRequest({ locale: "ka", path: "/", rating: 9 }),
      siteEnv,
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  it("logs when the API rejects or cannot be reached", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    const { rows, siteEnv } = setup("wrong");
    const body = { locale: "ka", path: "/", rating: 5 };
    await sendRatingToApi(ratingRequest(body), siteEnv);
    expect(log).toHaveBeenCalledWith("Rating API sync failed with 401");
    await sendRatingToApi(ratingRequest(body), {
      API: {
        fetch: async () => {
          throw new Error("down");
        },
      },
      API_WRITE_TOKEN: TOKEN,
    });
    expect(log).toHaveBeenCalledWith("Rating API sync failed");
    expect(rows()).toEqual([]);
  });
});
