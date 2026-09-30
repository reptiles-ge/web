"use client";

import { useState } from "react";

type CreationResult = {
  error?: string;
  id?: string;
  pullRequestUrl?: null | string;
  report?: string;
};

export function AdminSpeciesCreate() {
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CreationResult | null>(null);

  async function create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (creating) return;
    setCreating(true);
    setError("");
    setResult(null);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/species-create", {
        body: JSON.stringify({
          commonName: form.get("commonName"),
          scientificName: form.get("scientificName"),
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const payload = (await response.json()) as CreationResult;
      if (!response.ok) throw new Error(payload.error ?? "გვერდი ვერ შეიქმნა");
      setResult(payload);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "გვერდი ვერ შეიქმნა");
    } finally {
      setCreating(false);
    }
  }

  if (!open) {
    return (
      <button
        className="mt-6 inline-flex rounded-lg bg-primary px-4 py-3 text-[14px] font-medium text-white hover:opacity-90 dark:text-ink"
        onClick={() => setOpen(true)}
        type="button"
      >
        ახალი გვერდის შექმნა
      </button>
    );
  }

  return (
    <section className="mt-6 rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold">
            ახალი გვერდის შექმნა
          </h2>
          <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
            Codex გადაამოწმებს სახეობას, შექმნის ოთხივე ენას, გაატარებს
            შემოწმებებს და გახსნის PR-ს.
          </p>
        </div>
        <button
          className="text-[13px] text-muted-foreground hover:text-foreground"
          disabled={creating}
          onClick={() => setOpen(false)}
          type="button"
        >
          დახურვა
        </button>
      </div>
      <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={create}>
        <label className="text-[13px] font-medium">
          დასახელება
          <input
            autoComplete="off"
            className="mt-1.5 h-11 w-full rounded-lg border border-border bg-background px-3 text-[14px] outline-none focus:border-primary"
            disabled={creating}
            maxLength={120}
            name="commonName"
            placeholder="კავკასიური მორიელი"
            required
          />
        </label>
        <label className="text-[13px] font-medium">
          სამეცნიერო სახელი
          <input
            autoCapitalize="none"
            autoComplete="off"
            className="mt-1.5 h-11 w-full rounded-lg border border-border bg-background px-3 text-[14px] outline-none focus:border-primary"
            disabled={creating}
            maxLength={160}
            name="scientificName"
            placeholder="Olivierus caucasicus"
            required
            spellCheck={false}
          />
        </label>
        <button
          className="rounded-lg bg-primary px-4 py-3 text-[14px] font-medium text-white disabled:opacity-60 sm:col-span-2 dark:text-ink"
          disabled={creating}
          type="submit"
        >
          {creating ? "იკვლევს და ქმნის გვერდს…" : "შექმნა"}
        </button>
      </form>
      <div aria-live="polite">
        {creating ? (
          <p className="mt-4 text-[13px] text-muted-foreground">
            კვლევას და ტექნიკურ შემოწმებებს რამდენიმე წუთი შეიძლება დასჭირდეს.
            ეს გვერდი არ დახურო.
          </p>
        ) : null}
        {error ? (
          <p className="mt-4 text-[13px] text-destructive">{error}</p>
        ) : null}
        {result ? (
          <div className="mt-4 border-t border-border pt-4 text-[13px]">
            {result.pullRequestUrl ? (
              <a
                className="font-medium text-primary underline"
                href={result.pullRequestUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                შექმნილი PR-ის გახსნა →
              </a>
            ) : (
              <p className="font-medium">PR არ შექმნილა.</p>
            )}
            {result.report ? (
              <pre className="mt-3 max-h-96 overflow-auto font-sans leading-relaxed wrap-break-word whitespace-pre-wrap">
                {result.report}
              </pre>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
