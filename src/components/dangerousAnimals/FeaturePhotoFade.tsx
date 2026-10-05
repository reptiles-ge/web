"use client";

import { useEffect } from "react";

export function FeaturePhotoFade() {
  useEffect(() => {
    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          delete element.dataset.photoReady;
          observer.unobserve(element);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
    );
    const photos = document.querySelectorAll<HTMLElement>(
      "[data-feature-photo]",
    );
    for (const photo of photos) {
      if (photo.getBoundingClientRect().top <= window.innerHeight * 0.88) {
        continue;
      }
      photo.dataset.photoReady = "false";
      observer.observe(photo);
    }
    return () => {
      observer.disconnect();
      for (const photo of photos) delete photo.dataset.photoReady;
    };
  }, []);

  return null;
}
