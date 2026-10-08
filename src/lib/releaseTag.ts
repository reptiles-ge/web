const RELEASE_TAG = /^v(\d+)\.(\d+)\.(\d+)$/;

export function isReleaseTag(value: string): boolean {
  return RELEASE_TAG.test(value);
}

export function latestReleaseTag(tags: string[]): null | string {
  let latest: null | string = null;
  let latestParts: number[] = [];

  for (const tag of tags) {
    const match = RELEASE_TAG.exec(tag.trim());
    if (!match) continue;

    const parts = match.slice(1).map(Number);
    if (!latest || compareParts(parts, latestParts) > 0) {
      latest = match[0];
      latestParts = parts;
    }
  }

  return latest;
}

function compareParts(a: number[], b: number[]): number {
  for (let index = 0; index < a.length; index += 1) {
    const difference = a[index] - b[index];
    if (difference !== 0) return difference;
  }

  return 0;
}
