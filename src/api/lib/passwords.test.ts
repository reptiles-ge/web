import { describe, expect, it } from "vitest";

import { dummyPasswordHash, hashPassword, verifyPassword } from "./passwords";

describe("passwords", () => {
  it("salts every hash", async () => {
    const [first, second] = await Promise.all([
      hashPassword("same password"),
      hashPassword("same password"),
    ]);
    expect(first).not.toBe(second);
    expect(await verifyPassword("same password", first)).toBe(true);
    expect(await verifyPassword("same password", second)).toBe(true);
  });

  it.each([
    "",
    "plain-text",
    "bcrypt$10$salt$hash",
    "pbkdf2-sha256$1000$c2FsdA$aGFzaA",
    "pbkdf2-sha256$100000$$aGFzaA",
  ])("rejects a malformed stored hash %j", async (stored) => {
    expect(await verifyPassword("anything", stored)).toBe(false);
  });

  it("keeps one dummy hash that matches no real password", async () => {
    const dummy = await dummyPasswordHash();
    expect(await dummyPasswordHash()).toBe(dummy);
    expect(await verifyPassword("", dummy)).toBe(false);
  });
});
