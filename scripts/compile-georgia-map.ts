import fs from "node:fs";
import path from "node:path";

const svgFile = path.join(process.cwd(), "src/assets/maps/georgia.svg");
const outFile = path.join(process.cwd(), "src/data/georgia-paths.generated.ts");

const REGION_PATH_IDS = [
  "abkhazia",
  "samegrelo-zemo-svaneti",
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

const LABEL_GRID = 60;

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

function labelPoint(d: string): [number, number] {
  const ring = pathVertices(d);
  const xs = ring.map((point) => point[0]);
  const ys = ring.map((point) => point[1]);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const stepX = (Math.max(...xs) - minX) / LABEL_GRID;
  const stepY = (Math.max(...ys) - minY) / LABEL_GRID;
  let best: [number, number] = [minX, minY];
  let bestDistance = -1;

  for (let column = 0; column <= LABEL_GRID; column += 1) {
    for (let row = 0; row <= LABEL_GRID; row += 1) {
      const x = minX + column * stepX;
      const y = minY + row * stepY;
      if (!pointInRing(x, y, ring)) continue;
      const distance = distanceToRing(x, y, ring);
      if (distance > bestDistance) {
        bestDistance = distance;
        best = [x, y];
      }
    }
  }

  return [Math.round(best[0] * 10) / 10, Math.round(best[1] * 10) / 10];
}

function distanceToRing(x: number, y: number, ring: [number, number][]) {
  let min = Infinity;
  for (let i = 0; i < ring.length; i += 1) {
    const [ax, ay] = ring[i];
    const [bx, by] = ring[(i + 1) % ring.length];
    const dx = bx - ax;
    const dy = by - ay;
    const length = dx * dx + dy * dy;
    const t =
      length === 0
        ? 0
        : Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / length));
    min = Math.min(min, Math.hypot(x - (ax + t * dx), y - (ay + t * dy)));
  }
  return min;
}

function pathVertices(d: string): [number, number][] {
  const match = d.match(/^M([^l]+)l(.+)z$/);
  if (!match) {
    throw new Error("georgia.svg path is not a single M…l…z ring");
  }
  const numbers = (value: string) =>
    (value.match(/-?\d*\.?\d+/g) ?? []).map(Number);
  const [startX, startY] = numbers(match[1]);
  const deltas = numbers(match[2]);
  const ring: [number, number][] = [[startX, startY]];
  let x = startX;
  let y = startY;
  for (let i = 0; i + 1 < deltas.length; i += 2) {
    x += deltas[i];
    y += deltas[i + 1];
    ring.push([x, y]);
  }
  return ring;
}

function pointInRing(x: number, y: number, ring: [number, number][]) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function main() {
  const svg = fs.readFileSync(svgFile, "utf8");
  const viewBox = parseViewBox(svg);
  const paths = parsePaths(svg);

  const idUnion = REGION_PATH_IDS.map((id) => `  | "${id}"`).join("\n");
  const pathEntries = REGION_PATH_IDS.map(
    (id) => `  "${id}": ${JSON.stringify(paths[id])},`,
  ).join("\n");
  const labelEntries = REGION_PATH_IDS.map(
    (id) => `  "${id}": ${JSON.stringify(labelPoint(paths[id]))},`,
  ).join("\n");

  const contents = `export type RegionPathId =
${idUnion};

export const GEORGIA_MAP_VIEWBOX = ${JSON.stringify(viewBox)};

export const georgiaRegionPaths: Record<RegionPathId, string> = {
${pathEntries}
};

export const georgiaRegionLabelPoints: Record<
  RegionPathId,
  [number, number]
> = {
${labelEntries}
};
`;

  fs.writeFileSync(outFile, contents);
  console.log(`Wrote ${outFile} (${REGION_PATH_IDS.length} regions)`);
}

main();
