import fs from "node:fs";
import path from "node:path";

const svgFile = path.join(process.cwd(), "src/assets/maps/georgia.svg");
const outFile = path.join(process.cwd(), "src/data/georgia-paths.generated.ts");

const REGION_PATH_IDS = [
  "abkhazia",
  "samegrelo",
  "shida-kartli",
  "racha",
  "mtskheta-mtianeti",
  "kakheti",
  "samtskhe-javakheti",
  "adjara",
  "kvemo-kartli",
  "guria",
  "tbilisi",
  "imereti",
] as const;

type RegionPathId = (typeof REGION_PATH_IDS)[number];

function parseViewBox(svg: string): string {
  const match = svg.match(/\bviewBox="([^"]+)"/);
  if (!match) {
    throw new Error("georgia.svg is missing viewBox");
  }
  return match[1];
}

function parsePaths(svg: string): Record<RegionPathId, string> {
  const paths = {} as Record<RegionPathId, string>;
  const pathRe = /<path\b([^>]*)\/>/g;
  let match: RegExpExecArray | null;
  while ((match = pathRe.exec(svg))) {
    const attrs = match[1];
    const idMatch = attrs.match(/\bid="([^"]+)"/);
    const dMatch = attrs.match(/\bd="([^"]+)"/);
    if (!idMatch || !dMatch) continue;
    const id = idMatch[1];
    if (!(REGION_PATH_IDS as readonly string[]).includes(id)) {
      throw new Error(`Unknown region path id in georgia.svg: ${id}`);
    }
    paths[id as RegionPathId] = dMatch[1];
  }

  for (const id of REGION_PATH_IDS) {
    if (!paths[id]) {
      throw new Error(`Missing path for region id in georgia.svg: ${id}`);
    }
  }

  return paths;
}

function main() {
  const svg = fs.readFileSync(svgFile, "utf8");
  const viewBox = parseViewBox(svg);
  const paths = parsePaths(svg);

  const idUnion = REGION_PATH_IDS.map((id) => `  | "${id}"`).join("\n");
  const pathEntries = REGION_PATH_IDS.map(
    (id) => `  "${id}": ${JSON.stringify(paths[id])},`,
  ).join("\n");

  const contents = `export type RegionPathId =
${idUnion};

export const GEORGIA_MAP_VIEWBOX = ${JSON.stringify(viewBox)};

export const georgiaRegionPaths: Record<RegionPathId, string> = {
${pathEntries}
};
`;

  fs.writeFileSync(outFile, contents);
  console.log(`Wrote ${outFile} (${REGION_PATH_IDS.length} regions)`);
}

main();
