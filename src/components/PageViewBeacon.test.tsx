import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const route = vi.hoisted(() => ({
  locale: "ka",
  params: {} as Record<string, string | string[]>,
  pathname: "/",
}));

vi.mock("next-intl", () => ({ useLocale: () => route.locale }));
vi.mock("next/navigation", () => ({ useParams: () => route.params }));
vi.mock("@/i18n/navigation", () => ({ usePathname: () => route.pathname }));
vi.mock("@/components/LocaleSwitchProvider", () => ({
  useLocaleSwitchIndex: () => ({
    groupById: { "macrovipera-lebetina": "snake" },
    guides: {},
    hubById: { "macrovipera-lebetina": "snakes" },
    idBySlug: { giurza: "macrovipera-lebetina" },
    kaSlugById: { "macrovipera-lebetina": "giurza" },
    quizzes: [],
  }),
}));

const API = "https://api.reptiles.ge";

async function renderBeacon() {
  const { PageViewBeacon } = await import("@/components/PageViewBeacon");
  const view = render(<PageViewBeacon apiOrigin={API} />);
  return {
    ...view,
    rerender: () => view.rerender(<PageViewBeacon apiOrigin={API} />),
  };
}

function sentBodies() {
  return vi.mocked(fetch).mock.calls.map(([url, init]) => {
    expect(String(url)).toBe(`${API}/v1/views`);
    expect(init?.method).toBe("POST");
    return JSON.parse(String(init?.body)) as Record<string, unknown>;
  });
}

function setReferrer(value: string) {
  vi.spyOn(document, "referrer", "get").mockReturnValue(value);
}

describe("PageViewBeacon", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers({
      now: new Date("2026-10-24T10:00:00Z"),
      toFake: ["Date"],
    });
    vi.spyOn(navigator, "webdriver", "get").mockReturnValue(false);
    setReferrer("");
    window.localStorage.clear();
    window.history.replaceState(null, "", "/");
    Object.assign(route, { locale: "ka", params: {}, pathname: "/" });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 202 })),
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("sends the landing page with its source once", async () => {
    setReferrer("https://www.google.com/");
    const view = await renderBeacon();
    view.rerender();

    expect(sentBodies()).toEqual([
      { entry: { referrer: "google.com" }, locale: "ka", path: "/" },
    ]);
    expect(window.localStorage.getItem("reptiles:page-viewed:/")).toBeNull();
  });

  it("sends a page without a new source only when it counts a species or article", async () => {
    window.localStorage.setItem("reptiles:entry:{}", "2026-10-24");
    const first = await renderBeacon();
    first.unmount();
    Object.assign(route, {
      params: { slug: "giurza" },
      pathname: "/snakes/[slug]",
    });
    const second = await renderBeacon();
    second.rerender();

    expect(sentBodies()).toEqual([
      { locale: "ka", path: "/snakes/macrovipera-lebetina" },
    ]);
    expect(
      window.localStorage.getItem(
        "reptiles:page-viewed:/snakes/macrovipera-lebetina",
      ),
    ).toBe("2026-10-24");
  });

  it("names a species page by id and sends no entry after landing", async () => {
    const first = await renderBeacon();
    first.unmount();
    Object.assign(route, {
      params: { slug: "giurza" },
      pathname: "/snakes/[slug]",
    });
    await renderBeacon();

    expect(sentBodies()).toEqual([
      { entry: {}, locale: "ka", path: "/" },
      { locale: "ka", path: "/snakes/macrovipera-lebetina" },
    ]);
  });

  it("keeps the landing source for the first page that can be counted", async () => {
    setReferrer("https://www.google.com/");
    route.pathname = "/no-such-page";
    const first = await renderBeacon();
    first.unmount();
    route.pathname = "/about";
    await renderBeacon();

    expect(sentBodies()).toEqual([
      { entry: { referrer: "google.com" }, locale: "ka", path: "/about" },
    ]);
    expect(vi.mocked(fetch).mock.calls[0]?.[1]?.keepalive).toBeUndefined();
  });

  it("sends a page once a day but a new source again", async () => {
    window.localStorage.setItem("reptiles:page-viewed:/", "2026-10-24");
    window.localStorage.setItem("reptiles:entry:{}", "2026-10-24");
    await renderBeacon();
    expect(sentBodies()).toEqual([]);

    vi.resetModules();
    window.history.replaceState(null, "", "/?fbclid=abc");
    await renderBeacon();
    expect(sentBodies()).toEqual([
      { entry: { clickId: "fbclid" }, locale: "ka", path: "/" },
    ]);
  });

  it("sends nothing from the site itself, for robots or unknown pages", async () => {
    setReferrer("https://reptiles.ge/gvelebi");
    window.localStorage.setItem("reptiles:page-viewed:/", "2026-10-24");
    await renderBeacon();

    vi.resetModules();
    route.pathname = "/no-such-page";
    setReferrer("");
    await renderBeacon();

    vi.resetModules();
    route.pathname = "/about";
    vi.spyOn(navigator, "webdriver", "get").mockReturnValue(true);
    await renderBeacon();

    expect(fetch).not.toHaveBeenCalled();
  });

  it("still counts when storage is blocked", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    route.params = { id: "kakheti" };
    route.pathname = "/regions/[id]";
    await renderBeacon();

    expect(sentBodies()).toEqual([
      { entry: {}, locale: "ka", path: "/regions/kakheti" },
    ]);
  });
});
