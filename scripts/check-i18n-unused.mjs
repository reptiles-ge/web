import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const SOURCE_ROOT = "src";
const SOURCE_FILE = /\.(ts|tsx)$/;
const SKIPPED_FILE = /\.(test|generated)\.(ts|tsx)$/;
const TABLE_ROW = /^│\s*messages\/ka\.json\s*│\s*(\S+)\s*│$/;
const INTERPOLATION = /\$\{[^}]*\}/g;
const DYNAMIC_SEGMENT = "[A-Za-z0-9_-]+";

function collectSourceFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectSourceFiles(full, out);
      continue;
    }
    if (SOURCE_FILE.test(entry.name) && !SKIPPED_FILE.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function reportedUnusedKeys() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "i18n-unused-"));
  const reportPath = path.join(directory, "report.txt");
  const report = fs.openSync(reportPath, "w");
  const result = spawnSync(
    "i18n-check",
    [
      "--locales",
      "messages",
      "--source",
      "ka",
      "--format",
      "next-intl",
      "--only",
      "unused",
      "--unused",
      SOURCE_ROOT,
    ],
    {
      shell: process.platform === "win32",
      stdio: ["ignore", report, "inherit"],
    },
  );
  fs.closeSync(report);
  const output = fs.readFileSync(reportPath, "utf8");
  fs.rmSync(directory, { force: true, recursive: true });
  if (result.error) {
    console.error(`i18n-check failed to start: ${result.error.message}`);
    process.exit(1);
  }
  if (!output.includes("Done in")) {
    console.error("i18n-check did not finish its report.");
    process.exit(1);
  }
  const keys = [];
  for (const line of output.split(/\r?\n/)) {
    const match = TABLE_ROW.exec(line.trim());
    if (match) keys.push(match[1]);
  }
  return keys;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function collectUsage(files) {
  const literals = new Set();
  const rawKeys = new Set();
  const patterns = new Map();

  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    for (const match of text.matchAll(/"([^"\\\n]*)"|'([^'\\\n]*)'/g)) {
      literals.add(match[1] ?? match[2]);
    }
    for (const match of text.matchAll(/`([^`]*)`/g)) {
      const template = match[1];
      if (!template.includes("${")) {
        literals.add(template);
        continue;
      }
      const fixed = template.replace(INTERPOLATION, "").replace(/\./g, "");
      if (fixed.length < 2 || /\s/.test(template.replace(INTERPOLATION, ""))) {
        continue;
      }
      const source = template
        .split(INTERPOLATION)
        .map(escapeRegExp)
        .join(DYNAMIC_SEGMENT);
      patterns.set(source, new RegExp(`^${source}$`));
    }
    for (const match of text.matchAll(/\.raw\(\s*["'`]([^"'`]+)["'`]/g)) {
      rawKeys.add(match[1]);
    }
  }

  return { literals, patterns: [...patterns.values()], rawKeys };
}

function isSuffixUsed(segments, usage) {
  const suffix = segments.join(".");
  if (usage.literals.has(suffix)) return true;
  if (usage.patterns.some((pattern) => pattern.test(suffix))) return true;
  for (let end = 1; end < segments.length; end += 1) {
    if (usage.rawKeys.has(segments.slice(0, end).join("."))) return true;
  }
  return false;
}

function isNamespaceUsed(namespace, usage) {
  return (
    usage.literals.has(namespace) ||
    usage.patterns.some((pattern) => pattern.test(namespace))
  );
}

function isKeyUsed(key, usage) {
  const segments = key.split(".");
  for (let split = 1; split < segments.length; split += 1) {
    const namespace = segments.slice(0, split).join(".");
    if (!isNamespaceUsed(namespace, usage)) continue;
    if (isSuffixUsed(segments.slice(split), usage)) return true;
  }
  return false;
}

const usage = collectUsage(collectSourceFiles(SOURCE_ROOT));
const reported = reportedUnusedKeys();
const unused = reported.filter((key) => !isKeyUsed(key, usage));

if (unused.length > 0) {
  console.error(`Unused translation keys: ${unused.length}`);
  for (const key of unused) console.error(`  ${key}`);
  console.error(
    "Remove them from every file in messages/, or reference them in src.",
  );
  process.exit(1);
}

console.log(
  `Unused translation keys: 0 (${reported.length} reported by i18n-check are referenced dynamically)`,
);
