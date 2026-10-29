import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const GTM_SRC = "https://www.googletagmanager.com/gtm.js?id=GTM-TEST";

let idleCallbacks: { callback: () => void; timeout?: number }[] = [];

type HappyDomWindow = Window & {
  happyDOM: { settings: { handleDisabledFileLoadingAsSuccess: boolean } };
};

function gtmScripts() {
  return [...document.querySelectorAll<HTMLScriptElement>("script")].filter(
    (script) => script.src === GTM_SRC,
  );
}

async function renderTag() {
  const { GoogleTagManager } = await import("@/components/GoogleTagManager");
  return render(<GoogleTagManager gtmId="GTM-TEST" />);
}

function runIdleCallbacks() {
  for (const { callback } of idleCallbacks.splice(0)) callback();
}

function setReadyState(state: DocumentReadyState) {
  Object.defineProperty(document, "readyState", {
    configurable: true,
    get: () => state,
  });
}

beforeEach(() => {
  (
    window as unknown as HappyDomWindow
  ).happyDOM.settings.handleDisabledFileLoadingAsSuccess = true;
  vi.resetModules();
  delete window.dataLayer;
  idleCallbacks = [];
  vi.stubGlobal(
    "requestIdleCallback",
    (callback: () => void, options?: { timeout?: number }) => {
      idleCallbacks.push({ callback, timeout: options?.timeout });
      return idleCallbacks.length;
    },
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  for (const script of gtmScripts()) script.remove();
  Reflect.deleteProperty(document, "readyState");
});

describe("GoogleTagManager", () => {
  it("waits for the load event and a first interaction, then injects gtm.js on idle", async () => {
    setReadyState("loading");
    window.dataLayer = [{ event: "page_context", page_type: "guide" }];

    await renderTag();
    window.dataLayer.push({ event: "search", search_term: "giurza" });

    window.dispatchEvent(new Event("pointerdown"));
    expect(gtmScripts()).toHaveLength(0);
    expect(idleCallbacks).toHaveLength(0);

    setReadyState("complete");
    window.dispatchEvent(new Event("load"));
    expect(idleCallbacks).toHaveLength(0);

    window.dispatchEvent(new Event("scroll"));

    expect(idleCallbacks).toHaveLength(1);
    expect(idleCallbacks[0].timeout).toBe(2000);
    expect(gtmScripts()).toHaveLength(0);

    runIdleCallbacks();

    const [script] = gtmScripts();
    expect(script).toBeDefined();
    expect(script.async).toBe(true);
    expect(window.dataLayer.map((entry) => entry.event)).toEqual([
      "page_context",
      "gtm.js",
      "search",
    ]);
    expect(window.dataLayer[1]["gtm.start"]).toEqual(expect.any(Number));
  });

  it("injects after the fallback delay when nobody interacts", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    setReadyState("complete");

    await renderTag();
    vi.advanceTimersByTime(4999);
    expect(idleCallbacks).toHaveLength(0);
    vi.advanceTimersByTime(1);
    expect(idleCallbacks).toHaveLength(1);
    runIdleCallbacks();
    expect(gtmScripts()).toHaveLength(1);
    vi.useRealTimers();
  });

  it("schedules only once when an interaction and the fallback both fire", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    setReadyState("complete");

    await renderTag();
    window.dispatchEvent(new Event("keydown"));
    window.dispatchEvent(new Event("touchstart"));
    vi.advanceTimersByTime(10_000);

    expect(idleCallbacks).toHaveLength(1);
    vi.useRealTimers();
  });

  it("falls back to a timeout without requestIdleCallback", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("requestIdleCallback", undefined);
    setReadyState("complete");

    await renderTag();
    window.dispatchEvent(new Event("pointerdown"));
    expect(gtmScripts()).toHaveLength(0);
    vi.runAllTimers();
    expect(gtmScripts()).toHaveLength(1);
    vi.useRealTimers();
  });

  it("loads the container and pushes gtm.js only once per page", async () => {
    setReadyState("complete");

    const { rerender } = await renderTag();
    const { GoogleTagManager } = await import("@/components/GoogleTagManager");
    rerender(<GoogleTagManager gtmId="GTM-TEST" />);
    render(<GoogleTagManager gtmId="GTM-TEST" />);
    window.dispatchEvent(new Event("pointerdown"));
    runIdleCallbacks();

    expect(gtmScripts()).toHaveLength(1);
    expect(
      window.dataLayer?.filter((entry) => entry.event === "gtm.js"),
    ).toHaveLength(1);
  });

  it("renders nothing", async () => {
    setReadyState("loading");
    const { container } = await renderTag();
    expect(container).toBeEmptyDOMElement();
  });
});
