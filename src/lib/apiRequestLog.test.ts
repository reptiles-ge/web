import { afterEach, describe, expect, it, vi } from "vitest";

import { loggedFetch } from "@/lib/apiRequestLog";

const URL_WITH_PARAMS =
  "https://api.reptiles.ge/v1/species?group=snake&tag=a&tag=b";

function captureGroup() {
  vi.stubGlobal("window", {});
  const group = vi
    .spyOn(console, "groupCollapsed")
    .mockImplementation(() => undefined);
  const info = vi.spyOn(console, "info").mockImplementation(() => undefined);
  const end = vi.spyOn(console, "groupEnd").mockImplementation(() => undefined);
  return {
    details: () =>
      Object.fromEntries(
        info.mock.calls.map(([label, value]) => [
          String(label).replace(/:$/, ""),
          value,
        ]),
      ),
    end,
    title: () => String(group.mock.calls[0][0]).replace(/\(\d+ ms\)/, "(N ms)"),
  };
}

function noContent() {
  return async () => new Response(null, { status: 204 });
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("loggedFetch", () => {
  it("groups params, a JSON body and a JSON response", async () => {
    const log = captureGroup();
    const response = await loggedFetch(async () =>
      Response.json({ ok: true }, { status: 201 }),
    )(URL_WITH_PARAMS, { body: JSON.stringify({ score: 5 }), method: "POST" });
    expect(await response.json()).toEqual({ ok: true });
    expect(log.title()).toBe(
      `[api-request] POST ${URL_WITH_PARAMS} → 201 (N ms)`,
    );
    expect(log.details()).toEqual({
      body: { score: 5 },
      params: { group: "snake", tag: ["a", "b"] },
      response: { ok: true },
    });
    expect(log.end).toHaveBeenCalledOnce();
  });

  it("leaves out empty params, body and response", async () => {
    const log = captureGroup();
    await loggedFetch(noContent())("https://api.reptiles.ge/v1/x");
    expect(log.title()).toBe(
      "[api-request] GET https://api.reptiles.ge/v1/x → 204 (N ms)",
    );
    expect(log.details()).toEqual({});
  });

  it.each<[BodyInit, unknown]>([
    ["plain text", "plain text"],
    [new URLSearchParams({ a: "1" }), { a: "1" }],
    [new Blob(["xyz"], { type: "image/png" }), "<image/png, 3 bytes>"],
    [new Blob(["xyz"]), "<blob, 3 bytes>"],
    [new ArrayBuffer(2), "<ArrayBuffer>"],
  ])("describes a %o body", async (body, expected) => {
    const log = captureGroup();
    await loggedFetch(noContent())("https://api.reptiles.ge/v1/x", {
      body,
      method: "PUT",
    });
    expect(log.details().body).toEqual(expected);
  });

  it("lists form fields and file names", async () => {
    const log = captureGroup();
    const form = new FormData();
    form.set("caption", "Viper");
    form.set("photo", new File(["x"], "viper.jpg"));
    await loggedFetch(noContent())("https://api.reptiles.ge/v1/upload", {
      body: form,
      method: "POST",
    });
    expect(log.details().body).toEqual({
      caption: "Viper",
      photo: "<file viper.jpg>",
    });
  });

  it("summarises a binary response", async () => {
    const log = captureGroup();
    await loggedFetch(
      async () =>
        new Response(new Uint8Array(10), {
          headers: { "content-type": "image/jpeg" },
        }),
    )(new Request("https://api.reptiles.ge/v1/photo"));
    expect(log.details().response).toBe("<image/jpeg, 10 bytes>");
  });

  it("logs the request when the call fails and rethrows", async () => {
    const log = captureGroup();
    const failure = new Error("offline");
    await expect(
      loggedFetch(async () => {
        throw failure;
      })(URL_WITH_PARAMS),
    ).rejects.toBe(failure);
    expect(log.title()).toBe(
      `[api-request] GET ${URL_WITH_PARAMS} → failed (N ms)`,
    );
    expect(log.details()).toEqual({
      error: failure,
      params: { group: "snake", tag: ["a", "b"] },
    });
  });

  it("uses the global fetch when none is given", async () => {
    captureGroup();
    const global = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("ok"));
    await loggedFetch()("https://api.reptiles.ge/v1/x");
    expect(global).toHaveBeenCalledOnce();
  });

  it("prints the title and details in one line set on the server", async () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => undefined);
    const group = vi.spyOn(console, "groupCollapsed");
    await loggedFetch(async () => Response.json({ ok: true }))(
      "https://api.reptiles.ge/v1/x?a=1",
    );
    expect(group).not.toHaveBeenCalled();
    const [title, ...rest] = info.mock.calls[0];
    expect(String(title)).toMatch(
      /^\[api-request\] GET https:\/\/api\.reptiles\.ge\/v1\/x\?a=1 → 200 \(\d+ ms\)$/,
    );
    expect(rest).toEqual([
      "\n  params:",
      { a: "1" },
      "\n  response:",
      { ok: true },
    ]);
  });
});
