"use client";

import type { KeyboardEvent, ReactNode } from "react";

import { useTranslations } from "next-intl";
import { useId, useRef, useState } from "react";

import { codeClass, JsonString, Keyword } from "@/components/DevelopersCode";
import { cn } from "@/lib/cn";

type Language = "curl" | "js" | "py";

const LANGUAGES: ReadonlyArray<{ id: Language; label: string }> = [
  { id: "curl", label: "cURL" },
  { id: "js", label: "JavaScript" },
  { id: "py", label: "Python" },
];

export function DevelopersCodeSample({
  apiOrigin,
  locale,
  response,
  slug,
}: {
  apiOrigin: string;
  locale: string;
  response: ReactNode;
  slug: string;
}) {
  const t = useTranslations("developers.sample");
  const [language, setLanguage] = useState<Language>("curl");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const id = useId();
  const panelId = `${id}-code`;

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const step =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (step === 0) return;
    event.preventDefault();
    const next = (index + step + LANGUAGES.length) % LANGUAGES.length;
    setLanguage(LANGUAGES[next]!.id);
    tabRefs.current[next]?.focus();
  }

  return (
    <figure
      aria-label={t("label")}
      className="m-0 overflow-hidden rounded-[28px] bg-[#0b100d] shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_30px_70px_rgba(0,0,0,0.35)]"
    >
      <div className="flex items-center gap-1 border-b border-white/8 px-3 py-2.5">
        <span aria-hidden="true" className="mr-2.5 ml-1.5 flex gap-1.5">
          <span className="size-2.5 rounded-full bg-white/18" />
          <span className="size-2.5 rounded-full bg-white/18" />
          <span className="size-2.5 rounded-full bg-white/18" />
        </span>
        <div aria-label={t("tabs")} className="flex gap-1" role="tablist">
          {LANGUAGES.map((item, index) => {
            const selected = item.id === language;
            return (
              <button
                aria-controls={panelId}
                aria-selected={selected}
                className={cn(
                  "h-8 cursor-pointer rounded-full border-0 px-3 font-mono text-[12px] font-semibold transition-colors",
                  selected
                    ? "bg-white/14 text-white"
                    : "bg-transparent text-white/55 hover:text-white/80",
                )}
                key={item.id}
                onClick={() => setLanguage(item.id)}
                onKeyDown={(event) => onKeyDown(event, index)}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                role="tab"
                tabIndex={selected ? 0 : -1}
                type="button"
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <span className="flex-auto" />
        <span className="hidden h-7 items-center gap-1.5 rounded-full bg-[rgba(127,194,155,0.14)] px-2.5 font-mono text-[11.5px] font-semibold whitespace-nowrap text-[#7fc29b] md:inline-flex">
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-[#7fc29b]"
          />
          200 OK
        </span>
      </div>
      <pre
        className={cn(
          codeClass,
          "border-b border-white/8 px-4 pt-[18px] pb-3.5 md:px-6",
        )}
        id={panelId}
        role="tabpanel"
        tabIndex={0}
      >
        {codeFor(language, `${apiOrigin}/v1/species/${slug}`, locale)}
      </pre>
      {response}
    </figure>
  );
}

function codeFor(language: Language, url: string, locale: string) {
  if (language === "curl") {
    return (
      <>
        <span className="text-white/45">$</span> curl {url} \{"\n"}
        {"  "}-H <JsonString>{'"X-Api-Key: $REPTILES_KEY"'}</JsonString> \{"\n"}
        {"  "}-H <JsonString>{`"X-Locale: ${locale}"`}</JsonString>
      </>
    );
  }
  if (language === "js") {
    return (
      <>
        <Keyword>const</Keyword> res = <Keyword>await</Keyword> fetch({"\n"}
        {"  "}
        <JsonString>{`"${url}"`}</JsonString>,{"\n"}
        {"  "}
        {"{ headers: { "}
        <JsonString>{'"X-Api-Key"'}</JsonString>: KEY,{" "}
        <JsonString>{'"X-Locale"'}</JsonString>:{" "}
        <JsonString>{`"${locale}"`}</JsonString>
        {" } }"}
        {"\n"});{"\n"}
        <Keyword>const</Keyword> {"{ data }"} = <Keyword>await</Keyword>{" "}
        res.json();
      </>
    );
  }
  return (
    <>
      <Keyword>import</Keyword> requests{"\n\n"}r = requests.get({"\n"}
      {"    "}
      <JsonString>{`"${url}"`}</JsonString>,{"\n"}
      {"    "}headers={"{"}
      <JsonString>{'"X-Api-Key"'}</JsonString>: KEY,{" "}
      <JsonString>{'"X-Locale"'}</JsonString>:{" "}
      <JsonString>{`"${locale}"`}</JsonString>
      {"}"},{"\n"}){"\n"}
      species = r.json()[<JsonString>{'"data"'}</JsonString>]
    </>
  );
}
