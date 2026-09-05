import type { ReactNode } from "react";

import { PhoneLinkedText } from "@/components/PhoneLinkedText";

export type GuideStepItem = {
  body: string;
  id: number;
  title: string;
};

export function GuideDoDontSection({
  doEyebrow,
  doItems,
  dontEyebrow,
  dontItems,
  dontTitle,
  doTitle,
}: {
  doEyebrow: string;
  doItems: readonly GuideStepItem[];
  dontEyebrow: string;
  dontItems: readonly GuideStepItem[];
  dontTitle: string;
  doTitle: string;
}) {
  return (
    <section className="border-t border-border bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <PhoneLinkedText>
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
                {doEyebrow}
              </p>
              <h2 className="mt-5 font-display text-display-title font-semibold">
                {doTitle}
              </h2>
              <ol className="mt-8 divide-y divide-border border-y border-border">
                {doItems.map((item) => (
                  <li className="py-5" key={item.id}>
                    <h3 className="font-display text-[17px] font-medium text-foreground">
                      <span className="mr-2 text-muted-foreground">
                        {String(item.id).padStart(2, "0")}
                      </span>
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
                {dontEyebrow}
              </p>
              <h2 className="mt-5 font-display text-display-title font-semibold">
                {dontTitle}
              </h2>
              <ol className="mt-8 divide-y divide-border border-y border-border">
                {dontItems.map((item) => (
                  <li className="py-5" key={item.id}>
                    <h3 className="font-display text-[17px] font-medium text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </PhoneLinkedText>
      </div>
    </section>
  );
}

export function GuideEditorialNote({
  body,
  disclaimer,
  updated,
}: {
  body: ReactNode;
  disclaimer: ReactNode;
  updated: string;
}) {
  return (
    <aside className="mt-12 max-w-3xl rounded-card border border-border bg-surface p-6 sm:p-7">
      <p className="text-[13px] font-medium text-foreground">{updated}</p>
      <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
        <PhoneLinkedText>{body}</PhoneLinkedText>
      </p>
      <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
        <PhoneLinkedText>{disclaimer}</PhoneLinkedText>
      </p>
    </aside>
  );
}

export function GuideFactColumn({
  children,
  eyebrow,
  intro,
  note,
  title,
}: {
  children?: ReactNode;
  eyebrow: string;
  intro: ReactNode;
  note?: ReactNode;
  title: string;
}) {
  return (
    <div>
      <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
        {eyebrow}
      </p>
      <h2 className="mt-5 font-display text-display-title font-semibold">
        {title}
      </h2>
      <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
        <PhoneLinkedText>{intro}</PhoneLinkedText>
      </p>
      {note ? (
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          <PhoneLinkedText>{note}</PhoneLinkedText>
        </p>
      ) : null}
      {children}
    </div>
  );
}

export function GuideFactList({
  items,
}: {
  items: readonly { id: number; text: ReactNode }[];
}) {
  return (
    <ul className="mt-8 divide-y divide-border border-y border-border">
      {items.map((item) => (
        <li
          className="py-4 text-[15px] leading-relaxed text-foreground"
          key={item.id}
        >
          <PhoneLinkedText>{item.text}</PhoneLinkedText>
        </li>
      ))}
    </ul>
  );
}

export function GuideNumberedSteps({
  items,
}: {
  items: readonly GuideStepItem[];
}) {
  return (
    <ol className="mt-14 space-y-0 divide-y divide-border border-y border-border">
      {items.map((item) => (
        <li
          className="grid gap-6 py-8 sm:grid-cols-[5.5rem_1fr] sm:gap-10 sm:py-10 lg:grid-cols-[7rem_1fr]"
          key={item.id}
        >
          <span className="font-display text-display-stat font-semibold text-primary/80">
            {String(item.id).padStart(2, "0")}
          </span>
          <div>
            <h3 className="font-display text-display-card font-semibold text-foreground">
              {item.title}
            </h3>
            <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]">
              <PhoneLinkedText>{item.body}</PhoneLinkedText>
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function GuideSymptomsLead({
  eyebrow,
  intro,
  title,
  urgent,
}: {
  eyebrow: string;
  intro: ReactNode;
  title: string;
  urgent: ReactNode;
}) {
  return (
    <div>
      <p className="text-[11px] font-medium tracking-[0.3em] text-muted-foreground uppercase">
        {eyebrow}
      </p>
      <h2 className="mt-5 max-w-2xl font-display text-display-title font-semibold">
        {title}
      </h2>
      <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
        <PhoneLinkedText>{intro}</PhoneLinkedText>
      </p>
      <p className="mt-4 max-w-2xl rounded-[18px] border border-destructive/25 bg-destructive/5 px-5 py-4 text-[15px] leading-relaxed text-foreground">
        <PhoneLinkedText>{urgent}</PhoneLinkedText>
      </p>
    </div>
  );
}

export function GuideTwoColumnSurface({ children }: { children: ReactNode }) {
  return (
    <section className="border-t border-border bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">{children}</div>
      </div>
    </section>
  );
}
