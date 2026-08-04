import { siteConfig } from "@/lib/site";
import { existsSync } from "fs";
import path from "path";

export function editorPortraitExists() {
  return existsSync(
    path.join(process.cwd(), "public", siteConfig.editor.image),
  );
}
