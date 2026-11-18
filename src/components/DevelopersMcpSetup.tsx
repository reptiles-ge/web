"use client";

import type { KeyboardEvent } from "react";

import { Check, Copy, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";

import { codeClass, JsonKey, JsonString } from "@/components/DevelopersCode";
import { cn } from "@/lib/cn";

type Client = (typeof CLIENTS)[number];

const CLIENTS = ["claude", "chatgpt", "claudeCode", "cursor"] as const;

const CLIENT_LABELS: Record<Client, string> = {
  chatgpt: "ChatGPT",
  claude: "Claude",
  claudeCode: "Claude Code",
  cursor: "Cursor",
};

const STEP_CLIENTS: ReadonlySet<Client> = new Set(["chatgpt", "claude"]);

const STEP_KEYS = ["step1", "step2", "step3"] as const;

export function DevelopersMcpSetup({ serverUrl }: { serverUrl: string }) {
  const t = useTranslations("developers.mcp");
  const [client, setClient] = useState<Client>("claude");
  const [status, setStatus] = useState<"copied" | "failed" | "idle">("idle");
  const timeoutRef = useRef<number | undefined>(undefined);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const id = useId();
  const panelId = `${id}-setup`;

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== undefined) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  async function onCopy() {
    let next: "copied" | "failed" = "copied";
    try {
      await navigator.clipboard.writeText(serverUrl);
    } catch {
      next = "failed";
    }
    setStatus(next);
    if (timeoutRef.current !== undefined) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => setStatus("idle"), 2000);
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const step =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (step === 0) return;
    event.preventDefault();
    const next = (index + step + CLIENTS.length) % CLIENTS.length;
    setClient(CLIENTS[next]!);
    tabRefs.current[next]?.focus();
  }

  const statusLabel =
    status === "copied"
      ? t("copied")
      : status === "failed"
        ? t("copyFailed")
        : "";

  return (
    <div>
      <p className="mt-6 mb-2 text-[13px] font-semibold md:mt-7 md:text-[13.5px]">
        {t("urlLabel")}
      </p>
      <div className="rounded-[18px] bg-(--nw-card) p-3.5 shadow-[inset_0_0_0_1px_var(--nw-line)] md:flex md:h-14 md:items-center md:gap-2 md:rounded-2xl md:py-0 md:pr-2 md:pl-[18px]">
        <code className="block font-mono text-[14px] font-semibold break-all text-(--nw-ink) md:min-w-0 md:flex-auto md:truncate md:text-[15px]">
          {serverUrl}
        </code>
        <button
          aria-label={statusLabel || t("copySr")}
          className={cn(
            "mt-3 inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full border-0 text-[15px] font-semibold text-white transition-colors md:mt-0 md:h-11 md:w-auto md:shrink-0 md:px-4 md:text-[14px]",
            status === "copied" ? "bg-(--nw-accent)" : "bg-[#1a211c]",
          )}
          onClick={() => void onCopy()}
          type="button"
        >
          {status === "copied" ? (
            <Check
              aria-hidden="true"
              className="size-[15px]"
              strokeWidth={2.4}
            />
          ) : status === "failed" ? (
            <X aria-hidden="true" className="size-[15px]" strokeWidth={2.4} />
          ) : (
            <Copy aria-hidden="true" className="size-[15px]" />
          )}
          {statusLabel || t("copy")}
        </button>
        <span aria-live="polite" className="sr-only">
          {statusLabel}
        </span>
      </div>

      <p className="mt-6 mb-2.5 text-[13px] font-semibold md:mt-7 md:text-[13.5px]">
        {t("howTo")}
      </p>
      <div
        aria-label={t("clients")}
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-0.5 md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
        role="tablist"
      >
        {CLIENTS.map((item, index) => {
          const selected = item === client;
          return (
            <button
              aria-controls={panelId}
              aria-selected={selected}
              className={cn(
                "h-11 shrink-0 cursor-pointer rounded-full border-0 px-4 text-[14px] font-medium transition-colors",
                selected
                  ? "bg-[#1a211c] text-white"
                  : "bg-(--nw-card) text-(--nw-ink) shadow-[inset_0_0_0_1px_var(--border)] hover:bg-(--nw-surface)",
              )}
              key={item}
              onClick={() => setClient(item)}
              onKeyDown={(event) => onKeyDown(event, index)}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              role="tab"
              tabIndex={selected ? 0 : -1}
              type="button"
            >
              {CLIENT_LABELS[item]}
            </button>
          );
        })}
      </div>
      <div
        className="mt-3 rounded-[20px] bg-[#0e1411] px-[18px] py-4 text-white md:px-[22px] md:py-[18px]"
        id={panelId}
        role="tabpanel"
        tabIndex={0}
      >
        {STEP_CLIENTS.has(client) ? (
          <ol className="m-0 list-none p-0">
            {STEP_KEYS.map((key, index) => (
              <li
                className="flex gap-3 py-1.5 text-[14px] leading-normal text-white/86 md:text-[14.5px]"
                key={key}
              >
                <b className="w-4 shrink-0 text-[#7fc29b]">{index + 1}</b>
                <span>{t(`${client as "chatgpt" | "claude"}.${key}`)}</span>
              </li>
            ))}
          </ol>
        ) : (
          <pre
            className={cn(
              codeClass,
              "text-[12px] break-all whitespace-pre-wrap md:text-[13px]",
            )}
          >
            {client === "claudeCode" ? (
              <>
                <span className="text-white/45">$</span> claude mcp add
                --transport http reptiles {serverUrl}
              </>
            ) : (
              <>
                {"{\n  "}
                <JsonKey>&quot;mcpServers&quot;</JsonKey>
                {": {\n    "}
                <JsonKey>&quot;reptiles&quot;</JsonKey>
                {": { "}
                <JsonKey>&quot;url&quot;</JsonKey>:{" "}
                <JsonString>&quot;{serverUrl}&quot;</JsonString>
                {" }\n  }\n}"}
              </>
            )}
          </pre>
        )}
      </div>
    </div>
  );
}
