import { type ChildProcess, spawn } from "node:child_process";
import net from "node:net";

const graphPath = ".seo/graph.json";

function freePort() {
  return new Promise<number>((resolve, reject) => {
    const server = net.createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close(() => reject(new Error("Could not allocate a port")));
        return;
      }
      const port = address.port;
      server.close(() => resolve(port));
    });
  });
}

async function main() {
  const providedBaseUrl = process.env.SEO_DOCTOR_BASE_URL;
  if (providedBaseUrl) {
    process.exit(await runDoctor(providedBaseUrl));
  }

  const port = Number(process.env.SEO_DOCTOR_PORT) || (await freePort());
  const baseUrl = `http://127.0.0.1:${port}`;
  const server = spawn(
    "pnpm",
    ["exec", "next", "start", "-p", String(port), "-H", "127.0.0.1"],
    {
      env: {
        ...process.env,
        NEXT_PUBLIC_SITE_URL: "https://reptiles.ge",
        NODE_ENV: "production",
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  pipeServer(server);

  try {
    await waitForReady(baseUrl);
    process.exitCode = await runDoctor(baseUrl);
  } finally {
    await stop(server);
  }
}

function pipeServer(server: ChildProcess) {
  server.stdout?.on("data", (chunk) => {
    const text = String(chunk);
    if (/ready|started|error|failed/i.test(text)) process.stdout.write(text);
  });
  server.stderr?.on("data", (chunk) => process.stderr.write(chunk));
}

function runDoctor(baseUrl: string) {
  return new Promise<number>((resolve) => {
    const child = spawn(
      "cargo",
      [
        "run",
        "--manifest-path",
        "tools/seo-doctor/Cargo.toml",
        "--quiet",
        "--",
        "--base-url",
        baseUrl,
        graphPath,
      ],
      {
        env: {
          ...process.env,
          PATH: `${process.env.HOME}/.cargo/bin:${process.env.PATH ?? ""}`,
        },
        stdio: "inherit",
      },
    );
    child.on("exit", (code) => resolve(code ?? 1));
  });
}

function stop(server: ChildProcess) {
  return new Promise<void>((resolve) => {
    if (server.exitCode != null || server.killed) {
      resolve();
      return;
    }
    server.once("exit", () => resolve());
    server.kill("SIGTERM");
    setTimeout(() => {
      if (!server.killed) server.kill("SIGKILL");
      resolve();
    }, 3_000).unref();
  });
}

async function waitForReady(baseUrl: string) {
  const deadline = Date.now() + 45_000;
  let lastError: unknown;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseUrl, { redirect: "manual" });
      if (response.status < 500) return;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Next server did not become ready: ${String(lastError)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
