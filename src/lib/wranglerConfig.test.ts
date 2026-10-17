import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const BUILD_ONLY_KEYS = new Set(["build", "main", "no_bundle", "rules"]);

function readWranglerConfig(file: string): Record<string, unknown> {
  const source = readFileSync(path.join(process.cwd(), file), "utf8");
  return JSON.parse(source.replace(/,(\s*[}\]])/g, "$1"));
}

function sharedSettings(config: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(config).filter(([key]) => !BUILD_ONLY_KEYS.has(key)),
  );
}

describe("wrangler configs", () => {
  it("keeps the deploy and vinext configs in step", () => {
    expect(sharedSettings(readWranglerConfig("wrangler.jsonc"))).toEqual(
      sharedSettings(readWranglerConfig("wrangler.vinext.jsonc")),
    );
  });

  it("leaves the response-store bucket to the response-store Worker", () => {
    expect(readWranglerConfig("wrangler.jsonc")).not.toHaveProperty(
      "r2_buckets",
    );
    expect(
      readWranglerConfig("wrangler.response-store.jsonc").r2_buckets,
    ).toEqual([
      {
        binding: "CACHE_BODIES",
        bucket_name: "reptiles-response-store-cache-bodies",
      },
    ]);
  });
});
