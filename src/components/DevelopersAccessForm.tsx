"use client";

import type { FormEvent, ReactNode } from "react";

import { ArrowRight, BookOpen, Check } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useId, useState } from "react";

import type { AppLocale } from "@/i18n/routing";

import {
  API_ACCESS_DATA,
  API_ACCESS_PROJECT_TYPES,
  API_ACCESS_VOLUMES,
  type ApiAccessData,
  type ApiAccessProjectType,
  type ApiAccessVolume,
} from "@/lib/apiAccessRequestInput";
import { cn } from "@/lib/cn";

type Status = "failed" | "idle" | "sending" | "sent";

const EMAIL_PATTERN = /.+@.+\..+/;

const inputClass =
  "block h-[52px] w-full rounded-[14px] border bg-(--nw-card) px-4 text-[15px] text-(--nw-ink) outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-(--nw-sep) focus:border-(--nw-accent) focus:shadow-[0_0_0_4px_rgba(47,107,79,0.14)]";
const labelClass = "mb-2 block text-[13.5px] font-semibold text-(--nw-ink)";
const errorClass = "mt-1.5 text-[12.5px] text-(--nw-danger-dot)";
const darkButtonClass =
  "inline-flex cursor-pointer items-center gap-2.5 rounded-full border-0 bg-(--nw-strong) font-semibold text-(--nw-on-strong) transition-opacity hover:opacity-90";

export function DevelopersAccessForm({
  docsLink,
  email,
}: {
  docsLink: ReactNode;
  email: string;
}) {
  const t = useTranslations("developers.form");
  const locale = useLocale() as AppLocale;
  const id = useId();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [organization, setOrganization] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [projectType, setProjectType] =
    useState<ApiAccessProjectType>("tourism");
  const [data, setData] = useState<ApiAccessData[]>(["species", "risk"]);
  const [volume, setVolume] = useState<ApiAccessVolume>("under10k");
  const [consent, setConsent] = useState(false);
  const [tried, setTried] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [sentSite, setSentSite] = useState("");

  const errors = {
    consent: tried && !consent,
    email: tried && !EMAIL_PATTERN.test(contact),
    name: tried && !name.trim(),
    website: tried && !website.trim(),
  };

  const typeLabels: Record<ApiAccessProjectType, string> = {
    education: t("types.education"),
    media: t("types.media"),
    other: t("types.other"),
    research: t("types.research"),
    tourism: t("types.tourism"),
  };
  const dataLabels: Record<ApiAccessData, string> = {
    photos: t("dataTypes.photos"),
    regions: t("dataTypes.regions"),
    risk: t("dataTypes.risk"),
    species: t("dataTypes.species"),
  };
  const volumeLabels: Record<ApiAccessVolume, string> = {
    "10kTo100k": t("volumes.10kTo100k"),
    over100k: t("volumes.over100k"),
    under10k: t("volumes.under10k"),
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const valid =
      name.trim() && EMAIL_PATTERN.test(contact) && website.trim() && consent;
    if (!valid) {
      setTried(true);
      return;
    }
    setStatus("sending");
    try {
      const response = await fetch("/api/access-request", {
        body: JSON.stringify({
          consent,
          data: API_ACCESS_DATA.filter((item) => data.includes(item)),
          description,
          email: contact,
          locale,
          name,
          organization,
          projectType,
          volume,
          website,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      if (!response.ok) {
        setStatus("failed");
        return;
      }
      setSentSite(website.trim());
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  }

  function startAgain() {
    setTried(false);
    setStatus("idle");
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-start py-2" role="status">
        <span className="inline-flex size-[60px] items-center justify-center rounded-full bg-(--nw-accent) text-white">
          <Check aria-hidden="true" className="size-7" strokeWidth={2.4} />
        </span>
        <p className="mt-5 text-[28px] leading-[1.2] font-semibold">
          {t("sentTitle")}
        </p>
        <p className="mt-2.5 max-w-[480px] text-[16px] leading-[1.65] text-(--nw-muted)">
          {t.rich("sentBody", {
            b: (chunks) => (
              <b className="font-semibold break-all text-(--nw-ink)">
                {chunks}
              </b>
            ),
            site: sentSite,
          })}
        </p>
        <div className="mt-[22px] flex flex-wrap gap-2.5">
          {docsLink}
          <button
            className="h-[50px] cursor-pointer rounded-full border border-[#d5ddd4] bg-(--nw-card) px-5 text-[15px] font-medium text-(--nw-ink) dark:border-(--nw-line)"
            onClick={startAgain}
            type="button"
          >
            {t("again")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      className="grid grid-cols-1 gap-x-4 gap-y-[18px] md:grid-cols-2"
      noValidate
      onSubmit={onSubmit}
    >
      <TextField
        error={errors.name ? t("errorRequired") : null}
        id={`${id}-name`}
        label={t("name")}
        onChange={setName}
        placeholder={t("namePlaceholder")}
        required={t("required")}
        type="text"
        value={name}
      />
      <TextField
        autoComplete="email"
        error={errors.email ? t("errorEmail") : null}
        id={`${id}-email`}
        label={t("email")}
        onChange={setContact}
        placeholder={t("emailPlaceholder")}
        required={t("required")}
        type="email"
        value={contact}
      />
      <TextField
        autoComplete="organization"
        error={null}
        id={`${id}-organization`}
        label={t("organization")}
        onChange={setOrganization}
        placeholder={t("organizationPlaceholder")}
        type="text"
        value={organization}
      />
      <TextField
        autoComplete="url"
        error={errors.website ? t("errorRequired") : null}
        id={`${id}-website`}
        label={t("website")}
        onChange={setWebsite}
        placeholder={t("websitePlaceholder")}
        required={t("required")}
        type="url"
        value={website}
      />
      <OptionGroup label={t("projectType")} labelId={`${id}-type`}>
        {API_ACCESS_PROJECT_TYPES.map((item) => (
          <button
            aria-checked={projectType === item}
            className={optionClass(projectType === item)}
            key={item}
            onClick={() => setProjectType(item)}
            role="radio"
            type="button"
          >
            {typeLabels[item]}
          </button>
        ))}
      </OptionGroup>
      <OptionGroup label={t("data")} labelId={`${id}-data`} multiple>
        {API_ACCESS_DATA.map((item) => {
          const selected = data.includes(item);
          return (
            <button
              aria-checked={selected}
              className={optionClass(selected)}
              key={item}
              onClick={() =>
                setData(
                  selected
                    ? data.filter((value) => value !== item)
                    : [...data, item],
                )
              }
              role="checkbox"
              type="button"
            >
              {selected ? (
                <Check
                  aria-hidden="true"
                  className="size-3.5"
                  strokeWidth={2.4}
                />
              ) : null}
              {dataLabels[item]}
            </button>
          );
        })}
      </OptionGroup>
      <OptionGroup label={t("volume")} labelId={`${id}-volume`}>
        {API_ACCESS_VOLUMES.map((item) => (
          <button
            aria-checked={volume === item}
            className={optionClass(volume === item)}
            key={item}
            onClick={() => setVolume(item)}
            role="radio"
            type="button"
          >
            {volumeLabels[item]}
          </button>
        ))}
      </OptionGroup>
      <div className="md:col-span-2">
        <label className={labelClass} htmlFor={`${id}-description`}>
          {t("description")}
        </label>
        <textarea
          className={cn(
            inputClass,
            borderClass(false),
            "h-[120px] resize-y py-3.5 leading-[1.55]",
          )}
          id={`${id}-description`}
          maxLength={2000}
          onChange={(event) => setDescription(event.target.value)}
          placeholder={t("descriptionPlaceholder")}
          value={description}
        />
      </div>
      <div className="md:col-span-2">
        <button
          aria-checked={consent}
          aria-describedby={errors.consent ? `${id}-consent-error` : undefined}
          className="flex cursor-pointer items-start gap-3 border-0 bg-transparent p-0 text-left text-(--nw-ink)"
          onClick={() => setConsent(!consent)}
          role="checkbox"
          type="button"
        >
          <span
            className={cn(
              "mt-px inline-flex size-[22px] shrink-0 items-center justify-center rounded-[7px] border-2 text-white",
              consent
                ? "border-(--nw-accent) bg-(--nw-accent)"
                : errors.consent
                  ? "border-(--nw-danger-dot) bg-(--nw-card)"
                  : "border-(--nw-sep) bg-(--nw-card)",
            )}
          >
            {consent ? (
              <Check
                aria-hidden="true"
                className="size-[13px]"
                strokeWidth={3}
              />
            ) : null}
          </span>
          <span className="text-[14px] leading-[1.55]">
            {t.rich("consent", {
              b: (chunks) => <b className="font-semibold">{chunks}</b>,
            })}
          </span>
        </button>
        {errors.consent ? (
          <p className={cn(errorClass, "ml-[34px]")} id={`${id}-consent-error`}>
            {t("errorConsent")}
          </p>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-4 md:col-span-2">
        <button
          className={cn(
            darkButtonClass,
            "h-14 px-7 text-[16px] disabled:cursor-wait disabled:opacity-70",
          )}
          disabled={status === "sending"}
          type="submit"
        >
          {status === "sending" ? t("sending") : t("submit")}
          <ArrowRight aria-hidden="true" className="size-[17px]" />
        </button>
        <span className="text-[13px] text-(--nw-muted)">
          {t("replyFrom", { email })}
        </span>
        {status === "failed" ? (
          <p
            className="w-full text-[13.5px] text-(--nw-danger-dot)"
            role="alert"
          >
            {t("failed", { email })}
          </p>
        ) : null}
      </div>
    </form>
  );
}

export function DevelopersDocsButton({
  href,
  label,
  newTab,
}: {
  href: string;
  label: string;
  newTab: string;
}) {
  return (
    <a
      className={cn(darkButtonClass, "h-[50px] px-[22px] text-[15px]")}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      <BookOpen aria-hidden="true" className="size-4" />
      {label}
      <span className="sr-only"> {newTab}</span>
    </a>
  );
}

function borderClass(invalid: boolean) {
  return invalid
    ? "border-(--nw-danger-dot)"
    : "border-[#d5ddd4] dark:border-(--nw-line)";
}

function optionClass(selected: boolean) {
  return cn(
    "inline-flex h-[42px] cursor-pointer items-center gap-2 rounded-full border-0 px-4 text-[14px] font-medium transition-colors",
    selected
      ? "bg-(--nw-strong) text-(--nw-on-strong)"
      : "bg-(--nw-card) text-(--nw-ink) shadow-[inset_0_0_0_1px_#d5ddd4] dark:shadow-[inset_0_0_0_1px_var(--nw-line)]",
  );
}

function OptionGroup({
  children,
  label,
  labelId,
  multiple = false,
}: {
  children: ReactNode;
  label: string;
  labelId: string;
  multiple?: boolean;
}) {
  return (
    <div className="md:col-span-2">
      <span className={labelClass} id={labelId}>
        {label}
      </span>
      <div
        aria-labelledby={labelId}
        className="flex flex-wrap gap-2"
        role={multiple ? "group" : "radiogroup"}
      >
        {children}
      </div>
    </div>
  );
}

function TextField({
  autoComplete,
  error,
  id,
  label,
  onChange,
  placeholder,
  required,
  type,
  value,
}: {
  autoComplete?: string;
  error: null | string;
  id: string;
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: string;
  type: "email" | "text" | "url";
  value: string;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
        {required ? (
          <span className="text-(--nw-danger-dot)">
            <span aria-hidden="true"> *</span>
            <span className="sr-only"> ({required})</span>
          </span>
        ) : null}
      </label>
      <input
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={error ? true : undefined}
        autoComplete={autoComplete}
        className={cn(inputClass, borderClass(Boolean(error)))}
        id={id}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
      {error ? (
        <p className={errorClass} id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
