"use client";

import { Reveal } from "@/components/Reveal";
import { useLocale } from "@/i18n/LocaleProvider";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type SpeciesGalleryProps = {
  images: string[];
  name: string;
  tone?: "background" | "surface";
};

export function SpeciesGallery({
  images,
  name,
  tone = "background",
}: SpeciesGalleryProps) {
  const { t } = useLocale();
  const photos = images.filter(Boolean);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active === null) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowLeft") {
        setActive((current) =>
          current === null
            ? null
            : (current - 1 + photos.length) % photos.length,
        );
      }
      if (event.key === "ArrowRight") {
        setActive((current) =>
          current === null ? null : (current + 1) % photos.length,
        );
      }
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [active, photos.length]);

  if (photos.length === 0) return null;

  return (
    <>
      <section
        className={`py-24 lg:py-32 ${
          tone === "surface" ? "bg-surface" : "bg-background"
        }`}
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
              {t.profile.gallery}
            </p>
            <h2 className="mt-5 font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-[1.05]">
              {name} {t.profile.galleryTitle}
            </h2>
          </Reveal>

          <div
            className={`mt-14 grid gap-3 sm:gap-4 ${
              photos.length === 1
                ? "grid-cols-1"
                : photos.length === 2
                  ? "grid-cols-1 sm:grid-cols-2"
                  : "grid-cols-2 md:grid-cols-3"
            }`}
          >
            {photos.map((src, index) => {
              const featured = photos.length >= 3 && index === 0;
              return (
                <Reveal
                  key={`${src}-${index}`}
                  delay={index * 70}
                  className={featured ? "col-span-2 md:col-span-3" : undefined}
                >
                  <button
                    type="button"
                    onClick={() => setActive(index)}
                    className={`group relative block w-full overflow-hidden rounded-[24px] bg-ink text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
                      featured ? "aspect-[16/10]" : "aspect-[4/5]"
                    }`}
                    aria-label={`${name} — ${t.profile.photo} ${index + 1}`}
                  >
                    <Image
                      src={src}
                      alt={`${name} — ${t.profile.photo} ${index + 1}`}
                      fill
                      sizes={
                        featured
                          ? "100vw"
                          : "(max-width: 768px) 50vw, 33vw"
                      }
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20" />
                    <span className="absolute bottom-4 left-4 font-display text-[13px] text-white/0 group-hover:text-white/80">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </button>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {active !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92"
          role="dialog"
          aria-modal="true"
          aria-label={t.profile.gallery}
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            onClick={() => setActive(null)}
            className="absolute right-5 top-5 z-10 rounded-full border border-white/15 p-2.5 text-white/80 hover:bg-white/10 hover:text-white"
            aria-label={t.profile.close}
          >
            <X className="size-5" />
          </button>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setActive((current) =>
                    current === null
                      ? null
                      : (current - 1 + photos.length) % photos.length,
                  );
                }}
                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/15 p-2.5 text-white/80 hover:bg-white/10 hover:text-white sm:left-6"
                aria-label={t.profile.prevPhoto}
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setActive((current) =>
                    current === null ? null : (current + 1) % photos.length,
                  );
                }}
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/15 p-2.5 text-white/80 hover:bg-white/10 hover:text-white sm:right-6"
                aria-label={t.profile.nextPhoto}
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          )}

          <div
            className="relative mx-auto h-[72svh] w-[min(92vw,1100px)]"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={photos[active]}
              alt={`${name} — ${t.profile.photo} ${active + 1}`}
              fill
              sizes="92vw"
              className="object-contain"
              priority
            />
          </div>

          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[12px] tracking-[0.2em] text-white/45">
            {active + 1} / {photos.length}
          </p>
        </div>
      )}
    </>
  );
}
