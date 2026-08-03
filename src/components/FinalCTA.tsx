"use client";

import { Reveal } from "@/components/Reveal";
import { images } from "@/data/species";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export function FinalCTA() {
  return (
    <section className="relative flex min-h-[85svh] items-center overflow-hidden bg-ink">
      <Image
        src={images.cta}
        alt="Misty Caucasus mountain ridge at dusk"
        fill
        sizes="100vw"
        className="scale-125 object-cover"
        style={{ transform: "translateY(-10%) scale(1.25)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/85" />
      <div className="relative mx-auto w-full max-w-[1400px] px-6 text-center lg:px-10">
        <Reveal>
          <h2 className="mx-auto max-w-4xl font-display text-balance-tight text-[clamp(2.2rem,6vw,5rem)] font-semibold leading-[1.02] text-white">
            Explore the world&apos;s most fascinating creatures.
          </h2>
          <p className="mx-auto mt-7 max-w-md text-[15px] leading-relaxed text-white/60">
            Thousands of species. One quiet, beautiful place to learn about
            them.
          </p>
          <a
            href="#species"
            className="group mt-12 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-[14px] font-medium text-ink transition-transform duration-300 hover:scale-[1.03]"
          >
            Start Exploring
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
