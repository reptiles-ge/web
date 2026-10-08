import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  currentPageContext,
  pushPageContext,
  trackEvent,
  trackSpeciesClick,
  truncateSearchTerm,
} from "@/lib/analytics";

type Layer = Array<Record<string, unknown>>;

function dataLayer() {
  return (window as unknown as { dataLayer: Layer }).dataLayer;
}

beforeEach(() => {
  vi.stubGlobal("window", { dataLayer: [] });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("truncateSearchTerm", () => {
  it("trims and caps at 100 characters", () => {
    expect(truncateSearchTerm("  viper  ")).toBe("viper");
    expect(truncateSearchTerm("a".repeat(150))).toHaveLength(100);
  });
});

describe("trackEvent", () => {
  it("pushes the event with a language and drops undefined params", () => {
    trackEvent("faq_open", { faq_index: 2, skipped: undefined });
    expect(dataLayer()).toEqual([
      { event: "faq_open", faq_index: 2, language: "ka" },
    ]);
  });

  it("creates the data layer when it does not exist yet", () => {
    vi.stubGlobal("window", {});
    trackEvent("x");
    expect(dataLayer()).toHaveLength(1);
  });

  it("does nothing without a window", () => {
    vi.unstubAllGlobals();
    expect(() => trackEvent("x")).not.toThrow();
  });
});

describe("trackSpeciesClick", () => {
  it("uses the explicit group when given", () => {
    trackSpeciesClick({
      group: "snake",
      position: 3,
      source: "atlas",
      species_id: "natrix-natrix",
    });
    expect(dataLayer()[0]).toMatchObject({
      event: "species_click",
      group: "snake",
      position: 3,
      source: "atlas",
      species_id: "natrix-natrix",
    });
  });

  it("looks the group up from the atlas when omitted", () => {
    trackSpeciesClick({ source: "atlas", species_id: "testudo-graeca" });
    expect(dataLayer()[0]).toMatchObject({ group: "turtle" });
  });
});

describe("page context", () => {
  it("pushes a page_context event", () => {
    pushPageContext({
      entity_id: "x",
      language: "en",
      page_type: "species",
    });
    expect(dataLayer()[0]).toEqual({
      entity_id: "x",
      event: "page_context",
      language: "en",
      page_type: "species",
    });
  });

  it("reads back the latest page_context entry", () => {
    pushPageContext({ language: "en", page_type: "home" });
    trackEvent("other_event");
    pushPageContext({ entity_id: "q", language: "en", page_type: "quiz" });
    trackEvent("another_event");
    expect(currentPageContext()).toEqual({
      entity_id: "q",
      page_type: "quiz",
    });
  });

  it("falls back to other when there is no context", () => {
    expect(currentPageContext()).toEqual({ page_type: "other" });
  });

  it("falls back to other when the entry has no page_type", () => {
    dataLayer().push({ event: "page_context" });
    expect(currentPageContext()).toEqual({
      entity_id: undefined,
      page_type: "other",
    });
  });
});
