import matter from "gray-matter";
import fs from "node:fs/promises";
import path from "node:path";

import { readSpeciesField, validateEditorResult } from "@/lib/contentEditor";
import { transformWithCodex } from "@/lib/contentEditorCodex";
import {
  assertSpeciesTextSourceCurrent,
  createSpeciesTextsPullRequest,
} from "@/lib/contentEditorPullRequest";
import { resolveEditorTarget } from "@/lib/contentEditorTarget";
import { lockSpeciesAnalysis } from "@/lib/speciesAnalysisLock";

export function getSpeciesTextFields(raw: string) {
  const data = matter(raw).data;
  const traits = data.identification?.traits;
  const faq = data.faq;
  const fields = [
    "interaction",
    "overview",
    "identification.summary",
    ...(Array.isArray(traits)
      ? traits.map(
          (_: unknown, index: number) => `identification.traits.${index}`,
        )
      : []),
    "habitat",
    "diet",
    "behavior",
    "conservation",
    ...(Array.isArray(faq)
      ? faq.map((_: unknown, index: number) => `faq.${index}.answer`)
      : []),
  ];
  return fields.filter((field) => readSpeciesField(raw, field, true).trim());
}

export async function processSpeciesTexts(id: string, operationId: string) {
  const unlock = lockSpeciesAnalysis(id);
  try {
    await assertSpeciesTextSourceCurrent(id);
    const raw = await fs.readFile(
      path.join(process.cwd(), "src/content/species", id, "ka.mdx"),
      "utf8",
    );
    const fields = getSpeciesTextFields(raw);
    if (!fields.length) throw new Error("No page texts to process");
    const targets = await Promise.all(
      fields.map(async (field) => ({
        field,
        source: (await resolveEditorTarget({ field, id, kind: "species" }))
          .source,
      })),
    );
    const updates: Array<{
      field: string;
      result: Awaited<ReturnType<typeof transformWithCodex>>;
      source: string;
    }> = [];
    for (let index = 0; index < targets.length; index += 3) {
      const batch = await Promise.allSettled(
        targets.slice(index, index + 3).map(async ({ field, source }) => {
          const selection = { after: "", before: "", selected: source };
          const result = validateEditorResult(
            await transformWithCodex(selection, "xhigh"),
            selection,
          );
          return { field, result, source };
        }),
      );
      for (const item of batch) {
        if (item.status === "rejected") throw item.reason;
        updates.push(item.value);
      }
    }
    const pullRequestUrl = await createSpeciesTextsPullRequest(
      id,
      updates,
      operationId,
    );
    return {
      pullRequestUrl,
      report: updates
        .map(({ field, result }) => `${field}\n${result.ka}`)
        .join("\n\n"),
    };
  } finally {
    unlock();
  }
}
