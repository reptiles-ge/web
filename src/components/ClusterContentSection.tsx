"use client";

import { type ReactNode } from "react";

import {
  CLUSTER_BODY,
  CLUSTER_EYEBROW,
  CLUSTER_TITLE_SECTION,
  ClusterSectionIntro,
} from "@/components/ClusterSectionIntro";
import { PhoneLinkedText } from "@/components/PhoneLinkedText";
import { cn } from "@/lib/cn";

type ClusterContentSectionProps = {
  body?: string;
  children: ReactNode;
  eyebrow: string;
  id?: string;
  surface?: "background" | "surface";
  title: string;
};

export function ClusterContentSection({
  body,
  children,
  eyebrow,
  id,
  surface = "surface",
  title,
}: ClusterContentSectionProps) {
  return (
    <section
      className={cn(
        "border-t border-border py-20 lg:py-28",
        id ? "scroll-mt-28" : null,
        surface === "surface" ? "bg-surface" : "bg-background",
      )}
      id={id}
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div>
          <ClusterSectionIntro
            body={body}
            bodyClassName={CLUSTER_BODY}
            eyebrow={eyebrow}
            eyebrowClassName={CLUSTER_EYEBROW}
            title={title}
            titleClassName={CLUSTER_TITLE_SECTION}
          />
        </div>
        {children ? <PhoneLinkedText>{children}</PhoneLinkedText> : null}
      </div>
    </section>
  );
}
