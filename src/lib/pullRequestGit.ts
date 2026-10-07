type PullRequestInput = {
  base: string;
  body: string;
  branch: string;
  repository: string;
  title: string;
  worktree: string;
};

type RunCommand = (
  command: string,
  args: string[],
  cwd?: string,
) => Promise<string>;

export async function createOrFindPullRequest(
  run: RunCommand,
  { base, body, branch, repository, title, worktree }: PullRequestInput,
) {
  try {
    return await run(
      "gh",
      [
        "pr",
        "create",
        "--repo",
        repository,
        "--base",
        base,
        "--head",
        branch,
        "--title",
        title,
        "--body-file",
        body,
      ],
      worktree,
    );
  } catch (error) {
    return run(
      "gh",
      [
        "pr",
        "view",
        branch,
        "--repo",
        repository,
        "--json",
        "url",
        "--jq",
        ".url",
      ],
      worktree,
    ).catch(() => {
      throw error;
    });
  }
}

export function isPullRequestUrl(url: string) {
  return /^https:\/\/github\.com\/[^\s]+\/pull\/\d+$/.test(url);
}
