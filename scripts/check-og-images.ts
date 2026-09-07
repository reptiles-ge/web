import { getCatalogSpecies } from "../src/data/species";
import { speciesOgImageUrl } from "../src/lib/site";

type CheckStatus = "failed" | "not_found" | "ok";

type SpeciesOgTarget = {
  id: string;
  image: string;
  ogUrl: string;
};

type CheckResult = SpeciesOgTarget & {
  error?: string;
  status: CheckStatus;
  statusCode?: number;
};

type CliOptions = {
  concurrency: number;
  json: boolean;
  timeoutMs: number;
};

function parseArguments(argv: string[]): CliOptions {
  let concurrency = 24;
  let json = false;
  let timeoutMs = 8_000;

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    switch (argument) {
      case "--concurrency":
        index += 1;
        concurrency = Number(argv[index]);
        break;
      case "--json":
        json = true;
        break;
      case "--timeout":
        index += 1;
        timeoutMs = Number(argv[index]);
        break;
      default:
        throw new Error(`Unknown argument "${argument}".`);
    }
  }

  if (!Number.isInteger(concurrency) || concurrency < 1) {
    throw new Error("--concurrency requires a positive integer.");
  }
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1) {
    throw new Error("--timeout requires a positive integer (milliseconds).");
  }

  return { concurrency, json, timeoutMs };
}

function collectTargets(): SpeciesOgTarget[] {
  return getCatalogSpecies()
    .map((item) => ({
      id: item.id,
      image: item.image,
      ogUrl: speciesOgImageUrl(item.id, item.image),
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

async function headStatus(url: string, timeoutMs: number): Promise<number> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
    });
    return response.status;
  } finally {
    clearTimeout(timer);
  }
}

function toCheckStatus(statusCode: number): CheckStatus {
  if (statusCode === 404) return "not_found";
  if (statusCode >= 200 && statusCode < 400) return "ok";
  return "failed";
}

async function checkTarget(
  target: SpeciesOgTarget,
  timeoutMs: number,
): Promise<CheckResult> {
  try {
    const statusCode = await headStatus(target.ogUrl, timeoutMs);
    const status = toCheckStatus(statusCode);
    return {
      ...target,
      ...(status === "failed" ? { error: `HTTP ${statusCode}` } : {}),
      status,
      statusCode,
    };
  } catch (error) {
    return {
      ...target,
      error: error instanceof Error ? error.message : String(error),
      status: "failed",
    };
  }
}

async function mapPool<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;

  async function worker() {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await fn(items[index] as T);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, worker),
  );
  return results;
}

function printProgress(done: number, total: number, json: boolean) {
  if (json) return;
  process.stderr.write(`\rChecked ${done}/${total}`);
  if (done === total) process.stderr.write("\n");
}

function printMissing(item: CheckResult) {
  console.log(`  ${item.id}`);
  console.log(`    og     ${item.ogUrl}`);
  console.log(`    image  ${item.image}`);
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const targets = collectTargets();

  if (targets.length === 0) {
    throw new Error("No published species found.");
  }

  if (!options.json) {
    console.error(
      `Checking OG images for ${targets.length} published species…`,
    );
  }

  const started = Date.now();
  let done = 0;
  const results = await mapPool(targets, options.concurrency, async (target) => {
    const result = await checkTarget(target, options.timeoutMs);
    done += 1;
    printProgress(done, targets.length, options.json);
    return result;
  });
  const elapsedMs = Date.now() - started;

  const missing = results.filter((item) => item.status === "not_found");
  const failed = results.filter((item) => item.status === "failed");
  const ok = results.length - missing.length - failed.length;

  if (options.json) {
    console.log(
      JSON.stringify(
        {
          checked: results.length,
          elapsedMs,
          failed: failed.map((item) => ({
            error: item.error,
            id: item.id,
            image: item.image,
            ogUrl: item.ogUrl,
            statusCode: item.statusCode,
          })),
          missing: missing.map((item) => ({
            id: item.id,
            image: item.image,
            ogUrl: item.ogUrl,
          })),
          notFound: missing.length,
          ok,
        },
        null,
        2,
      ),
    );
  } else {
    console.log(
      `Checked: ${results.length} in ${(elapsedMs / 1000).toFixed(1)}s`,
    );
    console.log(`OK: ${ok}`);
    console.log(`404 Not Found: ${missing.length}`);
    if (failed.length > 0) {
      console.log(`Other failures: ${failed.length}`);
    }

    if (missing.length > 0) {
      console.log("\nSpecies with missing OG image:");
      for (const item of missing) printMissing(item);
    }

    if (failed.length > 0) {
      console.log("\nOther failures:");
      for (const item of failed) {
        console.log(`  ${item.id} (${item.error ?? "failed"})`);
        console.log(`    og     ${item.ogUrl}`);
      }
    }
  }

  if (missing.length > 0 || failed.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
