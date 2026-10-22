import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { buildSpeciesImport } from "@/api/db/speciesImport";
import { speciesImportSource } from "@/lib/speciesImportSource";

const output = path.resolve(
  import.meta.dirname,
  "../.wrangler/species-import.sql",
);
const source = speciesImportSource();
const statements = buildSpeciesImport(source);

mkdirSync(path.dirname(output), { recursive: true });
writeFileSync(output, `${statements.join("\n")}\n`);
console.log(
  `Wrote ${statements.length} statements for ${source.catalogIds.length} species → ${path.relative(process.cwd(), output)}`,
);
