import type { SpeciesFieldRecord } from "@/data/speciesTypes";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TOP_LEVEL_KEY = /^[A-Za-z][A-Za-z0-9]*:/;

export type INaturalistObservation = {
  geojson?: { coordinates?: unknown };
  id: number;
  location?: null | string;
  observed_on?: null | string;
  place_guess?: null | string;
  user?: {
    login?: null | string;
    name?: null | string;
  };
};

export type INaturalistRecordMergeResult = {
  added: number;
  records: SpeciesFieldRecord[];
  skippedDuplicateCoordinates: number;
  skippedDuplicateObservations: number;
  skippedExistingDuplicateCoordinates: number;
  skippedMissingCoordinates: number;
};

export function formatFieldRecordYaml(record: SpeciesFieldRecord): string {
  const lines = [`  - locality: ${yamlScalar(record.locality)}`];
  lines.push(`    lat: ${record.lat}`);
  lines.push(`    lng: ${record.lng}`);
  for (const [key, value] of fieldRecordEntries(record)) {
    lines.push(`    ${formatRecordField(key, value)}`);
  }
  return `${lines.join("\n")}\n`;
}

export function iNaturalistObservationId(value?: string) {
  const match = value?.match(/(?:observations\/|observation\s*#)(\d+)/i);
  return match?.[1];
}

export function mergeINaturalistFieldRecords({
  coordinateDecimals = 5,
  existing,
  observations,
}: {
  coordinateDecimals?: number;
  existing: SpeciesFieldRecord[];
  observations: INaturalistObservation[];
}): INaturalistRecordMergeResult {
  const coordinateKeys = new Set<string>();
  const observationIds = new Set<string>();
  const records: SpeciesFieldRecord[] = [];
  let added = 0;
  let skippedDuplicateCoordinates = 0;
  let skippedDuplicateObservations = 0;
  let skippedExistingDuplicateCoordinates = 0;
  let skippedMissingCoordinates = 0;

  for (const record of sortFieldRecords(existing)) {
    const observationId =
      iNaturalistObservationId(record.url) ??
      iNaturalistObservationId(record.note);
    if (observationId) observationIds.add(observationId);

    const coordinate = recordCoordinateKey(record, coordinateDecimals);
    if (coordinate && coordinateKeys.has(coordinate)) {
      skippedExistingDuplicateCoordinates += 1;
      continue;
    }
    if (coordinate) coordinateKeys.add(coordinate);
    records.push(record);
  }

  for (const observation of observations) {
    const observationId = String(observation.id);
    if (observationIds.has(observationId)) {
      skippedDuplicateObservations += 1;
      continue;
    }

    const record = observationToFieldRecord(observation, coordinateDecimals);
    if (!record) {
      skippedMissingCoordinates += 1;
      continue;
    }

    const coordinate = recordCoordinateKey(record, coordinateDecimals);
    if (coordinateKeys.has(coordinate)) {
      skippedDuplicateCoordinates += 1;
      continue;
    }

    coordinateKeys.add(coordinate);
    observationIds.add(observationId);
    records.push(record);
    added += 1;
  }

  return {
    added,
    records: sortFieldRecords(records),
    skippedDuplicateCoordinates,
    skippedDuplicateObservations,
    skippedExistingDuplicateCoordinates,
    skippedMissingCoordinates,
  };
}

export function observationToFieldRecord(
  observation: INaturalistObservation,
  coordinateDecimals = 5,
): null | SpeciesFieldRecord {
  const coordinates = observationCoordinates(observation);
  if (!coordinates) return null;

  const observer = observation.user?.login?.trim();
  const observerName = observation.user?.name?.trim();
  const date =
    observation.observed_on && DATE_RE.test(observation.observed_on)
      ? observation.observed_on
      : undefined;
  const locality =
    observation.place_guess?.trim() ||
    `iNaturalist observation #${observation.id}`;
  const record: SpeciesFieldRecord = {
    evidence: "observation",
    lat: roundCoordinate(coordinates.lat, coordinateDecimals),
    lng: roundCoordinate(coordinates.lng, coordinateDecimals),
    locality,
    note: `iNaturalist observation #${observation.id}`,
    source: "iNaturalist",
    url: `https://www.inaturalist.org/observations/${observation.id}`,
  };
  if (date) record.date = date;
  if (observer) record.observer = observer;
  if (observerName && observerName !== observer) {
    record.observerName = observerName;
  }
  return record;
}

export function replaceFieldRecordsInMdx(
  raw: string,
  records: SpeciesFieldRecord[],
): string {
  const newline = raw.includes("\r\n") ? "\r\n" : "\n";
  const lines = raw.split(/\r?\n/);
  const block = recordsToYamlBlock(records);
  const range = findTopLevelRange(lines, "fieldRecords");

  if (range) {
    lines.splice(range.start, range.end - range.start, ...block);
    return lines.join(newline);
  }

  const galleryRange = findTopLevelRange(lines, "gallery");
  const closingFrontmatter = lines.findIndex(
    (line, index) => index > 0 && /^---\s*$/.test(line),
  );
  const insertAt =
    galleryRange?.end ??
    (closingFrontmatter === -1 ? lines.length : closingFrontmatter);
  lines.splice(insertAt, 0, ...block);
  return lines.join(newline);
}

export function sortFieldRecords(records: SpeciesFieldRecord[]) {
  return [...records].sort((left, right) => {
    const date = (right.date ?? "").localeCompare(left.date ?? "");
    if (date !== 0) return date;
    const locality = left.locality.localeCompare(right.locality);
    if (locality !== 0) return locality;
    return left.lat - right.lat || left.lng - right.lng;
  });
}

function fieldRecordEntries(
  record: SpeciesFieldRecord,
): Array<[string, string]> {
  const entries: Array<[string, string]> = [];
  if (record.date) entries.push(["date", record.date]);
  if (record.observer) entries.push(["observer", record.observer]);
  if (record.observerName) entries.push(["observerName", record.observerName]);
  if (record.source) entries.push(["source", record.source]);
  if (record.url) entries.push(["url", record.url]);
  if (record.note) entries.push(["note", record.note]);
  if (record.evidence) entries.push(["evidence", record.evidence]);
  return entries;
}

function findTopLevelRange(
  lines: string[],
  key: string,
): null | { end: number; start: number } {
  const start = lines.findIndex((line) =>
    new RegExp(`^${key}:(?:\\s|$)`).test(line),
  );
  if (start === -1) return null;
  let end = start + 1;
  while (end < lines.length) {
    const line = lines[end];
    if (line.trim() === "") {
      end += 1;
      continue;
    }
    if (TOP_LEVEL_KEY.test(line) || /^---\s*$/.test(line)) break;
    end += 1;
  }
  return { end, start };
}

function formatRecordField(key: string, value: string): string {
  if (key === "url") return `url: ${JSON.stringify(value)}`;
  return `${key}: ${yamlScalar(value)}`;
}

function observationCoordinates(observation: INaturalistObservation) {
  const coordinates = observation.geojson?.coordinates;
  if (
    Array.isArray(coordinates) &&
    typeof coordinates[0] === "number" &&
    typeof coordinates[1] === "number" &&
    validCoordinates(coordinates[1], coordinates[0])
  ) {
    return { lat: coordinates[1], lng: coordinates[0] };
  }

  const location = observation.location?.split(",").map(Number);
  if (
    location &&
    typeof location[0] === "number" &&
    typeof location[1] === "number" &&
    validCoordinates(location[0], location[1])
  ) {
    return { lat: location[0], lng: location[1] };
  }

  return null;
}

function recordCoordinateKey(
  record: SpeciesFieldRecord,
  coordinateDecimals: number,
) {
  if (!validCoordinates(record.lat, record.lng)) return "";
  return [
    roundCoordinate(record.lat, coordinateDecimals).toFixed(coordinateDecimals),
    roundCoordinate(record.lng, coordinateDecimals).toFixed(coordinateDecimals),
  ].join(",");
}

function recordsToYamlBlock(records: SpeciesFieldRecord[]) {
  if (records.length === 0) return ["fieldRecords: []"];
  return [
    "fieldRecords:",
    ...records.flatMap((record) =>
      formatFieldRecordYaml(record).replace(/\n$/, "").split("\n"),
    ),
  ];
}

function roundCoordinate(value: number, coordinateDecimals: number) {
  return Number(value.toFixed(coordinateDecimals));
}

function validCoordinates(lat: number, lng: number) {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

function yamlScalar(value: string): string {
  if (value === "") return '""';
  if (
    /^\d/.test(value) ||
    /[:#{}[\],&*!|>'"%@`]/.test(value) ||
    /^\s|\s$/.test(value)
  ) {
    return JSON.stringify(value);
  }
  return value;
}
