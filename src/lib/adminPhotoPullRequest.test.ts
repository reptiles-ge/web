import { beforeEach, describe, expect, it, vi } from "vitest";

const execFileSync = vi.hoisted(() => vi.fn());

vi.mock("node:child_process", () => ({ execFileSync }));
vi.mock("@/lib/adminGalleryMdx", async (importOriginal) => {
  const original =
    await importOriginal<typeof import("@/lib/adminGalleryMdx")>();
  return { ...original, appendGalleryItemToSpecies: vi.fn() };
});

import { openPhotoPullRequest } from "@/lib/adminPhotoPullRequest";

describe("photo PRs for a species on the current feature branch", () => {
  beforeEach(() => {
    execFileSync.mockReset();
    execFileSync.mockImplementation((command: string, args: string[]) => {
      if (command === "gh") throw new Error("gh unavailable");
      if (args[0] === "branch") return "feature/bed-bug-atlas\n";
      if (args[0] === "ls-tree") return "";
      if (args[0] === "status") return "";
      if (args[0] === "diff") throw new Error("staged changes");
      if (args[0] === "remote")
        return "https://github.com/reptiles-ge/web.git\n";
      return "";
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: async () => [
          { html_url: "https://github.com/reptiles-ge/web/pull/483" },
        ],
        ok: true,
      }),
    );
  });

  it("pushes the current branch and returns its existing PR", async () => {
    const url = await openPhotoPullRequest({
      id: "cimex-lectularius",
      items: [{ ka: { src: "https://cdn.reptiles.ge/test.jpg" } }],
    });

    expect(url).toBe("https://github.com/reptiles-ge/web/pull/483");
    expect(execFileSync).toHaveBeenCalledWith(
      "git",
      ["push", "-u", "origin", "HEAD:refs/heads/feature/bed-bug-atlas"],
      expect.any(Object),
    );
    expect(
      execFileSync.mock.calls.some(([, args]) => args[0] === "worktree"),
    ).toBe(false);
  });
});
