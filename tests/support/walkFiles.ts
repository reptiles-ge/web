import { readdirSync, statSync } from "node:fs";
import path from "node:path";

export function walkFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? walkFiles(full) : [full];
  });
}
