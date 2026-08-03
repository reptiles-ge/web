"use client";

import { images } from "@/data/species";
import { ArrowRight, ScanLine } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const particles = [
  { left: "0%", top: "0%", size: 1 },
  { left: "37%", top: "53%", size: 2 },
  { left: "74%", top: "6%", size: 3 },
  { left: "11%", top: "59%", size: 1 },
  { left: "48%", top: "12%", size: 2 },
  { left: "85%", top: "65%", size: 3 },
  { left: "22%", top: "18%", size: 1 },
  { left: "59%", top: "71%", size: 2 },
  { left: "96%", top: "24%", size: 3 },
  { left: "33%", top: "77%", size: 1 },
  { left: "70%", top: "30%", size: 2 },
  { left: "7%", top: "83%", size: 3 },
  { left: "44%", top: "36%", size: 1 },
  { left: "81%", top: "89%", size: 2 },
  { left: "18%", top: "42%", size: 3 },
  { left: "55%", top: "95%", size: 1 },
  { left: "92%", top: "48%", size: 2 },
  { left: "29%", top: "1%", size: 3 },
  { left: "66%", top: "54%", size: 1 },
  { left: "3%", top: "7%", size: 2 },
  { left: "40%", top: "60%", size: 3 },
  { left: "77%", top: "13%", size: 1 },
];

export function Hero() {
  const [ready, setReady] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    function onScroll() {
      setOffset(window.scrollY);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const heroScale = 1.08 + Math.min(offset, 600) / 3000;
  const particleY = (offset % 120) * 0.35;

  return (
    <section
      id="top"
      className="relative h-[100svh] w-full overflow-hidden bg-ink"
    >
      <div
        className="absolute inset-0"
        style={{ transform: `scale(${heroScale})` }}
      >
        <Image
          src={images.hero}
          alt="Viper coiled on a mossy rock in a misty mountain gorge"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/25 to-black/85" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_20%,transparent_35%,rgba(0,0,0,0.6)_100%)]" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map((particle, index) => (
          <span
            key={index}
            className="absolute rounded-full bg-white/50"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              filter: "blur(0.5px)",
              transform: `translateY(-${particleY * ((index % 5) + 1)}px)`,
            }}
          />
        ))}
      </div>
      <div
        className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col items-center justify-center px-6 text-center lg:px-10"
        style={{
          opacity: ready ? 1 : 0,
          transform: ready ? "none" : "translateY(24px)",
          transition: "opacity 900ms ease, transform 900ms ease",
        }}
      >
        <p className="mb-7 text-[11px] font-medium uppercase tracking-[0.32em] text-white/55">
          A digital encyclopedia of reptiles & amphibians
        </p>
        <h1 className="font-display max-w-5xl text-balance-tight text-[clamp(2.6rem,7.2vw,6.2rem)] font-semibold leading-[0.98] text-white">
          Discover Earth&apos;s Ancient Creatures
        </h1>
        <p className="mt-7 max-w-xl text-balance-tight text-[15px] leading-relaxed text-white/70 sm:text-[17px]">
          Explore thousands of reptiles through science, photography, and
          technology.
        </p>
        <div className="mt-12 flex flex-col items-center gap-3 sm:flex-row">
          <a
            href="#species"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[14px] font-medium text-ink transition-transform duration-300 hover:scale-[1.03]"
          >
            Explore Species
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <a
            href="#identify"
            className="group inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-[14px] font-medium text-white/90 backdrop-blur-md transition-all duration-300 hover:border-white/50 hover:bg-white/10"
          >
            <ScanLine className="size-4" />
            Identify a Reptile
          </a>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-3">
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
          Scroll
        </span>
        <div className="h-8 w-px animate-pulse bg-gradient-to-b from-white/60 to-transparent" />
      </div>
    </section>
  );
}
