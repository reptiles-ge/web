import { act, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AtlasMap } from "@/components/species-atlas/AtlasMap";

import ka from "../../../messages/ka.json";

vi.mock("@/components/map/GeorgiaMap", () => ({
  GeorgiaMap: ({ mapContext }: { mapContext: string }) => (
    <div data-testid="georgia-map">{mapContext}</div>
  ),
}));

let callbacks: IntersectionObserverCallback[] = [];

function intersect(isIntersecting: boolean) {
  act(() => {
    for (const callback of callbacks) {
      callback(
        [{ isIntersecting } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    }
  });
}

function renderMap() {
  render(
    <NextIntlClientProvider locale="ka" messages={ka}>
      <AtlasMap tooltipSpeciesByRegion={{}} />
    </NextIntlClientProvider>,
  );
}

beforeEach(() => {
  callbacks = [];
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        callbacks.push(callback);
      }
      disconnect() {}
      observe() {}
    },
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("AtlasMap", () => {
  it("keeps the map out of the first render and loads it near the viewport", async () => {
    renderMap();
    expect(
      screen.getByRole("heading", { name: ka.speciesAtlas.mapTitle }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("georgia-map")).toBeNull();

    intersect(false);
    expect(screen.queryByTestId("georgia-map")).toBeNull();

    intersect(true);
    expect(await screen.findByTestId("georgia-map")).toHaveTextContent("atlas");
  });

  it("keeps the placeholder when the browser has no IntersectionObserver", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    renderMap();
    expect(screen.queryByTestId("georgia-map")).toBeNull();
  });
});
