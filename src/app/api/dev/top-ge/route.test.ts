import { afterEach, expect, it, vi } from "vitest";

import { GET } from "./route";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

it("proxies both top.ge requests with the production Referer in development", async () => {
  vi.stubEnv("NODE_ENV", "development");
  const fetchMock = vi
    .fn()
    .mockResolvedValueOnce(
      new Response('"https://counter.top.ge/cgi-bin/count222?"'),
    )
    .mockResolvedValueOnce(
      new Response(new Uint8Array([71, 73, 70]), {
        headers: { "Content-Type": "image/gif" },
      }),
    );
  vi.stubGlobal("fetch", fetchMock);

  const script = await GET(
    new Request("http://localhost/api/dev/top-ge?script"),
  );
  expect(await script.text()).toBe('"/api/dev/top-ge?"');

  const counter = await GET(
    new Request("http://localhost/api/dev/top-ge?ID:118888+JS:11"),
  );
  expect(counter.headers.get("Content-Type")).toBe("image/gif");
  expect(fetchMock).toHaveBeenNthCalledWith(
    1,
    "https://counter.top.ge/counter.js",
    { cache: "no-store", headers: { Referer: "https://reptiles.ge/" } },
  );
  expect(fetchMock).toHaveBeenNthCalledWith(
    2,
    "https://counter.top.ge/cgi-bin/count222?ID:118888+JS:11",
    { cache: "no-store", headers: { Referer: "https://reptiles.ge/" } },
  );
});

it("does not proxy top.ge in production", async () => {
  vi.stubEnv("NODE_ENV", "production");
  const fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);

  const response = await GET(
    new Request("http://localhost/api/dev/top-ge?script"),
  );
  expect(response.status).toBe(404);
  expect(fetchMock).not.toHaveBeenCalled();
});
