"use client";

import type { ReactNode } from "react";

import {
  Camera,
  Check,
  Mail,
  MapPin,
  MessageSquare,
  Pencil,
} from "lucide-react";
import { useId, useState } from "react";

import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";

export type ContactTopic = {
  id: "fix" | "other" | "photo" | "range";
  includeLabel: string;
  items: string[];
  subject: string;
  summary: string;
  title: string;
};

const TOPIC_ICONS = {
  fix: Pencil,
  other: MessageSquare,
  photo: Camera,
  range: MapPin,
} as const;

export function ContactTopicPicker({
  draft,
  email,
  groupLabel,
  openLabel,
  photoLinks,
  topics,
}: {
  draft: { greeting: string; label: string; subject: string; to: string };
  email: string;
  groupLabel: string;
  openLabel: string;
  photoLinks: ReactNode;
  topics: ContactTopic[];
}) {
  const name = useId();
  const [selectedId, setSelectedId] = useState(topics[0].id);
  const current = topics.find((topic) => topic.id === selectedId) ?? topics[0];
  const mailHref = `mailto:${email}?subject=${encodeURIComponent(current.subject)}`;

  return (
    <>
      <fieldset className="mt-4 grid grid-cols-2 gap-2 md:mt-7 md:gap-3 lg:grid-cols-4">
        <legend className="sr-only">{groupLabel}</legend>
        {topics.map((topic) => {
          const Icon = TOPIC_ICONS[topic.id];
          const selected = topic.id === current.id;
          return (
            <label
              className={cn(
                "flex cursor-pointer flex-col items-start rounded-[22px] p-4 transition-[background-color,box-shadow,translate] duration-200 hover:-translate-y-0.5 has-focus-visible:outline-2 has-focus-visible:outline-offset-3 has-focus-visible:outline-(--nw-accent) md:p-5",
                selected
                  ? "bg-(--nw-strong) text-(--nw-on-strong) shadow-[0_18px_40px_rgba(14,20,17,0.22)]"
                  : "bg-(--nw-card) shadow-[0_1px_2px_rgba(14,20,17,0.04)]",
              )}
              key={topic.id}
            >
              <input
                checked={selected}
                className="sr-only"
                name={name}
                onChange={() => setSelectedId(topic.id)}
                type="radio"
                value={topic.id}
              />
              <span
                className={cn(
                  "inline-flex size-11 items-center justify-center rounded-[14px]",
                  selected
                    ? "bg-(--nw-on-strong)/12 text-(--nw-on-strong)"
                    : "bg-(--nw-surface) text-(--nw-accent)",
                )}
              >
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <span className="mt-[18px] text-[15.5px] font-semibold md:text-[17px]">
                {topic.title}
              </span>
              <span
                className={cn(
                  "mt-1 text-[13px] leading-[1.45]",
                  selected ? "text-(--nw-on-strong)/66" : "text-(--nw-muted)",
                )}
              >
                {topic.summary}
              </span>
            </label>
          );
        })}
      </fieldset>
      <div className="mt-2 rounded-[24px] bg-(--nw-card) p-5 md:mt-3 md:grid md:grid-cols-2 md:gap-3 md:rounded-none md:bg-transparent md:p-0">
        <div className="md:rounded-[28px] md:bg-(--nw-card) md:px-8 md:py-[30px]">
          <p className="text-[12.5px] text-(--nw-muted) md:text-[13px]">
            {current.includeLabel}
          </p>
          <ul aria-live="polite" className="mt-2 md:mt-3.5">
            {current.items.map((item) => (
              <li
                className="flex items-center gap-3 border-t border-(--nw-line-soft) py-3 text-[14.5px] md:text-[15.5px]"
                key={item}
              >
                <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-(--nw-surface) text-(--nw-accent)">
                  <Check
                    aria-hidden="true"
                    className="size-[13px]"
                    strokeWidth={2.4}
                  />
                </span>
                {item}
              </li>
            ))}
          </ul>
          {current.id === "photo" ? photoLinks : null}
        </div>
        <div className="mt-4 flex flex-col md:mt-0 md:rounded-[28px] md:bg-(--nw-card) md:px-8 md:py-[30px]">
          <p className="hidden text-[13px] text-(--nw-muted) md:block">
            {draft.label}
          </p>
          <div className="rounded-[18px] bg-(--nw-wash) px-[18px] py-4 text-[13.5px] leading-[1.6] md:mt-3.5">
            <div className="flex gap-2.5 border-b border-(--nw-line) pb-2">
              <span className="w-14 shrink-0 text-(--nw-muted)">
                {draft.to}
              </span>
              <b className="min-w-0 font-semibold break-all">{email}</b>
            </div>
            <div className="flex gap-2.5 border-b border-(--nw-line) py-2">
              <span className="w-14 shrink-0 text-(--nw-muted)">
                {draft.subject}
              </span>
              <b className="min-w-0 font-semibold">{current.subject}</b>
            </div>
            <div className="pt-2.5 text-(--nw-sep)">
              {draft.greeting}
              <br />…
            </div>
          </div>
          <div className="hidden min-h-[18px] flex-1 md:block" />
          <a
            className="mt-3.5 flex h-[52px] items-center justify-center gap-2.5 rounded-full bg-(--nw-strong) text-[15px] font-semibold text-(--nw-on-strong) transition-opacity hover:opacity-90 md:mt-0 md:h-[54px] md:text-[15.5px]"
            href={mailHref}
            onClick={() =>
              trackEvent("contact_click", {
                page_type: "contact",
                topic: current.id,
              })
            }
          >
            <Mail aria-hidden="true" className="size-[17px]" />
            {openLabel}
          </a>
        </div>
      </div>
    </>
  );
}
