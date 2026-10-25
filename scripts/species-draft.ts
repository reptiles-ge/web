import fs from "node:fs";
import path from "node:path";

import { speciesRecordSchema } from "../src/api/schemas/speciesRecord";
import {
  listAdminSpeciesDrafts,
  proposeAdminSpeciesDraft,
  readAdminSpecies,
} from "../src/lib/adminSpeciesApi";
import { apiOrigin } from "../src/lib/apiClient";
import { getOccurrenceSummary } from "../src/lib/occurrenceSummaries";
import { addedPageTalk } from "../src/lib/pageTalkProse";
import { toSiteDateTime } from "../src/lib/siteTime";
import { diffSpeciesRecords } from "../src/lib/speciesDraftDiff";
import { loadEnv } from "./scriptUtils";

const USAGE = `Usage:
  pnpm species:draft pull <id> [<id> ...]
  pnpm species:draft push <id> --summary "<what changed>" [--dry-run]
  pnpm species:draft regions <id>`;

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

type LiveRecord = Awaited<ReturnType<typeof readAdminSpecies>>["record"];

const [command, ...rest] = process.argv.slice(2);
const ids = rest.filter((arg, index) => {
  const previous = rest[index - 1];
  return !arg.startsWith("--") && previous !== "--summary";
});

loadEnv();

try {
  if (command === "pull" && ids.length > 0) {
    for (const id of ids) await pull(id);
  } else if (command === "regions" && ids.length === 1) {
    await regions(ids[0]!);
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

function fieldRecordKey(record: LiveRecord["fieldRecords"][number]) {
  return record.url ?? `${record.locality}|${record.lat}|${record.lng}`;
}

function firstDifference(a: string, b: string) {
  let index = 0;
  while (index < a.length && a[index] === b[index]) index += 1;
  return index;
}

function isRangeChange(change: { path: string }) {
  return change.path.startsWith("rangeMap");
}

function option(name: string) {
  const index = rest.indexOf(name);
  if (index < 0) return undefined;
  const value = rest[index + 1];
  if (!value || value.startsWith("--")) fail(`${name} needs a value.`);
  return value.trim();
}

function preview(value: string, from: number) {
  if (!value) return "—";
  const start = Math.max(0, from - PREVIEW_LEAD);
  const end = start + PREVIEW_LENGTH;
  return `${start > 0 ? "…" : ""}${value.slice(start, end).replace(/\s+/g, " ")}${end < value.length ? "…" : ""}`;
}

function printRegions(id: string, label: string, record: LiveRecord) {
  const summary = getOccurrenceSummary({
    confirmedThreshold: record.rangeMap?.confirmedThreshold,
    fieldRecords: record.fieldRecords,
    gallery: record.base.gallery,
    locale: "en",
    speciesName: record.translations.en.commonName,
  });
  console.log(
    `${id}: regions ${label} (a region counts only when confirmed; threshold ${record.rangeMap?.confirmedThreshold ?? "default"})`,
  );
  if (summary.recordsByRegion.length === 0) console.log("  no records");
  for (const region of summary.recordsByRegion) {
    console.log(`  ${region.status.padEnd(13)} ${region.count}  ${region.id}`);
  }
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
  const pageTalk = addedPageTalk(live.record, record);
  if (pageTalk.length > 0) {
    fail(
      `${id}: the change adds text about the page, map or sources instead of the animal:\n${pageTalk
        .map((hit) => `  ${hit.locale} ${hit.field}: “${hit.match}”`)
        .join("\n")}`,
    );
  }
  record.base.updatedAt = toSiteDateTime(new Date());

  const fieldChanges = changes.filter((change) =>
    change.path.startsWith("fieldRecords."),
  );
  const otherChanges = changes.filter(
    (change) => !change.path.startsWith("fieldRecords."),
  );
  console.log(`${id}: ${otherChanges.length} changed fields`);
  for (const change of otherChanges) {
    console.log(`  ${change.path}`);
    const from = firstDifference(change.before, change.after);
    console.log(`    - ${preview(change.before, from)}`);
    console.log(`    + ${preview(change.after, from)}`);
  }
  if (fieldChanges.length > 0) {
    const before = new Set(live.record.fieldRecords.map(fieldRecordKey));
    const after = new Set(record.fieldRecords.map(fieldRecordKey));
    console.log(
      `${id}: field records ${before.size} → ${after.size} (+${[...after].filter((key) => !before.has(key)).length} new, −${[...before].filter((key) => !after.has(key)).length} removed)`,
    );
  }
  if (fieldChanges.length > 0 || otherChanges.some(isRangeChange)) {
    printRegions(id, "before", live.record);
    printRegions(id, "after", record as LiveRecord);
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

async function regions(id: string) {
  const local = fs.existsSync(draftPath(id))
    ? (JSON.parse(fs.readFileSync(draftPath(id), "utf8")) as DraftFile)
    : null;
  const record = local
    ? (local.record as LiveRecord)
    : (await readAdminSpecies(id)).record;
  if (!record.rangeMap) {
    console.log(`${id}: no range map. Add rangeMap to show one on the page.`);
  }
  printRegions(id, local ? "in .drafts" : "live", record);
}
