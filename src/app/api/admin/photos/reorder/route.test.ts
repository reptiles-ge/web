import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/adminAccess", () => ({
  isLocalAdminEnabled: () => true,
  localAdminForbiddenResponse: () => new Response(null, { status: 403 }),
}));
vi.mock("@/lib/adminGalleryMdx", () => ({
  isSpeciesContentId: () => true,
  readAdminSpeciesGallery: () => ({
    gallery: [{ src: "first.jpg" }, { src: "second.jpg" }],
  }),
}));
vi.mock("@/lib/adminPhotoPullRequest", () => ({
  openGalleryReorderPullRequest: () =>
    Promise.reject(new Error("No gallery changes to open a pull request for")),
}));

import { POST } from "@/app/api/admin/photos/reorder/route";

describe("photo reorder route", () => {
  it("acknowledges an order that was already saved", async () => {
    const response = await POST(
      new Request("http://localhost/api/admin/photos/reorder", {
        body: JSON.stringify({
          id: "alectoris-chukar",
          srcs: ["first.jpg", "second.jpg"],
        }),
        method: "POST",
      }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ alreadySaved: true });
  });
});
