import { spawn } from "node:child_process";

type CodexProcessInput = {
  args: string[];
  cwd: string;
  prompt: string;
  timeoutMs: number;
};

export function runCodexProcess({
  args,
  cwd,
  prompt,
  timeoutMs,
}: CodexProcessInput) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn("codex", [...args, "--cd", cwd, "-"], {
      cwd,
      env: {
        CODEX_HOME: process.env.CODEX_HOME,
        HOME: process.env.HOME,
        LANG: process.env.LANG,
        NODE_ENV: process.env.NODE_ENV,
        PATH: process.env.PATH,
        TMPDIR: process.env.TMPDIR,
      },
      signal: AbortSignal.timeout(timeoutMs),
      stdio: ["pipe", "ignore", "pipe"],
    });
    let errorText = "";
    child.stderr.setEncoding("utf8");
    child.stderr.on("data", (chunk: string) => {
      errorText = (errorText + chunk).slice(-4000);
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else
        reject(
          new Error(`Codex exited with ${code}: ${errorText.slice(-500)}`),
        );
    });
    child.stdin.end(prompt);
  });
}
