import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import type { SpeciesFieldRecord } from "@/data/speciesTypes";

import { buildFieldRecordsImport } from "@/api/db/fieldRecords";

const source = path.resolve(
  import.meta.dirname,
  "../src/data/fieldRecords.generated.json",
);
const output = path.resolve(
  import.meta.dirname,
  "../.wrangler/field-records-import.sql",
);
const recordsById = JSON.parse(readFileSync(source, "utf8")) as Record<
  string,
  SpeciesFieldRecord[]
>;
const statements = buildFieldRecordsImport(recordsById);

mkdirSync(path.dirname(output), { recursive: true });
writeFileSync(output, `${statements.join("\n")}\n`);
console.log(
  `Wrote ${statements.length} statements for ${Object.values(recordsById).flat().length} field records → ${path.relative(process.cwd(), output)}`,
);
