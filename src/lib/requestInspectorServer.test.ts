import { afterEach, describe, expect, it, vi } from "vitest";

const headers = vi.fn();
const cookies = vi.fn();

vi.mock("next/headers", () => ({ cookies, headers }));

const { inspectServerRequest } = await import("@/lib/requestInspectorServer");

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  headers.mockReset();
  cookies.mockReset();
});

describe("inspectServerRequest", () => {
  it("logs the headers and cookie names a Server Component sees", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("REQUEST_INSPECTOR", "*");
    headers.mockResolvedValue(
      new Headers({ authorization: "x", "x-next-intl-locale": "ka" }),
    );
    cookies.mockResolvedValue({
      getAll: () => [{ name: "NEXT_LOCALE", value: "secret" }],
    });
    const info = vi.spyOn(console, "info").mockImplementation(() => undefined);
    await inspectServerRequest("SpeciesPage");
    expect(JSON.parse(String(info.mock.calls[0][1]))).toEqual({
      cookieNames: ["NEXT_LOCALE"],
      headers: { "x-next-intl-locale": "ka" },
      source: "server:SpeciesPage",
    });
  });

  it.each([
    ["production", "*"],
    ["development", undefined],
  ])("never reads the request when off (%s)", async (mode, scope) => {
    vi.stubEnv("NODE_ENV", mode);
    vi.stubEnv("REQUEST_INSPECTOR", scope);
    await inspectServerRequest("SpeciesPage");
    expect(headers).not.toHaveBeenCalled();
    expect(cookies).not.toHaveBeenCalled();
  });
});
