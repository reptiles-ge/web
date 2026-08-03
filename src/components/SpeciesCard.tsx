import { dangerClass, dangerLabels, type Species } from "@/data/species";
import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type SpeciesCardProps = {
  species: Species;
};

export function SpeciesCard({ species }: SpeciesCardProps) {
  return (
    <Link
      href={`/species/${species.id}`}
      className="group relative block h-[560px] w-[320px] shrink-0 overflow-hidden rounded-[28px] bg-ink sm:w-[380px]"
    >
      <Image
        src={species.image}
        alt={`${species.commonName} — ${species.scientificName}`}
        fill
        sizes="380px"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
      <div className="absolute inset-x-5 top-5 flex justify-end">
        <span className="glass-card rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/85">
          {species.genus}
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-6">
        <div className="glass-card rounded-3xl p-5">
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
          <p className="mt-4 line-clamp-2 text-[13px] leading-relaxed text-white/70">
            {species.description}
          </p>
          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
            <span className="text-[10px] tracking-[0.18em] text-white/40">
              საფრთხის დონე
            </span>
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wider ${dangerClass(species.danger)}`}
            >
              {dangerLabels[species.danger]}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
