"use client";

import { Reveal } from "@/components/Reveal";
import { useLocale } from "@/i18n/LocaleProvider";
import { Camera, Earth, FlaskConical } from "lucide-react";

export function FeatureSection() {
  const { t } = useLocale();
  const features = [
    {
      title: t.features.items.photography.title,
      description: t.features.items.photography.description,
      icon: Camera,
    },
    {
      title: t.features.items.atlas.title,
      description: t.features.items.atlas.description,
      icon: Earth,
    },
    {
      title: t.features.items.science.title,
      description: t.features.items.science.description,
      icon: FlaskConical,
    },
  ];

  return (
    <section id="why" className="bg-surface py-28 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
            {t.features.eyebrow}
          </p>
          <h2 className="mt-6 max-w-4xl font-display text-balance-tight text-[clamp(2.1rem,5vw,4.25rem)] leading-[1.02]">
            {t.features.title}
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
