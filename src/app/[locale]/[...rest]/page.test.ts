import { notFound, permanentRedirect } from "next/navigation";
import { afterEach, describe, expect, it, vi } from "vitest";

import { liveSpeciesRedirectPath } from "@/lib/liveSpeciesRedirect";

import CatchAllPage from "./page";

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("notFound");
  }),
  permanentRedirect: vi.fn(() => {
    throw new Error("permanentRedirect");
  }),
}));
vi.mock("@/lib/liveSpeciesRedirect", () => ({
  liveSpeciesRedirectPath: vi.fn(),
}));

function render(locale: string, rest: string[]) {
  return CatchAllPage({ params: Promise.resolve({ locale, rest }) });
}

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

describe("catch-all page", () => {
  it("redirects to a species the live catalog knows", async () => {
    vi.mocked(liveSpeciesRedirectPath).mockResolvedValueOnce(
      "/prinvelebi/akhali-chiti",
    );
    await expect(render("ka", ["species", "new-bird"])).rejects.toThrow(
      "permanentRedirect",
    );
    expect(permanentRedirect).toHaveBeenCalledWith("/prinvelebi/akhali-chiti");
    expect(notFound).not.toHaveBeenCalled();
  });

  it("answers 404 otherwise, and for an unknown locale without asking", async () => {
    vi.mocked(liveSpeciesRedirectPath).mockResolvedValueOnce(null);
    await expect(render("ka", ["nothing"])).rejects.toThrow("notFound");
    await expect(render("xx", ["species", "new-bird"])).rejects.toThrow(
      "notFound",
    );
    expect(liveSpeciesRedirectPath).toHaveBeenCalledTimes(1);
    expect(permanentRedirect).not.toHaveBeenCalled();
  });

  it("answers 404 when the live lookup fails", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(liveSpeciesRedirectPath).mockRejectedValueOnce(
      new Error("API down"),
    );
    await expect(render("ka", ["species", "new-bird"])).rejects.toThrow(
      "notFound",
    );
    expect(error).toHaveBeenCalledWith(
      "Live species redirect failed",
      expect.any(Error),
    );
  });
});
