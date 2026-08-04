"use client";

import { SpeciesDanger } from "@/components/SpeciesDanger";
import type { Species } from "@/data/species";
import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type SpeciesCardProps = {
  species: Species;
};

export function SpeciesCard({ species }: SpeciesCardProps) {
  const cover = species.mobileImage ?? species.image;

  return (
    <Link
      href={`/species/${species.id}`}
      className="group relative block h-[560px] w-[320px] shrink-0 overflow-hidden rounded-[28px] bg-ink sm:w-[380px]"
    >
      <Image
        src={cover}
        alt={`${species.commonName} — ${species.scientificName}`}
        fill
        quality={90}
        sizes="(max-width: 640px) 320px, 380px"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
      <div className="absolute inset-x-5 top-5 flex justify-end">
        <span className="glass-card rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/85">
          {species.genus}
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-6">
        <div className="glass-card rounded-3xl p-5 transition-all duration-500 group-hover:-translate-y-1">
          <p className="text-[11px] italic tracking-wide text-white/55">
            {species.scientificName}
          </p>
          <h3 className="mt-1.5 font-display text-[26px] font-semibold leading-tight text-white">
            {species.commonName}
          </h3>
          <div className="mt-3 flex items-center gap-1.5 text-[12px] text-white/60">
            <MapPin className="size-3.5" aria-hidden="true" />
            {species.location}
          </div>
          <p className="mt-4 max-h-0 overflow-hidden text-[13px] leading-relaxed text-white/70 opacity-0 transition-all duration-500 group-hover:max-h-32 group-hover:opacity-100">
            {species.description}
          </p>
          <SpeciesDanger level={species.danger} variant="card" />
        </div>
      </div>
    </Link>
  );
}
