"use client";

import Image from "next/image";
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

import type { GalleryImage, SpeciesFieldRecord } from "@/data/speciesTypes";

import {
  AdminCoverPreview,
  type AdminCoverPreviewState,
} from "@/components/admin/AdminCoverPreview";
import { AdminGalleryReorder } from "@/components/admin/AdminGalleryReorder";
import {
  adminCoverRoles,
  type AdminCovers,
  type CoverTarget,
  resolveAdminCovers,
} from "@/lib/adminCover";

type AdminBusyState =
  | "coordinates"
  | "cover"
  | "fieldRecord"
  | "idle"
  | "inaturalist"
  | "remove"
  | "reorder"
  | "upload";

type Props = {
  commonName: string;
  fieldRecords: SpeciesFieldRecord[];
  gallery: GalleryImage[];
  id: string;
  image: string;
  mobileImage: string;
  scientificName: string;
};

export function AdminSpeciesEditor({
  commonName,
  fieldRecords,
  gallery,
  id,
  image,
  mobileImage,
  scientificName,
}: Props) {
  const [busy, setBusy] = useState<AdminBusyState>("idle");
  const [error, setError] = useState<null | string>(null);
  const [ok, setOk] = useState<null | string>(null);
  const [pullRequestUrl, setPullRequestUrl] = useState<null | string>(null);
  const [photos, setPhotos] = useState(() => gallery);
  const [records, setRecords] = useState(() => fieldRecords);
  const [savedSrcs, setSavedSrcs] = useState(() =>
    gallery.map((item) => item.src),
  );
  const [coverOverride, setCoverOverride] = useState<null | {
    desktop: string;
    mobile: string;
  }>(null);
  const [preview, setPreview] = useState<AdminCoverPreviewState | null>(null);
  const [inaturalistUrl, setInaturalistUrl] = useState("");
  const [importedPhoto, setImportedPhoto] = useState<null | {
    file: File;
    license: string;
    previewUrl: string;
  }>(null);
  const [selectedPhotoPreviews, setSelectedPhotoPreviews] = useState<
    Array<{ name: string; url: string }>
  >([]);
  const busyRef = useRef(false);
  const uploadFormRef = useRef<HTMLFormElement>(null);
  const dirty =
    photos.map((item) => item.src).join("\0") !== savedSrcs.join("\0");
  const saving = busy !== "idle";
  const covers = resolveAdminCovers(
    coverOverride?.desktop ?? image,
    coverOverride?.mobile ?? mobileImage,
  );

  useEffect(() => {
    return () => {
      if (importedPhoto) URL.revokeObjectURL(importedPhoto.previewUrl);
    };
  }, [importedPhoto]);

  useEffect(() => {
    return () => {
      selectedPhotoPreviews.forEach((photo) => URL.revokeObjectURL(photo.url));
    };
  }, [selectedPhotoPreviews]);

  async function onImportPhoto(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy("inaturalist");
    setError(null);
    setOk(null);
    setImportedPhoto(null);
    try {
      const response = await fetch("/api/admin/inaturalist-photo", {
        body: JSON.stringify({ url: inaturalistUrl }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      if (!response.ok) {
        const result = (await response.json()) as { error?: string };
        throw new Error(result.error ?? "iNaturalist-ის ფოტო ვერ მოიძებნა");
      }
      const result = await response.formData();
      const file = result.get("photo");
      const rawMetadata = result.get("metadata");
      if (!(file instanceof File) || typeof rawMetadata !== "string") {
        throw new Error("iNaturalist-ის პასუხი არასრულია");
      }
      const metadata = JSON.parse(rawMetadata) as {
        date: string;
        georgiaField: boolean;
        lat: number | string;
        license: string;
        lng: number | string;
        location: string;
        photographer: string;
        url: string;
      };
      const form = uploadFormRef.current;
      if (!form) throw new Error("ატვირთვის ფორმა ვერ მოიძებნა");
      for (const [name, value] of Object.entries({
        date: metadata.date,
        lat: String(metadata.lat),
        lng: String(metadata.lng),
        location: metadata.location,
        locationEn: metadata.location,
        photographer: metadata.photographer,
        photographerEn: metadata.photographer,
        url: metadata.url,
      })) {
        const field = form.elements.namedItem(name);
        if (field instanceof HTMLInputElement) field.value = value;
      }
      const georgiaField = form.elements.namedItem("georgiaField");
      if (georgiaField instanceof HTMLInputElement) {
        georgiaField.checked = metadata.georgiaField;
      }
      const photoInput = form.elements.namedItem("photos");
      if (photoInput instanceof HTMLInputElement) photoInput.value = "";
      setSelectedPhotoPreviews([]);
      setImportedPhoto({
        file,
        license: metadata.license,
        previewUrl: URL.createObjectURL(file),
      });
      setOk(
        "პირველი ფოტო და დაკვირვების მონაცემები ატვირთვის ფორმაში ჩაიწერა.",
      );
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "iNaturalist-ის ფოტო ვერ მოიძებნა",
      );
    } finally {
      busyRef.current = false;
      setBusy("idle");
    }
  }

  async function onSetCover(src: string, target: CoverTarget) {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy("cover");
    setError(null);
    setOk(null);
    try {
      const response = await fetch("/api/admin/photos/cover", {
        body: JSON.stringify({ id, src, target }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const payload = (await response.json()) as {
        error?: string;
        pullRequestUrl?: string;
      };
      if (!response.ok) {
        throw new Error(payload.error ?? "ყდა ვერ შეინახა");
      }
      setCoverOverride((current) => {
        let desktop = current?.desktop ?? image;
        let mobile = current?.mobile ?? mobileImage;
        if (target === "desktop" || target === "both") {
          desktop = src;
        }
        if (target === "mobile" || target === "both") {
          mobile = src;
        }
        return { desktop, mobile };
      });
      if (payload.pullRequestUrl) {
        setPullRequestUrl(payload.pullRequestUrl);
        setOk("ყდა PR-შია. Merge შენზეა.");
      } else {
        setOk("ყდა PR-შია.");
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "ყდა ვერ შეინახა");
    } finally {
      busyRef.current = false;
      setBusy("idle");
    }
  }

  async function onRemove(src: string) {
    if (busyRef.current || photos.length < 2) return;
    const roles = adminCoverRoles(src, covers);
    const confirmed = window.confirm(
      roles.length > 0
        ? "ეს ყდის ფოტოა. გალერეიდან წაიშლება და ყდა სხვა ფოტოზე გადავა. გავაგრძელოთ?"
        : "ფოტო გალერეიდან წაიშალოს?",
    );
    if (!confirmed) return;
    busyRef.current = true;
    setBusy("remove");
    setError(null);
    setOk(null);
    try {
      const response = await fetch("/api/admin/photos/remove", {
        body: JSON.stringify({ id, src }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const payload = (await response.json()) as {
        error?: string;
        image?: string;
        mobileImage?: string;
        pullRequestUrl?: string;
      };
      if (!response.ok) {
        throw new Error(payload.error ?? "ფოტო ვერ წაიშალა");
      }
      setPhotos((current) => current.filter((item) => item.src !== src));
      setSavedSrcs((current) => current.filter((item) => item !== src));
      if (typeof payload.image === "string") {
        setCoverOverride({
          desktop: payload.image,
          mobile:
            typeof payload.mobileImage === "string"
              ? payload.mobileImage
              : payload.image,
        });
      }
      if (payload.pullRequestUrl) {
        setPullRequestUrl(payload.pullRequestUrl);
        setOk("ფოტო გალერეიდან PR-შია. Merge შენზეა.");
      } else {
        setOk("ფოტო გალერეიდან PR-შია.");
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "ფოტო ვერ წაიშალა");
    } finally {
      busyRef.current = false;
      setBusy("idle");
    }
  }

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
      if (
        importedPhoto &&
        !body
          .getAll("photos")
          .some((item) => item instanceof File && item.size > 0)
      ) {
        body.delete("photos");
        body.append("photos", importedPhoto.file);
      }
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
      setImportedPhoto(null);
      setSelectedPhotoPreviews([]);
      setInaturalistUrl("");
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "ატვირთვა ვერ მოხერხდა",
      );
    } finally {
      busyRef.current = false;
      setBusy("idle");
    }
  }

  async function onFieldRecordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busyRef.current) return;
    busyRef.current = true;
    const form = event.currentTarget;
    setBusy("fieldRecord");
    setError(null);
    setOk(null);
    setPullRequestUrl(null);
    try {
      const body = Object.fromEntries(new FormData(form).entries());
      const response = await fetch("/api/admin/field-records", {
        body: JSON.stringify({ ...body, id }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const payload = (await response.json()) as {
        error?: string;
        pullRequestUrl?: string;
        record?: SpeciesFieldRecord;
      };
      if (!response.ok) {
        throw new Error(payload.error ?? "ლოკაციის ჩანაწერი ვერ შეინახა");
      }
      if (payload.record) {
        setRecords((current) =>
          [...current, payload.record as SpeciesFieldRecord].sort((a, b) =>
            (b.date ?? "").localeCompare(a.date ?? ""),
          ),
        );
      }
      if (payload.pullRequestUrl) {
        setPullRequestUrl(payload.pullRequestUrl);
        setOk("ლოკაციის ჩანაწერი PR-შია. Merge შენზეა.");
      } else {
        setOk("ლოკაციის ჩანაწერი PR-შია.");
      }
      form.reset();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "ლოკაციის ჩანაწერი ვერ შეინახა",
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

  async function onSaveCoordinates(
    src: string,
    input: { clear?: boolean; lat: string; lng: string },
  ) {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy("coordinates");
    setError(null);
    setOk(null);
    try {
      const response = await fetch("/api/admin/photos/coordinates", {
        body: JSON.stringify({
          clear: Boolean(input.clear),
          id,
          lat: input.lat,
          lng: input.lng,
          src,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const payload = (await response.json()) as {
        credit?: { lat?: number; lng?: number };
        error?: string;
        pullRequestUrl?: string;
      };
      if (!response.ok) {
        throw new Error(payload.error ?? "კოორდინატები ვერ შეინახა");
      }
      setPhotos((current) =>
        current.map((item) => {
          if (item.src !== src) return item;
          const credit = { ...(item.credit ?? {}) };
          delete credit.lat;
          delete credit.lng;
          if (
            typeof payload.credit?.lat === "number" &&
            typeof payload.credit?.lng === "number"
          ) {
            credit.lat = payload.credit.lat;
            credit.lng = payload.credit.lng;
          }
          return Object.keys(credit).length > 0
            ? { credit, src: item.src }
            : { src: item.src };
        }),
      );
      if (payload.pullRequestUrl) {
        setPullRequestUrl(payload.pullRequestUrl);
        setOk(
          input.clear
            ? "კოორდინატები წაიშალა PR-ში. Merge შენზეა."
            : "კოორდინატები PR-შია. Merge შენზეა.",
        );
      } else {
        setOk("კოორდინატები PR-შია.");
      }
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "კოორდინატები ვერ შეინახა",
      );
    } finally {
      busyRef.current = false;
      setBusy("idle");
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <AdminGalleryPanel
        busy={busy}
        commonName={commonName}
        covers={covers}
        dirty={dirty}
        onPreview={(src) => setPreview({ src, type: "photo" })}
        onRemove={(src) => void onRemove(src)}
        onReorder={setPhotos}
        onSaveCoordinates={(src, input) => void onSaveCoordinates(src, input)}
        onSaveOrder={() => void onSaveOrder()}
        onSelectLive={() => setPreview({ type: "live" })}
        onSetCover={(src, target) => void onSetCover(src, target)}
        photos={photos}
        preview={preview}
        saving={saving}
        scientificName={scientificName}
        setPreview={setPreview}
      />

      <div className="grid gap-5">
        <form
          className="rounded-xl border border-border bg-card p-5"
          onSubmit={onImportPhoto}
        >
          <h2 className="font-display text-lg font-medium">
            iNaturalist-იდან ფოტოს წამოღება
          </h2>
          <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
            ჩასვი დაკვირვების URL. პირველი ფოტო და მისი მონაცემები ქვემოთ
            ატვირთვის ფორმაში ჩაიწერება; CDN-ზე ატვირთვა ცალკე ღილაკით ხდება.
            დამალული კოორდინატები ავტომატურად არ ივსება.
          </p>
          <label className="mt-4 block text-[12px] text-muted-foreground">
            დაკვირვების URL
            <input
              className="mt-1.5 h-10 w-full rounded-md border border-border bg-background px-3 text-[14px] text-foreground outline-none focus:border-primary"
              disabled={saving}
              onChange={(event) => {
                setInaturalistUrl(event.target.value);
                setImportedPhoto(null);
              }}
              placeholder="https://www.inaturalist.org/observations/123456"
              required
              type="url"
              value={inaturalistUrl}
            />
          </label>
          <button
            className="mt-4 h-10 rounded-lg border border-border px-4 text-[13px] font-medium disabled:opacity-50"
            disabled={saving}
            type="submit"
          >
            {busy === "inaturalist" ? "მოაქვს…" : "პირველი ფოტოს წამოღება"}
          </button>
          {importedPhoto ? (
            <div className="mt-4 flex items-center gap-4 rounded-lg border border-border p-3">
              <Image
                alt="iNaturalist-ის პირველი ფოტო"
                className="size-24 rounded-md object-cover"
                height={96}
                src={importedPhoto.previewUrl}
                unoptimized
                width={96}
              />
              <div className="min-w-0 text-[12px] text-muted-foreground">
                <p className="break-all text-foreground">
                  {importedPhoto.file.name}
                </p>
                <p>ლიცენზია: {importedPhoto.license}</p>
              </div>
            </div>
          ) : null}
        </form>
        <form
          className="rounded-xl border border-border bg-card p-5"
          onSubmit={onSubmit}
          ref={uploadFormRef}
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
              onChange={(event) => {
                setImportedPhoto(null);
                setSelectedPhotoPreviews(
                  Array.from(event.currentTarget.files ?? [], (file) => ({
                    name: file.name,
                    url: URL.createObjectURL(file),
                  })),
                );
              }}
              required={!importedPhoto}
              type="file"
            />
          </label>
          {selectedPhotoPreviews.length > 0 ? (
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {selectedPhotoPreviews.map((photo) => (
                <li className="min-w-0" key={photo.url}>
                  <div className="media-placeholder relative aspect-4/3 overflow-hidden rounded-lg">
                    <Image
                      alt={photo.name}
                      className="object-cover"
                      fill
                      sizes="(max-width: 640px) 50vw, 160px"
                      src={photo.url}
                      unoptimized
                    />
                  </div>
                  <p
                    className="mt-1 truncate text-[11px] text-muted-foreground"
                    title={photo.name}
                  >
                    {photo.name}
                  </p>
                </li>
              ))}
            </ul>
          ) : null}
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
            ავტორის URL
            <input
              className="mt-1.5 h-10 w-full rounded-md border border-border bg-background px-3 text-[14px] text-foreground outline-none focus:border-primary"
              name="url"
              type="url"
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
          <div className="mt-3 grid grid-cols-2 gap-2">
            <label className="block text-[12px] text-muted-foreground">
              განედი (lat)
              <input
                className="mt-1.5 h-10 w-full rounded-md border border-border bg-background px-3 text-[14px] text-foreground outline-none focus:border-primary"
                inputMode="decimal"
                name="lat"
                placeholder="41.81667"
              />
            </label>
            <label className="block text-[12px] text-muted-foreground">
              გრძედი (lng)
              <input
                className="mt-1.5 h-10 w-full rounded-md border border-border bg-background px-3 text-[14px] text-foreground outline-none focus:border-primary"
                inputMode="decimal"
                name="lng"
                placeholder="45.35000"
              />
            </label>
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
            ორივე ველი ერთად. საიტზე რუკის ბმული და GeoCoordinates schema.
            იშვიათი სახეობის ზუსტი ბუნაგი ნუ მიუთითო — ადგილის დონე საკმარისია.
          </p>
          <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-[13px] text-foreground">
            <input
              className="mt-0.5 size-4 shrink-0 accent-primary"
              name="georgiaField"
              type="checkbox"
              value="1"
            />
            <span>
              <span className="font-medium">საქართველოს ველში</span>
              <span className="mt-0.5 block text-[12px] leading-relaxed text-muted-foreground">
                მონიშნე მხოლოდ თუ საქართველოშია გადაღებული და ადგილი იცი. თუ არა
                — უცხოეთი / ტიპური არეალი რჩება, ბეიჯი არ გამოჩნდება.
              </span>
            </span>
          </label>
          <label className="mt-3 block text-[12px] text-muted-foreground">
            თარიღი
            <input
              className="mt-1.5 h-10 w-full rounded-md border border-border bg-background px-3 text-[14px] text-foreground outline-none focus:border-primary"
              name="date"
              type="date"
            />
          </label>
          <button
            className="mt-5 h-11 w-full rounded-lg bg-foreground text-[14px] font-medium text-background disabled:opacity-50"
            disabled={saving}
            type="submit"
          >
            {busy === "upload" ? "იტვირთება…" : "ატვირთვა"}
          </button>
        </form>

        <FieldRecordsPanel
          busy={busy}
          onSubmit={onFieldRecordSubmit}
          records={records}
          saving={saving}
        />

        {error ? <p className="text-[13px] text-destructive">{error}</p> : null}
        {ok ? <p className="text-[13px] text-primary">{ok}</p> : null}
        {pullRequestUrl ? (
          <a
            className="inline-block text-[13px] break-all text-primary underline"
            href={pullRequestUrl}
            rel="noreferrer"
            target="_blank"
          >
            {pullRequestUrl}
          </a>
        ) : null}
      </div>
    </div>
  );
}

function AdminGalleryPanel({
  busy,
  commonName,
  covers,
  dirty,
  onPreview,
  onRemove,
  onReorder,
  onSaveCoordinates,
  onSaveOrder,
  onSelectLive,
  onSetCover,
  photos,
  preview,
  saving,
  scientificName,
  setPreview,
}: {
  busy: AdminBusyState;
  commonName: string;
  covers: AdminCovers;
  dirty: boolean;
  onPreview: (src: string) => void;
  onRemove: (src: string) => void;
  onReorder: Dispatch<SetStateAction<GalleryImage[]>>;
  onSaveCoordinates: (
    src: string,
    input: { clear?: boolean; lat: string; lng: string },
  ) => void;
  onSaveOrder: () => void;
  onSelectLive: () => void;
  onSetCover: (src: string, target: CoverTarget) => void;
  photos: GalleryImage[];
  preview: AdminCoverPreviewState | null;
  saving: boolean;
  scientificName: string;
  setPreview: Dispatch<SetStateAction<AdminCoverPreviewState | null>>;
}) {
  return (
    <section>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="font-display text-lg font-medium">გალერეა</h2>
        {covers.desktopSrc ? (
          <button
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-[12px] font-medium hover:bg-secondary"
            onClick={onSelectLive}
            type="button"
          >
            ახლანდელი ყდა
          </button>
        ) : null}
      </div>
      <GalleryHelp covers={covers} photos={photos} />
      {photos.length === 0 ? (
        <p className="mt-4 text-[14px] text-muted-foreground">ცარიელია</p>
      ) : (
        <AdminGalleryReorder
          covers={covers}
          disabled={saving}
          onPreview={onPreview}
          onRemove={onRemove}
          onReorder={onReorder}
          onSaveCoordinates={onSaveCoordinates}
          onSetCover={onSetCover}
          photos={photos}
        />
      )}
      <AdminCoverPreview
        commonName={commonName}
        covers={covers}
        onClose={() => setPreview(null)}
        onSelect={(next) => setPreview(next)}
        photos={photos}
        preview={preview}
        scientificName={scientificName}
      />
      {photos.length > 1 ? (
        <button
          className="mt-4 h-11 rounded-lg bg-foreground px-4 text-[14px] font-medium text-background disabled:opacity-50"
          disabled={saving || !dirty}
          onClick={onSaveOrder}
          type="button"
        >
          {busy === "reorder" ? "ინახება…" : "რიგის შენახვა"}
        </button>
      ) : null}
      {busy === "cover" ? (
        <p className="mt-4 text-[13px] text-primary">ყდა ინახება…</p>
      ) : null}
      {busy === "remove" ? (
        <p className="mt-4 text-[13px] text-primary">იშლება…</p>
      ) : null}
      {busy === "coordinates" ? (
        <p className="mt-4 text-[13px] text-primary">კოორდინატები ინახება…</p>
      ) : null}
    </section>
  );
}

function FieldRecordsPanel({
  busy,
  onSubmit,
  records,
  saving,
}: {
  busy: AdminBusyState;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  records: SpeciesFieldRecord[];
  saving: boolean;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h2 className="font-display text-lg font-medium">ლოკაციის ჩანაწერები</h2>
      <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
        გამოიყენე მაშინ, როცა სახეობა რეალურად დაფიქსირებულია, მაგრამ ფოტო არ
        გვაქვს ან გამოსაქვეყნებლად არ ვარგა. ეს გალერეაში ფოტოს არ ამატებს.
      </p>
      {records.length > 0 ? (
        <ul className="mt-4 grid gap-2">
          {records.map((record) => (
            <li
              className="rounded-lg border border-border/70 bg-background p-3 text-[12px] leading-relaxed"
              key={`${record.locality}-${record.lat}-${record.lng}-${record.date ?? ""}`}
            >
              <p className="font-medium text-foreground">{record.locality}</p>
              <p className="mt-1 text-muted-foreground">
                {[
                  record.date,
                  record.observerName ?? record.observer,
                  record.source,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <p className="mt-1 text-muted-foreground">
                {record.lat}, {record.lng}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-[13px] text-muted-foreground">
          ცალკე ლოკაციის ჩანაწერი ჯერ არ არის.
        </p>
      )}
      <form className="mt-5 border-t border-border pt-5" onSubmit={onSubmit}>
        <label className="block text-[12px] text-muted-foreground">
          ლოკაცია
          <input
            className="mt-1.5 h-10 w-full rounded-md border border-border bg-background px-3 text-[14px] text-foreground outline-none focus:border-primary"
            name="locality"
            required
          />
        </label>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <label className="block text-[12px] text-muted-foreground">
            განედი
            <input
              className="mt-1.5 h-10 w-full rounded-md border border-border bg-background px-3 text-[14px] text-foreground outline-none focus:border-primary"
              inputMode="decimal"
              name="lat"
              placeholder="41.81667"
              required
            />
          </label>
          <label className="block text-[12px] text-muted-foreground">
            გრძედი
            <input
              className="mt-1.5 h-10 w-full rounded-md border border-border bg-background px-3 text-[14px] text-foreground outline-none focus:border-primary"
              inputMode="decimal"
              name="lng"
              placeholder="45.35000"
              required
            />
          </label>
        </div>
        <label className="mt-3 block text-[12px] text-muted-foreground">
          დამკვირვებლის საჯარო სახელი
          <input
            className="mt-1.5 h-10 w-full rounded-md border border-border bg-background px-3 text-[14px] text-foreground outline-none focus:border-primary"
            name="observerName"
          />
        </label>
        <label className="mt-3 block text-[12px] text-muted-foreground">
          დამკვირვებლის username
          <input
            className="mt-1.5 h-10 w-full rounded-md border border-border bg-background px-3 text-[14px] text-foreground outline-none focus:border-primary"
            name="observer"
          />
        </label>
        <label className="mt-3 block text-[12px] text-muted-foreground">
          წყარო / დადასტურება
          <input
            className="mt-1.5 h-10 w-full rounded-md border border-border bg-background px-3 text-[14px] text-foreground outline-none focus:border-primary"
            name="source"
          />
        </label>
        <label className="mt-3 block text-[12px] text-muted-foreground">
          წყაროს URL
          <input
            className="mt-1.5 h-10 w-full rounded-md border border-border bg-background px-3 text-[14px] text-foreground outline-none focus:border-primary"
            name="url"
            type="url"
          />
        </label>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <label className="block text-[12px] text-muted-foreground">
            თარიღი
            <input
              className="mt-1.5 h-10 w-full rounded-md border border-border bg-background px-3 text-[14px] text-foreground outline-none focus:border-primary"
              name="date"
              type="date"
            />
          </label>
          <label className="block text-[12px] text-muted-foreground">
            ტიპი
            <select
              className="mt-1.5 h-10 w-full rounded-md border border-border bg-background px-3 text-[14px] text-foreground outline-none focus:border-primary"
              defaultValue="observation"
              name="evidence"
            >
              <option value="observation">დაკვირვება</option>
              <option value="specimen">ნიმუში</option>
              <option value="literature">ლიტერატურა</option>
            </select>
          </label>
        </div>
        <label className="mt-3 block text-[12px] text-muted-foreground">
          შენიშვნა
          <textarea
            className="mt-1.5 min-h-20 w-full rounded-md border border-border bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary"
            name="note"
          />
        </label>
        <button
          className="mt-5 h-11 w-full rounded-lg bg-foreground text-[14px] font-medium text-background disabled:opacity-50"
          disabled={saving}
          type="submit"
        >
          {busy === "fieldRecord" ? "ინახება…" : "ლოკაციის დამატება"}
        </button>
      </form>
    </section>
  );
}

function GalleryHelp({
  covers,
  photos,
}: {
  covers: AdminCovers;
  photos: GalleryImage[];
}) {
  const coverHint = covers.split
    ? "დესკტოპისა და მობილურის ყდა განსხვავებულია — ბარათზე ეწერება, რომელი რომელია. ტაბლეტი მობილურის ყდას იყენებს. მენიუდან ყდად დაყენება ან თვალის ღილაკით სცადე."
    : covers.desktopSrc
      ? "მენიუდან დაყენე დესკტოპის, მობილურის ან ორივეს ყდა. თვალის ღილაკით ნახე, როგორ გამოჩნდება ფოტო ყდად დესკტოპზე, ტაბლეტსა და მობილურზე."
      : "მენიუდან დაყენე ყდა. თვალის ღილაკით ნახე, როგორ გამოჩნდება ფოტო ყდად.";
  const mobileMissing =
    covers.split && !photos.some((item) => item.src === covers.mobileSrc);

  return (
    <>
      <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
        {coverHint}
      </p>
      {photos.length > 0 ? (
        <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
          ყდად დაყენება ან წაშლა ხსნის PR-ს — ლოკალური ბრენჩი არ იცვლება. წაშლა
          გალერეიდან იშლება, ფაილი CDN-ზე რჩება.
        </p>
      ) : null}
      {mobileMissing ? (
        <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
          მობილური ყდა გალერეის სიაში არ არის — პრევიუში მაინც ნახავ.
        </p>
      ) : null}
      {photos.length > 1 ? (
        <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
          გადაათრიე ან ისრებით შეცვალე რიგი. ეს გალერეის ინდექსია, არა ყდის
          image / mobileImage. კოორდინატები ფოტოს ბარათიდანაც ინახება (PR).
        </p>
      ) : null}
    </>
  );
}
