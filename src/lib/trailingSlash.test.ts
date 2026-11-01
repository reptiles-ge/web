import { describe, expect, it } from "vitest";

import { trailingSlashResponse } from "@/lib/trailingSlash";

function redirect(url: string) {
  const response = trailingSlashResponse(new Request(url));
  return response
    ? { location: response.headers.get("location"), status: response.status }
    : null;
}

describe("trailingSlashResponse", () => {
  it.each([
    ["https://reptiles.ge/api/search/ka/", "/api/search/ka"],
    ["https://reptiles.ge/robots.txt/", "/robots.txt"],
    ["https://reptiles.ge/admin//?a=1", "/admin?a=1"],
  ])("308s %s that the proxy never sees", (url, location) => {
    expect(redirect(url)).toEqual({ location, status: 308 });
  });

  it.each([
    "https://reptiles.ge/",
    "https://reptiles.ge/api/search/ka",
    "https://reptiles.ge/gvelebi/",
    "https://reptiles.ge/ka/",
    "https://www.reptiles.ge/api/search/",
  ])("leaves %s to the proxy or the app", (url) => {
    expect(redirect(url)).toBeNull();
  });
});
