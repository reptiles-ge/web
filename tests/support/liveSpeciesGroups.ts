import fs from "node:fs";
import path from "node:path";

const GENERATED = path.join(
  process.cwd(),
  "src/data/speciesAtlasMeta.generated.ts",
);

function readLiveSpeciesGroups(): null | Record<string, string> {
  if (!fs.existsSync(GENERATED)) return null;
  const source = fs.readFileSync(GENERATED, "utf8");
  const start = source.indexOf("= {");
  const end = source.lastIndexOf("};");
  if (start < 0 || end < 0) return null;
  const meta = JSON.parse(source.slice(start + 2, end + 1)) as Record<
    string,
    { group: string }
  >;
  return Object.fromEntries(
    Object.entries(meta).map(([id, item]) => [id, item.group]),
  );
}

export const liveSpeciesGroups = readLiveSpeciesGroups();
