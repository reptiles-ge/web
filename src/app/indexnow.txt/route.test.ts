import { describe, expect, it } from "vitest";

import { INDEXNOW_KEY } from "@/lib/indexNow";

import { GET } from "./route";

describe("GET /indexnow.txt", () => {
  it("serves a valid IndexNow key as plain text", async () => {
    const response = GET();
    expect(INDEXNOW_KEY).toMatch(/^[a-zA-Z0-9-]{8,128}$/);
    expect(response.headers.get("content-type")).toContain("text/plain");
    expect(await response.text()).toBe(INDEXNOW_KEY);
  });
});
