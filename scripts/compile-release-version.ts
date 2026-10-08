import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import { isReleaseTag, latestReleaseTag } from "../src/lib/releaseTag";

const outFile = path.join(
  process.cwd(),
  "src/data/releaseVersion.generated.ts",
);

function git(args: string[]): null | string {
  try {
    return execFileSync("git", args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      timeout: 15_000,
    }).trim();
  } catch {
    return null;
  }
}

function fromEnv(): null | string {
  const value = process.env.RELEASE_VERSION?.trim();
  return value && isReleaseTag(value) ? value : null;
}

function fromHistory(): null | string {
  const tag = git(["describe", "--tags", "--abbrev=0", "--match", "v[0-9]*"]);
  return tag && isReleaseTag(tag) ? tag : null;
}

function fromRemote(): null | string {
  const output = git(["ls-remote", "--tags", "--refs", "origin", "v*"]);
  if (!output) return null;

  return latestReleaseTag(
    output.split("\n").map((line) => line.replace(/^.*refs\/tags\//, "")),
  );
}

const releaseVersion = fromEnv() ?? fromHistory() ?? fromRemote();
const source = `export const releaseVersion: null | string = ${JSON.stringify(releaseVersion)};
`;

fs.writeFileSync(outFile, source, "utf8");
console.log(
  `Compiled release version (${releaseVersion ?? "none"}) → ${outFile}`,
);
