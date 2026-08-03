"use client";

import { Reveal } from "@/components/Reveal";
import { SpeciesCard } from "@/components/SpeciesCard";
import { species } from "@/data/species";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function SpeciesCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function onScroll() {
      if (!track) return;
      const max = track.scrollWidth - track.clientWidth;
      setProgress(max > 0 ? (track.scrollLeft / max) * 100 : 0);
    }

    onScroll();
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  function scrollByCard(direction: -1 | 1) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * 400, behavior: "smooth" });
  }

  return (
    <section id="species" className="relative bg-background py-28 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
              რჩეული
            </p>
            <h2 className="mt-5 max-w-2xl font-display text-balance-tight text-[clamp(2rem,4.6vw,3.75rem)] leading-[1.02]">
              ექვსი სახეობა, რომელიც უნდა იცოდე
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              გადაღებული ველურ ბუნებაში. დამოწმებული ბიოლოგების მიერ.
            </p>
          </Reveal>
          <Reveal className="flex items-center gap-3" delay={120}>
            <span className="mr-2 hidden text-[11px] uppercase tracking-[0.2em] text-muted-foreground lg:inline">
              გადაათრიე შესასწავლად
            </span>
            <button
              type="button"
              aria-label="წინა სახეობა"
              onClick={() => scrollByCard(-1)}
              className="flex size-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              type="button"
              aria-label="შემდეგი სახეობა"
              onClick={() => scrollByCard(1)}
              className="flex size-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary"
            >
              <ArrowRight className="size-4" />
            </button>
          </Reveal>
        </div>
        <div className="mt-8 h-px w-full bg-border">
          <div className="h-px bg-primary" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div
        ref={trackRef}
        className="no-scrollbar mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-6 pb-4 lg:px-10"
      >
        <div className="hidden shrink-0 lg:block lg:w-[calc((100vw-1400px)/2)]" />
        {species.map((item) => (
          <div key={item.id} className="snap-start">
            <SpeciesCard species={item} />
          </div>
        ))}
        <div className="w-2 shrink-0" />
      </div>
    </section>
  );
}
