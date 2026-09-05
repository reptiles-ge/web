"use client";


import { PhoneLinkedText } from "@/components/PhoneLinkedText";

type ClusterNumberedStep = {
  body: string;
  title: string;
};

export function ClusterNumberedSteps({
  steps,
}: {
  steps: readonly ClusterNumberedStep[];
}) {
  return (
    <ol className="mt-14 divide-y divide-border border-y border-border">
      {steps.map((step, index) => (
        <div key={step.title}>
          <li className="grid gap-4 py-7 sm:grid-cols-[4rem_1fr] sm:items-start">
            <span className="text-[11px] tracking-[0.18em] text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="font-display text-[18px] font-medium text-foreground sm:text-[20px]">
                <PhoneLinkedText>{step.title}</PhoneLinkedText>
              </h3>
              <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                <PhoneLinkedText>{step.body}</PhoneLinkedText>
              </p>
            </div>
          </li>
        </div>
      ))}
    </ol>
  );
}
