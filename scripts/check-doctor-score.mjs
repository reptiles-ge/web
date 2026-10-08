import { spawnSync } from "node:child_process";

const REQUIRED_SCORE = 100;

const result = spawnSync(
  "react-doctor",
  ["-y", "--scope", "full", "--score", "--no-color"],
  { encoding: "utf8", shell: process.platform === "win32" },
);

if (result.error) {
  console.error(`React Doctor failed to start: ${result.error.message}`);
  process.exit(1);
}

const lines = `${result.stdout ?? ""}`
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean);
const last = lines.at(-1) ?? "";
const score = /^\d+$/.test(last) ? Number(last) : Number.NaN;

if (result.status !== 0 || Number.isNaN(score)) {
  console.error("React Doctor did not report a score.");
  if (result.stdout) console.error(result.stdout.trim());
  if (result.stderr) console.error(result.stderr.trim());
  process.exit(1);
}

if (score !== REQUIRED_SCORE) {
  console.error(
    `React Doctor score is ${score}, required ${REQUIRED_SCORE}. Run "npm run doctor" for the diagnostics.`,
  );
  process.exit(1);
}

console.log(`React Doctor score: ${score}`);
