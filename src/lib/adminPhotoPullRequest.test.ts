import { rmSync } from "node:fs";
import { beforeEach, describe, expect, it, vi } from "vitest";

const execFileSync = vi.hoisted(() => vi.fn());

vi.mock("node:child_process", () => ({ execFileSync }));
vi.mock("@/lib/adminGalleryMdx", async (importOriginal) => {
  const original =
    await importOriginal<typeof import("@/lib/adminGalleryMdx")>();
  return {
    ...original,
    appendGalleryItemToSpecies: vi.fn(),
    reorderGalleryInSpecies: vi.fn(),
  };
});
vi.mock("@/lib/imageOptimize", () => ({ applyOptimizeCatalog: vi.fn() }));

import type { OptimizeCatalogUpdate } from "@/lib/imageOptimize";

import {
  openGalleryReorderPullRequest,
  openPhotoPullRequest,
  openStandalonePhotoPullRequest,
} from "@/lib/adminPhotoPullRequest";

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

  it("opens a photo PR when staging has no open PR", async () => {
    execFileSync.mockImplementation((command: string, args: string[]) => {
      if (command === "gh" && args[0] === "pr" && args[1] === "list") {
        return "[]";
      }
      if (command === "gh" && args[0] === "repo") {
        return '{"nameWithOwner":"reptiles-ge/web"}';
      }
      if (command === "gh" && args[0] === "pr" && args[1] === "create") {
        return "https://github.com/reptiles-ge/web/pull/999";
      }
      if (args[0] === "branch" && args[1] === "--show-current") {
        return "staging\n";
      }
      if (args[0] === "ls-tree" || args[0] === "status") return "";
      if (args[0] === "diff") throw new Error("staged changes");
      if (args[0] === "remote") {
        return "https://github.com/reptiles-ge/web.git\n";
      }
      if (args[0] === "worktree" && args[1] === "remove") {
        rmSync(args.at(-1) as string, { force: true, recursive: true });
      }
      return "";
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ json: async () => [], ok: true }),
    );

    const url = await openGalleryReorderPullRequest({
      id: "alectoris-chukar",
      orderedSrcs: ["first.jpg", "second.jpg"],
    });

    expect(url).toBe("https://github.com/reptiles-ge/web/pull/999");
    expect(
      execFileSync.mock.calls.some(
        ([command, args, options]) =>
          command === "git" &&
          args[0] === "commit" &&
          options.cwd === process.cwd(),
      ),
    ).toBe(false);
    expect(
      execFileSync.mock.calls.some(
        ([command, args]) =>
          command === "gh" &&
          args[0] === "pr" &&
          args[1] === "create" &&
          args[args.indexOf("--base") + 1] === "staging",
      ),
    ).toBe(true);
  });

  it("creates a standalone photo branch from the current branch", async () => {
    execFileSync.mockImplementation((command: string, args: string[]) => {
      if (command === "gh" && args[0] === "pr" && args[1] === "list") {
        return "[]";
      }
      if (command === "gh" && args[0] === "repo") {
        return '{"nameWithOwner":"reptiles-ge/web"}';
      }
      if (command === "gh" && args[0] === "pr" && args[1] === "create") {
        return "https://github.com/reptiles-ge/web/pull/999";
      }
      if (args[0] === "branch" && args[1] === "--show-current") {
        return "feature/bed-bug-atlas\n";
      }
      if (args[0] === "diff") throw new Error("staged changes");
      if (args[0] === "remote") {
        return "https://github.com/reptiles-ge/web.git\n";
      }
      if (args[0] === "worktree" && args[1] === "remove") {
        rmSync(args.at(-1) as string, { force: true, recursive: true });
      }
      return "";
    });

    const catalog = [{ key: "external/photo.jpg" }] as OptimizeCatalogUpdate[];
    const url = await openStandalonePhotoPullRequest(catalog);

    expect(url).toBe("https://github.com/reptiles-ge/web/pull/999");
    expect(execFileSync).toHaveBeenCalledWith(
      "git",
      ["push", "-u", "origin", "HEAD:refs/heads/feature/bed-bug-atlas"],
      expect.any(Object),
    );
    expect(
      execFileSync.mock.calls.some(
        ([command, args]) =>
          command === "git" &&
          args[0] === "worktree" &&
          args[1] === "add" &&
          args.at(-1) === "HEAD",
      ),
    ).toBe(true);
    expect(
      execFileSync.mock.calls.some(
        ([command, args]) =>
          command === "gh" &&
          args[0] === "pr" &&
          args[1] === "create" &&
          args[args.indexOf("--base") + 1] === "feature/bed-bug-atlas",
      ),
    ).toBe(true);
  });
});
