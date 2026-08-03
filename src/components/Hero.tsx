import { images } from "@/data/species";
import { ArrowRight, ScanLine } from "lucide-react";
import Image from "next/image";

export function Hero() {
  return (
    <section
      id="top"
      className="relative h-[100svh] w-full overflow-hidden bg-ink"
    >
      <div className="absolute inset-0">
        <Image
          src={images.hero}
          alt="გველგესლა ხავსიან კლდეზე ნისლიან მთის ხეობაში"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/25 to-black/85" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_20%,transparent_35%,rgba(0,0,0,0.6)_100%)]" />
      <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col items-center justify-center px-6 text-center lg:px-10">
        <p className="mb-7 text-[11px] font-medium uppercase tracking-[0.32em] text-white/55">
          ქვეწარმავლებისა და ამფიბიების ციფრული ენციკლოპედია
        </p>
        <h1 className="font-display max-w-5xl text-balance-tight text-[clamp(2.6rem,7.2vw,6.2rem)] font-semibold leading-[0.98] text-white">
          აღმოაჩინე დედამიწის უძველესი არსებები
        </h1>
        <p className="mt-7 max-w-xl text-balance-tight text-[15px] leading-relaxed text-white/70 sm:text-[17px]">
          შეისწავლე ათასობით ქვეწარმავალი მეცნიერებით, ფოტოგრაფიითა და
          ტექნოლოგიით.
        </p>
        <div className="mt-12 flex flex-col items-center gap-3 sm:flex-row">
          <a
            href="#species"
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[14px] font-medium text-ink"
          >
            სახეობების ნახვა
            <ArrowRight className="size-4" />
          </a>
          <a
            href="#identify"
            className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-[14px] font-medium text-white/90 backdrop-blur-md hover:border-white/50 hover:bg-white/10"
          >
            <ScanLine className="size-4" />
            ქვეწარმავლის იდენტიფიკაცია
          </a>
        </div>
      </div>
    </section>
  );
}
