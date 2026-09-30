"use client";

import { useState } from "react";

export function AdminSpeciesCreate() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [prompt, setPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  async function prepare(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    setPrompt("");
    setCopied(false);
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
      const payload = (await response.json()) as {
        error?: string;
        prompt?: string;
      };
      if (!response.ok || !payload.prompt) {
        throw new Error(payload.error ?? "პრომპტი ვერ მომზადდა");
      }
      setPrompt(payload.prompt);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "პრომპტი ვერ მომზადდა",
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
    } catch {
      setCopied(false);
      setError("პრომპტი ვერ დაკოპირდა");
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
            Codex არ გაეშვება. დაბრუნდება ის პრომპტი, რომელსაც გვერდის შექმნა
            Codex-ში აგზავნის.
          </p>
        </div>
        <button
          className="text-[13px] text-muted-foreground hover:text-foreground"
          disabled={loading}
          onClick={() => setOpen(false)}
          type="button"
        >
          დახურვა
        </button>
      </div>
      <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={prepare}>
        <label className="text-[13px] font-medium">
          დასახელება
          <input
            autoComplete="off"
            className="mt-1.5 h-11 w-full rounded-lg border border-border bg-background px-3 text-[14px] outline-none focus:border-primary"
            disabled={loading}
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
            disabled={loading}
            maxLength={160}
            name="scientificName"
            placeholder="Olivierus caucasicus"
            required
            spellCheck={false}
          />
        </label>
        <button
          className="rounded-lg bg-primary px-4 py-3 text-[14px] font-medium text-white disabled:opacity-60 sm:col-span-2 dark:text-ink"
          disabled={loading}
          type="submit"
        >
          {loading ? "მზადდება…" : "პრომპტის ჩვენება"}
        </button>
      </form>
      <div aria-live="polite">
        {error ? (
          <p className="mt-4 text-[13px] text-destructive">{error}</p>
        ) : null}
        {prompt ? (
          <div className="mt-4 border-t border-border pt-4">
            <button
              className="rounded-lg border border-border px-4 py-2 text-[14px] font-medium hover:bg-background"
              onClick={() => void copyPrompt()}
              type="button"
            >
              {copied ? "დაკოპირდა" : "კოპირება"}
            </button>
            <pre className="mt-3 max-h-96 overflow-auto font-sans text-[13px] leading-relaxed wrap-break-word whitespace-pre-wrap">
              {prompt}
            </pre>
          </div>
        ) : null}
      </div>
    </section>
  );
}
