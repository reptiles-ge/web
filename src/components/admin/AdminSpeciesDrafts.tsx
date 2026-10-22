"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { DraftChange } from "@/lib/speciesDraftDiff";

type AdminDraftView = {
  actor: string;
  baseVersion: number;
  changes: DraftChange[];
  createdAt: string;
  id: number;
  source: string;
  summary: string;
};

type Props = {
  currentVersion: number;
  drafts: AdminDraftView[];
  id: string;
};

export function AdminSpeciesDrafts({ currentVersion, drafts, id }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState<null | number>(null);
  const [error, setError] = useState<null | string>(null);

  async function decide(draftId: number, decision: "approve" | "reject") {
    setBusy(draftId);
    setError(null);
    try {
      const response = await fetch("/api/admin/species-drafts", {
        body: JSON.stringify({ decision, draftId, id }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok)
        throw new Error(result.error ?? "Draft decision failed");
      router.refresh();
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : String(failure));
    } finally {
      setBusy(null);
    }
  }

  if (drafts.length === 0) {
    return (
      <p className="text-[14px] text-muted-foreground" id="drafts">
        დასადასტურებელი ცვლილება არ არის.
      </p>
    );
  }

  return (
    <section aria-labelledby="drafts-title" className="space-y-6" id="drafts">
      <h2 className="font-display text-xl font-semibold" id="drafts-title">
        დასადასტურებელი ცვლილებები ({drafts.length})
      </h2>
      {error ? (
        <p className="text-[14px] text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      {drafts.map((draft) => {
        const stale = draft.baseVersion !== currentVersion;
        return (
          <article
            className="rounded-xl border border-border p-4"
            id={`draft-${draft.id}`}
            key={draft.id}
          >
            <header className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-medium">{draft.summary}</h3>
              <p className="text-[12px] text-muted-foreground">
                {draft.source} · {draft.actor} · {draft.createdAt} · v
                {draft.baseVersion}
              </p>
            </header>
            {stale ? (
              <p className="mt-2 text-[13px] text-amber-700">
                სახეობა ამ ცვლილების შემდეგ შეიცვალა (ახლა v{currentVersion}).
                დადასტურება შეუძლებელია, უარყავით და თავიდან გაუშვით.
              </p>
            ) : null}
            <dl className="mt-4 space-y-3">
              {draft.changes.map((change) => (
                <div key={change.path}>
                  <dt className="font-mono text-[12px] text-muted-foreground">
                    {change.path}
                  </dt>
                  <dd className="mt-1 grid gap-2 text-[14px] md:grid-cols-2">
                    <p className="rounded bg-red-50 p-2 whitespace-pre-wrap text-red-900 dark:bg-red-950 dark:text-red-100">
                      {change.before || "—"}
                    </p>
                    <p className="rounded bg-green-50 p-2 whitespace-pre-wrap text-green-900 dark:bg-green-950 dark:text-green-100">
                      {change.after || "—"}
                    </p>
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 flex gap-3">
              <button
                className="rounded-lg bg-foreground px-4 py-2 text-[14px] text-background disabled:opacity-50"
                disabled={busy !== null || stale}
                onClick={() => void decide(draft.id, "approve")}
                type="button"
              >
                დადასტურება
              </button>
              <button
                className="rounded-lg border border-border px-4 py-2 text-[14px] disabled:opacity-50"
                disabled={busy !== null}
                onClick={() => void decide(draft.id, "reject")}
                type="button"
              >
                უარყოფა
              </button>
            </div>
          </article>
        );
      })}
    </section>
  );
}
