"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { CoverImage } from "@/components/CoverImage";

type UploadedPhoto = {
  derivatives: Array<{ format: string; url: string; width: number }>;
  filename: string;
  url: string;
};

export function AdminCdnUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<Array<{ file: File; name: string }>>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploaded, setUploaded] = useState<UploadedPhoto[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [pullRequestUrl, setPullRequestUrl] = useState<null | string>(null);

  useEffect(() => {
    return () => previewUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [previewUrls]);

  function selectFiles(selected: File[]) {
    setFiles(selected.map((file) => ({ file, name: "" })));
    setPreviewUrls(selected.map((file) => URL.createObjectURL(file)));
  }

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setMessage("URL დაკოპირებულია");
    } catch {
      setMessage("URL ვერ დაკოპირდა");
    }
  }

  async function upload() {
    if (busy || files.length === 0) return;
    setBusy(true);
    setErrors([]);
    setMessage("");
    setPullRequestUrl(null);
    try {
      const body = new FormData();
      for (const { file, name } of files) {
        body.append("photos", file);
        body.append("names", name);
      }
      const response = await fetch("/api/admin/cdn-upload", {
        body,
        method: "POST",
      });
      const result = (await response.json()) as {
        error?: string;
        errors?: Array<{ filename: string; message: string }>;
        pullRequestError?: string;
        pullRequestUrl?: string;
        uploaded?: UploadedPhoto[];
      };
      if (!response.ok)
        throw new Error(result.error ?? "ატვირთვა ვერ მოხერხდა");
      const added = result.uploaded ?? [];
      setUploaded((current) => [...current, ...added]);
      setErrors([
        ...(result.errors ?? []).map(
          (item) => `${item.filename}: ${item.message}`,
        ),
        ...(result.pullRequestError
          ? [`კატალოგის PR ვერ გაიხსნა: ${result.pullRequestError}`]
          : []),
      ]);
      setPullRequestUrl(result.pullRequestUrl ?? null);
      if (added.length > 0) setMessage(`${added.length} ფოტო აიტვირთა CDN-ზე`);
      setFiles([]);
      setPreviewUrls([]);
      if (inputRef.current) inputRef.current.value = "";
    } catch (error) {
      setErrors([
        error instanceof Error ? error.message : "ატვირთვა ვერ მოხერხდა",
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-xl border border-border bg-card p-5">
        <label
          className={`flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-5 text-center transition-colors ${dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary"}`}
          onDragEnter={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setDragging(false);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            if (busy) return;
            selectFiles(Array.from(event.dataTransfer.files));
          }}
        >
          <span className="font-medium">
            ჩააგდე ფოტოები აქ ან აირჩიე ფაილები
          </span>
          <span className="mt-2 text-[12px] text-muted-foreground">
            JPEG, PNG, WebP, HEIC ან AVIF · მაქსიმუმ 12 MB თითო ფოტო
          </span>
          <input
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif,image/avif"
            className="sr-only"
            disabled={busy}
            multiple
            onChange={(event) =>
              selectFiles(Array.from(event.target.files ?? []))
            }
            ref={inputRef}
            type="file"
          />
        </label>
        {files.length > 0 ? (
          <ul className="mt-4 grid gap-3">
            {files.map(({ file, name }, index) => (
              <li className="min-w-0" key={`${index}-${file.name}`}>
                {previewUrls[index] ? (
                  <div className="media-placeholder relative mb-2 aspect-4/3 max-w-xs overflow-hidden rounded-lg">
                    <Image
                      alt={file.name}
                      className="object-cover"
                      fill
                      sizes="320px"
                      src={previewUrls[index]}
                      unoptimized
                    />
                  </div>
                ) : null}
                <label className="block text-[12px] text-muted-foreground">
                  <span className="block wrap-break-word">
                    Name (არასავალდებულო) — {file.name}
                  </span>
                  <input
                    className="mt-1.5 h-10 w-full rounded-md border border-border bg-background px-3 text-[14px] text-foreground outline-none focus:border-primary"
                    disabled={busy}
                    onChange={(event) =>
                      setFiles((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index
                            ? { ...item, name: event.target.value }
                            : item,
                        ),
                      )
                    }
                    placeholder="ცარიელი = ფაილის საწყისი სახელი"
                    type="text"
                    value={name}
                  />
                </label>
              </li>
            ))}
          </ul>
        ) : null}
        <button
          className="mt-5 h-11 rounded-lg bg-foreground px-6 text-[14px] font-medium text-background disabled:opacity-50"
          disabled={busy || files.length === 0}
          onClick={() => void upload()}
          type="button"
        >
          {busy ? "იტვირთება…" : "CDN-ზე ატვირთვა"}
        </button>
      </div>

      {errors.length > 0 ? (
        <ul className="text-[13px] text-destructive" role="alert">
          {errors.map((error, index) => (
            <li key={`${index}-${error}`}>{error}</li>
          ))}
        </ul>
      ) : null}
      {message ? (
        <p className="text-[13px] text-primary" role="status">
          {message}
        </p>
      ) : null}
      {pullRequestUrl ? (
        <a
          className="text-[13px] break-all text-primary underline"
          href={pullRequestUrl}
          rel="noreferrer"
          target="_blank"
        >
          კატალოგის PR: {pullRequestUrl}
        </a>
      ) : null}

      {uploaded.length > 0 ? (
        <section>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-medium">
              ატვირთული URL-ები
            </h2>
            <button
              className="text-[13px] text-primary underline"
              onClick={() =>
                void copy(uploaded.map((item) => item.url).join("\n"))
              }
              type="button"
            >
              ყველა ძირითადი URL-ის კოპირება
            </button>
          </div>
          <ul className="mt-4 grid gap-4">
            {uploaded.map((item) => (
              <li
                className="min-w-0 rounded-xl border border-border bg-card p-4"
                key={item.url}
              >
                <div className="media-placeholder relative mb-4 aspect-4/3 max-w-xs overflow-hidden rounded-lg">
                  <CoverImage
                    alt={item.filename}
                    className="object-contain"
                    sizes="320px"
                    src={item.url}
                  />
                </div>
                <p className="text-[13px] font-medium wrap-break-word">
                  {item.filename}
                </p>
                <UrlRow label="ძირითადი URL" onCopy={copy} url={item.url} />
                {item.derivatives.length > 0 ? (
                  <details className="mt-3 text-[13px]">
                    <summary className="cursor-pointer text-muted-foreground">
                      AVIF / WebP ზომები ({item.derivatives.length})
                    </summary>
                    <div className="mt-3 grid gap-3">
                      {item.derivatives.map((derivative) => (
                        <UrlRow
                          key={derivative.url}
                          label={`${derivative.width}px ${derivative.format.toUpperCase()}`}
                          onCopy={copy}
                          url={derivative.url}
                        />
                      ))}
                    </div>
                  </details>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function UrlRow({
  label,
  onCopy,
  url,
}: {
  label: string;
  onCopy: (url: string) => Promise<void>;
  url: string;
}) {
  return (
    <div className="mt-2 min-w-0">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <div className="flex flex-wrap items-center gap-2">
        <a
          className="min-w-0 flex-1 text-[12px] break-all text-primary underline"
          href={url}
          rel="noreferrer"
          target="_blank"
        >
          {url}
        </a>
        <button
          className="rounded-md border border-border px-3 py-1.5 text-[12px]"
          onClick={() => void onCopy(url)}
          type="button"
        >
          კოპირება
        </button>
      </div>
    </div>
  );
}
