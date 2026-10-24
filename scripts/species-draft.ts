import fs from "node:fs";
import path from "node:path";

import { speciesRecordSchema } from "../src/api/schemas/speciesRecord";
import {
  listAdminSpeciesDrafts,
  proposeAdminSpeciesDraft,
  readAdminSpecies,
} from "../src/lib/adminSpeciesApi";
import { apiOrigin } from "../src/lib/apiClient";
import { toSiteDateTime } from "../src/lib/siteTime";
import { diffSpeciesRecords } from "../src/lib/speciesDraftDiff";
import { loadEnv } from "./scriptUtils";

const USAGE = `Usage:
  pnpm species:draft pull <id> [<id> ...]
  pnpm species:draft push <id> --summary "<what changed>" [--dry-run]`;

const DRAFT_DIR = path.join(process.cwd(), ".drafts");

const PRODUCTION_API = "https://api.reptiles.ge";

const PRODUCTION_ADMIN = "https://admin.reptiles.ge";

const LOCAL_ADMIN = "http://localhost:3002";

const PREVIEW_LENGTH = 160;

const PREVIEW_LEAD = 40;

const PROTECTED = [
  /^(status|group|catalogPosition|slugKa)$/,
  /^slugs(\.|$)/,
  /^base\.(id|image|mobileImage|publishedAt)$/,
  /^base\.gallery\.\d+\.src$/,
];

type DraftFile = {
  baseVersion: number;
  record: unknown;
};

const [command, ...rest] = process.argv.slice(2);
const ids = rest.filter((arg, index) => {
  const previous = rest[index - 1];
  return !arg.startsWith("--") && previous !== "--summary";
});

loadEnv();

try {
  if (command === "pull" && ids.length > 0) {
    for (const id of ids) await pull(id);
  } else if (command === "push" && ids.length === 1) {
    await push(ids[0]!, {
      dryRun: rest.includes("--dry-run"),
      summary: option("--summary"),
    });
  } else {
    fail(USAGE);
  }
} catch (error) {
  fail((error as Error).message);
}

function draftPath(id: string) {
  return path.join(DRAFT_DIR, `${id}.json`);
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function option(name: string) {
  const index = rest.indexOf(name);
  if (index < 0) return undefined;
  const value = rest[index + 1];
  if (!value || value.startsWith("--")) fail(`${name} needs a value.`);
  return value.trim();
}

function firstDifference(a: string, b: string) {
  let index = 0;
  while (index < a.length && a[index] === b[index]) index += 1;
  return index;
}

function preview(value: string, from: number) {
  if (!value) return "—";
  const start = Math.max(0, from - PREVIEW_LEAD);
  const end = start + PREVIEW_LENGTH;
  return `${start > 0 ? "…" : ""}${value.slice(start, end).replace(/\s+/g, " ")}${end < value.length ? "…" : ""}`;
}

async function pull(id: string) {
  const { record, version } = await readAdminSpecies(id);
  fs.mkdirSync(DRAFT_DIR, { recursive: true });
  const file: DraftFile = { baseVersion: version, record };
  fs.writeFileSync(draftPath(id), `${JSON.stringify(file, null, 2)}\n`);
  console.log(
    `${id}: version ${version} saved to ${path.relative(process.cwd(), draftPath(id))} (${apiOrigin()}).`,
  );
}

async function push(
  id: string,
  { dryRun, summary }: { dryRun: boolean; summary?: string },
) {
  if (!summary) fail(`--summary is required.\n${USAGE}`);
  if (summary.length > 500) fail("--summary must be at most 500 characters.");
  if (!fs.existsSync(draftPath(id))) {
    fail(
      `${id}: no ${draftPath(id)}. Run pnpm species:draft pull ${id} first.`,
    );
  }
  const file = JSON.parse(fs.readFileSync(draftPath(id), "utf8")) as DraftFile;
  const live = await readAdminSpecies(id);
  if (live.version !== file.baseVersion) {
    fail(
      `${id}: the species is at version ${live.version}, the file was pulled at ${file.baseVersion}. Pull again and redo the change.`,
    );
  }
  const changes = diffSpeciesRecords(live.record, file.record).filter(
    (change) => change.path !== "base.updatedAt",
  );
  if (changes.length === 0) fail(`${id}: nothing changed.`);
  const locked = changes.filter((change) =>
    PROTECTED.some((pattern) => pattern.test(change.path)),
  );
  if (locked.length > 0) {
    fail(
      `${id}: these fields are not changed through AI drafts:\n${locked.map((change) => `  ${change.path}`).join("\n")}`,
    );
  }
  const checked = speciesRecordSchema.safeParse(file.record);
  if (!checked.success) {
    fail(
      `${id}: the record breaks a content rule:\n${checked.error.issues
        .map((issue) => `  ${issue.path.join(".")}: ${issue.message}`)
        .join("\n")}`,
    );
  }
  const record = checked.data;
  if (record.base.id !== id) fail(`${id}: base.id is ${record.base.id}.`);
  record.base.updatedAt = toSiteDateTime(new Date());

  console.log(`${id}: ${changes.length} changed fields`);
  for (const change of changes) {
    console.log(`  ${change.path}`);
    const from = firstDifference(change.before, change.after);
    console.log(`    - ${preview(change.before, from)}`);
    console.log(`    + ${preview(change.after, from)}`);
  }
  const pending = await listAdminSpeciesDrafts(id);
  if (pending.length > 0) {
    console.log(
      `${id}: ${pending.length} pending draft(s) already exist (${pending.map((draft) => `#${draft.id}`).join(", ")}). Merging one makes the others stale.`,
    );
  }
  if (dryRun) {
    console.log(`${id}: valid, not sent (--dry-run).`);
    return;
  }
  const { draftId } = await proposeAdminSpeciesDraft(id, {
    baseVersion: file.baseVersion,
    record: record as typeof live.record,
    summary,
  });
  fs.rmSync(draftPath(id));
  console.log(
    `${id}: draft #${draftId} created. Review: ${apiOrigin() === PRODUCTION_API ? PRODUCTION_ADMIN : LOCAL_ADMIN}/drafts/${draftId}`,
  );
}
