import { describe, expect, it } from "vitest";

import { adminCoverRoles, resolveAdminCovers } from "@/lib/adminCover";

describe("resolveAdminCovers", () => {
  it("treats a missing mobile image as the same cover", () => {
    const covers = resolveAdminCovers("https://cdn.reptiles.ge/a.jpg", "");
    expect(covers.split).toBe(false);
    expect(covers.mobileSrc).toBe(covers.desktopSrc);
    expect(adminCoverRoles("https://cdn.reptiles.ge/a.jpg", covers)).toEqual([
      "cover",
    ]);
  });

  it("labels desktop and mobile when the files differ", () => {
    const covers = resolveAdminCovers(
      "https://cdn.reptiles.ge/desktop.jpg",
      "https://cdn.reptiles.ge/mobile.jpg",
    );
    expect(covers.split).toBe(true);
    expect(
      adminCoverRoles("https://cdn.reptiles.ge/desktop.jpg", covers),
    ).toEqual(["desktop"]);
    expect(
      adminCoverRoles("https://cdn.reptiles.ge/mobile.jpg", covers),
    ).toEqual(["mobile"]);
    expect(
      adminCoverRoles("https://cdn.reptiles.ge/other.jpg", covers),
    ).toEqual([]);
  });
});
