"use client";

import { Reveal } from "@/components/Reveal";
import { Earth, FlaskConical, ScanLine } from "lucide-react";

const features = [
  {
    title: "AI იდენტიფიკაცია",
    description: "ატვირთე ფოტო და გაიგე სახეობა.",
    icon: ScanLine,
  },
  {
    title: "გლობალური ატლასი",
    description: "შეისწავლე ქვეწარმავლები მთელ მსოფლიოში.",
    icon: Earth,
  },
  {
    title: "სამეცნიერო ცოდნა",
    description: "ისწავლე დამოწმებული ბიოლოგიური მონაცემებით.",
    icon: FlaskConical,
  },
];

export function FeatureSection() {
  return (
    <section id="why" className="bg-surface py-28 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
            რატომ ReptiVerse
          </p>
          <h2 className="mt-6 max-w-4xl font-display text-balance-tight text-[clamp(2.1rem,5vw,4.25rem)] leading-[1.02]">
            ვაკავშირებთ ადამიანებს ქვეწარმავლების ფარულ სამყაროსთან.
          </h2>
        </Reveal>
        <div className="mt-20 grid gap-px overflow-hidden rounded-[32px] bg-border md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Reveal
                key={feature.title}
                delay={index * 100}
                className="bg-background"
              >
                <div className="h-full p-9 lg:p-12">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="size-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-9 font-display text-[24px] font-medium leading-tight lg:text-[28px]">
                    {feature.title}
                  </h3>
                  <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                  <div className="mt-10 h-px w-10 bg-gold" />
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
