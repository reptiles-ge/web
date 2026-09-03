"use client";

import Image from "next/image";
import { useState } from "react";
import type { GalleryImage } from "@/data/speciesTypes";

type Props = {
  id: string;
  gallery: GalleryImage[];
};

export function AdminSpeciesEditor({ id, gallery }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [pullRequestUrl, setPullRequestUrl] = useState<string | null>(null);
  const [pending, setPending] = useState<GalleryImage[]>([]);
  const photos = [...gallery, ...pending];

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setBusy(true);
    setError(null);
    setOk(null);
    setPullRequestUrl(null);
    try {
      const body = new FormData(form);
      body.set("id", id);
      const response = await fetch("/api/admin/photos", {
        method: "POST",
        body,
      });
      const payload = (await response.json()) as {
        error?: string;
        added?: GalleryImage[];
        pullRequestUrl?: string;
        pullRequestError?: string;
      };
      if (!response.ok) {
        throw new Error(payload.error ?? "ატვირთვა ვერ მოხერხდა");
      }
      const added = payload.added ?? [];
      const count = added.length;
      if (added.length) {
        setPending((current) => [...current, ...added]);
      }
      if (payload.pullRequestUrl) {
        setPullRequestUrl(payload.pullRequestUrl);
        setOk(
          count === 1
            ? "ფოტო CDN-ზეა. PR გაიხსნა — merge შენზეა."
            : `${count} ფოტო CDN-ზეა. PR გაიხსნა — merge შენზეა.`,
        );
      } else {
        setOk(
          count === 1
            ? "ფოტო CDN-ზეა, PR ვერ გაიხსნა."
            : `${count} ფოტო CDN-ზეა, PR ვერ გაიხსნა.`,
        );
        if (payload.pullRequestError) {
          setError(payload.pullRequestError);
        }
      }
      form.reset();
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "ატვირთვა ვერ მოხერხდა",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <section>
        <h2 className="font-display text-lg font-medium">გალერეა</h2>
        {gallery.length + pending.length === 0 ? (
          <p className="mt-4 text-[14px] text-muted-foreground">ცარიელია</p>
        ) : (
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos.map((item) => (
              <li
                key={item.src}
                className="overflow-hidden rounded-lg border border-border bg-card"
              >
                <div className="media-placeholder relative aspect-4/3 w-full">
                  <Image
                    src={item.src}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <p className="truncate px-2.5 py-2 text-[11px] text-muted-foreground">
                  {item.credit?.photographer ?? item.src.split("/").at(-1)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <form
        onSubmit={onSubmit}
        className="rounded-xl border border-border bg-card p-5"
      >
        <h2 className="font-display text-lg font-medium">ატვირთვა</h2>
        <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
          ფაილი CDN-ზეა AVIF/WebP ზომებით, როგორც images:optimize. MDX და
          კატალოგი იწერება მხოლოდ PR-ის ბრენჩზე, არა ამ ლოკალურ ბრენჩზე. Merge
          შენზეა.
        </p>
        <label className="mt-5 block text-[12px] text-muted-foreground">
          ფოტოები
          <input
            name="photos"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif,image/avif"
            multiple
            required
            className="mt-1.5 block w-full text-[13px]"
          />
        </label>
        <label className="mt-4 block text-[12px] text-muted-foreground">
          ფოტოგრაფი
          <input
            name="photographer"
            className="mt-1.5 h-10 w-full rounded-md border border-border bg-background px-3 text-[14px] text-foreground outline-none focus:border-primary"
          />
        </label>
        <label className="mt-3 block text-[12px] text-muted-foreground">
          ფოტოგრაფი (EN)
          <input
            name="photographerEn"
            className="mt-1.5 h-10 w-full rounded-md border border-border bg-background px-3 text-[14px] text-foreground outline-none focus:border-primary"
          />
        </label>
        <label className="mt-3 block text-[12px] text-muted-foreground">
          ადგილი
          <input
            name="location"
            className="mt-1.5 h-10 w-full rounded-md border border-border bg-background px-3 text-[14px] text-foreground outline-none focus:border-primary"
          />
        </label>
        <label className="mt-3 block text-[12px] text-muted-foreground">
          ადგილი (EN)
          <input
            name="locationEn"
            className="mt-1.5 h-10 w-full rounded-md border border-border bg-background px-3 text-[14px] text-foreground outline-none focus:border-primary"
          />
        </label>
        <label className="mt-3 block text-[12px] text-muted-foreground">
          თარიღი
          <input
            name="date"
            type="date"
            className="mt-1.5 h-10 w-full rounded-md border border-border bg-background px-3 text-[14px] text-foreground outline-none focus:border-primary"
          />
        </label>
        {error ? (
          <p className="mt-4 text-[13px] text-destructive">{error}</p>
        ) : null}
        {ok ? <p className="mt-4 text-[13px] text-primary">{ok}</p> : null}
        {pullRequestUrl ? (
          <a
            href={pullRequestUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-[13px] break-all text-primary underline"
          >
            {pullRequestUrl}
          </a>
        ) : null}
        <button
          type="submit"
          disabled={busy}
          className="mt-5 h-11 w-full rounded-lg bg-foreground text-[14px] font-medium text-background disabled:opacity-50"
        >
          {busy ? "იტვირთება…" : "ატვირთვა"}
        </button>
      </form>
    </div>
  );
}
