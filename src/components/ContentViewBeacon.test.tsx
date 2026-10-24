import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ContentViewBeacon } from "@/components/ContentViewBeacon";

function sentBody(call = 0) {
  const [url, init] = vi.mocked(fetch).mock.calls[call]!;
  expect(String(url)).toBe("https://api.reptiles.ge/v1/views");
  expect(init?.method).toBe("POST");
  return JSON.parse(String(init?.body)) as Record<string, unknown>;
}

describe("ContentViewBeacon", () => {
  beforeEach(() => {
    vi.useFakeTimers({
      now: new Date("2026-10-24T10:00:00Z"),
      toFake: ["Date"],
    });
    vi.spyOn(navigator, "webdriver", "get").mockReturnValue(false);
    window.localStorage.clear();
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

  it("sends one view for the page", () => {
    render(<ContentViewBeacon id="macrovipera-lebetina" kind="species" />);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(sentBody()).toEqual({ id: "macrovipera-lebetina", kind: "species" });
    expect(
      window.localStorage.getItem(
        "reptiles:viewed:species:macrovipera-lebetina",
      ),
    ).toBe("2026-10-24");
  });

  it("does not send the same page twice on one day", () => {
    render(<ContentViewBeacon id="macrovipera-lebetina" kind="species" />);
    render(<ContentViewBeacon id="macrovipera-lebetina" kind="species" />);
    render(<ContentViewBeacon id="some-news" kind="news" />);

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(sentBody(1)).toEqual({ id: "some-news", kind: "news" });
  });

  it("sends again on the next day", () => {
    window.localStorage.setItem(
      "reptiles:viewed:species:macrovipera-lebetina",
      "2026-10-23",
    );
    render(<ContentViewBeacon id="macrovipera-lebetina" kind="species" />);

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("skips automated browsers", () => {
    vi.spyOn(navigator, "webdriver", "get").mockReturnValue(true);
    render(<ContentViewBeacon id="macrovipera-lebetina" kind="species" />);

    expect(fetch).not.toHaveBeenCalled();
  });

  it("still sends when storage is blocked", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    render(<ContentViewBeacon id="macrovipera-lebetina" kind="species" />);

    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
