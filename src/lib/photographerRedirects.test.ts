import { describe, expect, it } from "vitest";

import { legacyPhotographerRedirectPath } from "@/lib/photographerRedirects";

describe("legacyPhotographerRedirectPath", () => {
  it.each([
    ["/authors/jane", "/kontributorebi/jane"],
    ["/avtorebi/jane", "/kontributorebi/jane"],
    ["/photographers/jane", "/kontributorebi/jane"],
    ["/fotografebi/jane", "/kontributorebi/jane"],
    ["/contributors/jane", "/kontributorebi/jane"],
    ["/en/authors/jane", "/en/contributors/jane"],
    ["/ru/kontributorebi/jane", "/ru/contributors/jane"],
    ["/tr/photographers/jane", "/tr/contributors/jane"],
    ["/authors", "/kontributorebi"],
    ["/contributors", "/kontributorebi"],
    ["/en/avtorebi", "/en/contributors"],
    ["/tr/kontributorebi", "/tr/contributors"],
  ])("maps %s to %s", (from, to) => {
    expect(legacyPhotographerRedirectPath(from)).toBe(to);
  });

  it.each([
    "/",
    "/kontributorebi",
    "/kontributorebi/jane",
    "/en/contributors",
    "/en/contributors/jane",
    "/de/authors/jane",
    "/authors/jane/extra",
    "/gvelebi/jane",
  ])("leaves %s alone", (path) => {
    expect(legacyPhotographerRedirectPath(path)).toBeNull();
  });
});
