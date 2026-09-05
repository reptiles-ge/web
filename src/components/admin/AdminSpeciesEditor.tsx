"use client";

import { useRef, useState } from "react";

import type { GalleryImage } from "@/data/speciesTypes";

import {
  AdminCoverPreview,
  type AdminCoverPreviewState,
} from "@/components/admin/AdminCoverPreview";
import { AdminGalleryReorder } from "@/components/admin/AdminGalleryReorder";
import { resolveAdminCovers } from "@/lib/adminCover";

type Props = {
  commonName: string;
  gallery: GalleryImage[];
  id: string;
  image: string;
  mobileImage: string;
  scientificName: string;
};

export function AdminSpeciesEditor({
  commonName,
  gallery,
  id,
  image,
  mobileImage,
  scientificName,
}: Props) {
  const [busy, setBusy] = useState<"idle" | "reorder" | "upload">("idle");
  const [error, setError] = useState<null | string>(null);
  const [ok, setOk] = useState<null | string>(null);
  const [pullRequestUrl, setPullRequestUrl] = useState<null | string>(null);
  const [photos, setPhotos] = useState(() => gallery);
  const [savedSrcs, setSavedSrcs] = useState(() =>
    gallery.map((item) => item.src),
  );
  const busyRef = useRef(false);
  const dirty =
    photos.map((item) => item.src).join("\0") !== savedSrcs.join("\0");
  const saving = busy !== "idle";
  const covers = resolveAdminCovers(image, mobileImage);
  const [preview, setPreview] = useState<AdminCoverPreviewState | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busyRef.current) return;
    busyRef.current = true;
    const form = event.currentTarget;
    setBusy("upload");
    setError(null);
    setOk(null);
    setPullRequestUrl(null);
    try {
      const body = new FormData(form);
      body.set("id", id);
      const response = await fetch("/api/admin/photos", {
        body,
        method: "POST",
      });
      const payload = (await response.json()) as {
        added?: GalleryImage[];
        error?: string;
        pullRequestError?: string;
        pullRequestUrl?: string;
      };
      if (!response.ok) {
        throw new Error(payload.error ?? "ატვირთვა ვერ მოხერხდა");
      }
      const added = payload.added ?? [];
      const count = added.length;
      if (added.length) {
        setPhotos((current) => [...current, ...added]);
        setSavedSrcs((current) => [
          ...current,
          ...added.map((item) => item.src),
        ]);
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
      busyRef.current = false;
      setBusy("idle");
    }
  }

  async function onSaveOrder() {
    if (busyRef.current || !dirty || photos.length < 2) return;
    busyRef.current = true;
    setBusy("reorder");
    setError(null);
    setOk(null);
    try {
      const response = await fetch("/api/admin/photos/reorder", {
        body: JSON.stringify({
          id,
          srcs: photos.map((item) => item.src),
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const payload = (await response.json()) as {
        error?: string;
        pullRequestUrl?: string;
      };
      if (!response.ok) {
        throw new Error(payload.error ?? "რიგი ვერ შეინახა");
      }
      setSavedSrcs(photos.map((item) => item.src));
      if (payload.pullRequestUrl) {
        setPullRequestUrl(payload.pullRequestUrl);
        setOk("რიგი PR-შია. Merge შენზეა.");
      } else {
        setOk("რიგი PR-შია.");
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "რიგი ვერ შეინახა");
    } finally {
      busyRef.current = false;
      setBusy("idle");
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <section>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h2 className="font-display text-lg font-medium">გალერეა</h2>
          {covers.desktopSrc ? (
            <button
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-[12px] font-medium hover:bg-secondary"
              onClick={() => setPreview({ type: "live" })}
              type="button"
            >
              ახლანდელი ყდა
            </button>
          ) : null}
        </div>
        {covers.split ? (
          <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
            დესკტოპისა და მობილურის ყდა განსხვავებულია — ბარათზე ეწერება, რომელი
            რომელია. ტაბლეტი მობილურის ყდას იყენებს. თვალის ღილაკით ნებისმიერ
            ფოტოს ყდად სცადე.
          </p>
        ) : covers.desktopSrc ? (
          <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
            თვალის ღილაკით ნახე, როგორ გამოჩნდება ფოტო ყდად დესკტოპზე, ტაბლეტსა
            და მობილურზე.
          </p>
        ) : (
          <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
            თვალის ღილაკით ნახე, როგორ გამოჩნდება ფოტო ყდად.
          </p>
        )}
        {covers.split &&
        !photos.some((item) => item.src === covers.mobileSrc) ? (
          <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
            მობილური ყდა გალერეის სიაში არ არის — პრევიუში მაინც ნახავ.
          </p>
        ) : null}
        {photos.length > 1 ? (
          <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
            გადაათრიე ან ისრებით შეცვალე რიგი. ეს გალერეის ინდექსია, არა ყდის
            image / mobileImage. შენახვა ხსნის PR-ს — ლოკალური ბრენჩი არ
            იცვლება.
          </p>
        ) : null}
        {photos.length === 0 ? (
          <p className="mt-4 text-[14px] text-muted-foreground">ცარიელია</p>
        ) : (
          <AdminGalleryReorder
            covers={covers}
            disabled={saving}
            onPreview={(src) => setPreview({ src, type: "photo" })}
            onReorder={setPhotos}
            photos={photos}
          />
        )}
        <AdminCoverPreview
          commonName={commonName}
          covers={covers}
          onClose={() => setPreview(null)}
          onSelect={setPreview}
          photos={photos}
          preview={preview}
          scientificName={scientificName}
        />
        {photos.length > 1 ? (
          <button
            className="mt-4 h-11 rounded-lg bg-foreground px-4 text-[14px] font-medium text-background disabled:opacity-50"
            disabled={saving || !dirty}
            onClick={() => void onSaveOrder()}
            type="button"
          >
            {busy === "reorder" ? "ინახება…" : "რიგის შენახვა"}
          </button>
        ) : null}
      </section>

      <form
        className="rounded-xl border border-border bg-card p-5"
        onSubmit={onSubmit}
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
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif,image/avif"
            className="mt-1.5 block w-full text-[13px]"
            multiple
            name="photos"
            required
            type="file"
          />
        </label>
        <label className="mt-4 block text-[12px] text-muted-foreground">
          ფოტოგრაფი
          <input
            className="mt-1.5 h-10 w-full rounded-md border border-border bg-background px-3 text-[14px] text-foreground outline-none focus:border-primary"
            name="photographer"
          />
        </label>
        <label className="mt-3 block text-[12px] text-muted-foreground">
          ფოტოგრაფი (EN)
          <input
            className="mt-1.5 h-10 w-full rounded-md border border-border bg-background px-3 text-[14px] text-foreground outline-none focus:border-primary"
            name="photographerEn"
          />
        </label>
        <label className="mt-3 block text-[12px] text-muted-foreground">
          ადგილი
          <input
            className="mt-1.5 h-10 w-full rounded-md border border-border bg-background px-3 text-[14px] text-foreground outline-none focus:border-primary"
            name="location"
          />
        </label>
        <label className="mt-3 block text-[12px] text-muted-foreground">
          ადგილი (EN)
          <input
            className="mt-1.5 h-10 w-full rounded-md border border-border bg-background px-3 text-[14px] text-foreground outline-none focus:border-primary"
            name="locationEn"
          />
        </label>
        <label className="mt-3 block text-[12px] text-muted-foreground">
          თარიღი
          <input
            className="mt-1.5 h-10 w-full rounded-md border border-border bg-background px-3 text-[14px] text-foreground outline-none focus:border-primary"
            name="date"
            type="date"
          />
        </label>
        {error ? (
          <p className="mt-4 text-[13px] text-destructive">{error}</p>
        ) : null}
        {ok ? <p className="mt-4 text-[13px] text-primary">{ok}</p> : null}
        {pullRequestUrl ? (
          <a
            className="mt-2 inline-block text-[13px] break-all text-primary underline"
            href={pullRequestUrl}
            rel="noreferrer"
            target="_blank"
          >
            {pullRequestUrl}
          </a>
        ) : null}
        <button
          className="mt-5 h-11 w-full rounded-lg bg-foreground text-[14px] font-medium text-background disabled:opacity-50"
          disabled={saving}
          type="submit"
        >
          {busy === "upload" ? "იტვირთება…" : "ატვირთვა"}
        </button>
      </form>
    </div>
  );
}
