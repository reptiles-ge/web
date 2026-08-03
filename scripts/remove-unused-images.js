#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const IMAGES_DIR = path.join(ROOT, "public", "images");
const SEARCH_DIRS = ["src", "public"];
const IMAGE_EXTS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".svg",
  ".avif",
]);
const CODE_EXTS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".css",
  ".scss",
  ".html",
  ".md",
  ".json",
  ".txt",
]);
const SKIP_DIR_NAMES = new Set([
  "node_modules",
  ".next",
  ".git",
  "tmp-natrix",
  "tmp-urartica",
  "tmp-water-dragon",
  "tmp-ammodytes",
  "tmp-kaznakovi",
  "tmp-pseudopus",
]);

const args = process.argv.slice(2);
const shouldDelete = args.includes("--delete");
const jsonOut = args.includes("--json");

function walkFiles(dir, predicate, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") && entry.name !== ".") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIR_NAMES.has(entry.name)) continue;
      walkFiles(full, predicate, out);
      continue;
    }
    if (predicate(full, entry.name)) out.push(full);
  }
  return out;
}

function collectImages() {
  return walkFiles(IMAGES_DIR, (full) =>
    IMAGE_EXTS.has(path.extname(full).toLowerCase()),
  ).sort();
}

function collectSearchFiles() {
  const files = [];
  for (const rel of SEARCH_DIRS) {
    walkFiles(
      path.join(ROOT, rel),
      (full) => {
        if (full.startsWith(IMAGES_DIR + path.sep)) return false;
        return CODE_EXTS.has(path.extname(full).toLowerCase());
      },
      files,
    );
  }
  return files;
}

function isReferenced(imagePath, haystack) {
  const relFromPublic = path
    .relative(path.join(ROOT, "public"), imagePath)
    .split(path.sep)
    .join("/");
  const webPath = `/${relFromPublic}`;
  const fileName = path.basename(imagePath);
  const ogRel = path.relative(path.join(IMAGES_DIR, "og"), imagePath);

  const needles = new Set([
    webPath,
    relFromPublic,
    `images/${path.relative(IMAGES_DIR, imagePath).split(path.sep).join("/")}`,
    fileName,
  ]);

  if (!ogRel.startsWith("..")) {
    needles.add(ogRel.split(path.sep).join("/"));
  }

  for (const needle of needles) {
    if (needle && haystack.includes(needle)) return true;
  }
  return false;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function main() {
  const images = collectImages();
  const searchFiles = collectSearchFiles();
  const haystack = searchFiles
    .map((file) => fs.readFileSync(file, "utf8"))
    .join("\n");

  const unused = [];
  let unusedBytes = 0;

  for (const imagePath of images) {
    if (isReferenced(imagePath, haystack)) continue;
    const size = fs.statSync(imagePath).size;
    unusedBytes += size;
    unused.push({
      path: path.relative(ROOT, imagePath).split(path.sep).join("/"),
      size,
    });
  }

  if (jsonOut) {
    console.log(JSON.stringify({ unused, totalBytes: unusedBytes }, null, 2));
    return;
  }

  console.log(`Scanned ${images.length} images in public/images`);
  console.log(`Checked references in ${searchFiles.length} source files\n`);

  if (unused.length === 0) {
    console.log("No unused images found.");
    return;
  }

  console.log(`Unused images (${unused.length}, ${formatBytes(unusedBytes)}):\n`);
  for (const item of unused) {
    console.log(`  ${item.path}  (${formatBytes(item.size)})`);
  }

  if (!shouldDelete) {
    console.log("\nDry run only. Pass --delete to remove these files.");
    return;
  }

  console.log("\nDeleting...");
  for (const item of unused) {
    fs.unlinkSync(path.join(ROOT, item.path));
    console.log(`  deleted ${item.path}`);
  }
  console.log(`\nRemoved ${unused.length} files (${formatBytes(unusedBytes)}).`);
}

main();
