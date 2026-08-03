"use client";

import { Reveal } from "@/components/Reveal";
import { species } from "@/data/species";
import { CloudUpload, Sparkles } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export function AIUploadPreview() {
  const [scanTop, setScanTop] = useState(20);

  useEffect(() => {
    const start = performance.now();
    let frame = 0;

    function animate(now: number) {
      const t = ((now - start) % 3200) / 3200;
      setScanTop(18 + t * 64);
      frame = requestAnimationFrame(animate);
    }

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section
      id="identify"
      className="relative overflow-hidden bg-background py-28 lg:py-40"
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--primary)_10%,transparent)_0%,transparent_65%)]" />
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
            AI Identification
          </p>
          <h2 className="mt-6 font-display text-balance-tight text-[clamp(2.1rem,5vw,4rem)] leading-[1.02]">
            Point. Upload. Know.
          </h2>
          <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground">
            Our vision model compares your photo against a reference library of
            scientific imagery.
          </p>
        </Reveal>
        <div className="mx-auto mt-20 grid max-w-5xl gap-6 md:grid-cols-2">
          <Reveal>
            <div className="group flex h-full min-h-[380px] flex-col items-center justify-center rounded-[32px] border border-dashed border-border bg-card/60 p-10 text-center transition-colors duration-500 hover:border-primary/50">
              <div className="flex size-16 items-center justify-center rounded-3xl bg-secondary text-muted-foreground transition-colors duration-500 group-hover:bg-primary/10 group-hover:text-primary">
                <CloudUpload className="size-6" strokeWidth={1.5} />
              </div>
              <p className="mt-8 text-[19px] font-medium">Drop a photo here</p>
              <p className="mt-2 text-[13px] text-muted-foreground">
                JPG, PNG or HEIC — up to 20 MB
              </p>
              <div className="mt-8 h-px w-24 bg-border" />
              <p className="mt-8 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Preview only. Always consult an expert before approaching
                wildlife.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative h-full min-h-[380px] overflow-hidden rounded-[32px] bg-ink p-8">
              <Image
                src={species[0].image}
                alt="Analyzed reptile photograph"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover opacity-45"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
              <div
                className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
                style={{ top: `${scanTop}%` }}
              />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/60">
                  <Sparkles className="size-3.5 text-gold" />
                  Analyzing scale pattern…
                </div>
                <div className="glass-card mt-10 rounded-3xl p-7">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/50">
                    Possible match
                  </p>
                  <p className="mt-3 font-display text-[30px] font-semibold italic leading-tight text-white">
                    Vipera dinniki
                  </p>
                  <div className="mt-7 flex items-center justify-between text-[12px] text-white/60">
                    <span className="uppercase tracking-[0.2em]">
                      Confidence
                    </span>
                    <span className="font-display text-[22px] font-semibold text-white">
                      94%
                    </span>
                  </div>
                  <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/15">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-gold"
                      style={{ width: "94%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
