"use client";

import { Loader2, Pause, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import type { SpeciesAudio } from "@/data/species";

import { trackEvent } from "@/lib/analytics";
import { SPECIES_SECTION_IDS } from "@/lib/toc";

export function SpeciesVoicePlayer({
  audio,
  speciesId,
}: {
  audio: SpeciesAudio;
  speciesId: string;
}) {
  const t = useTranslations("profile");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    el.pause();
    el.removeAttribute("src");
    el.load();
    setPlaying(false);
    setLoading(false);
    setProgress(0);
    setDuration(0);

    const onTime = () => {
      setProgress(el.currentTime);
      if (Number.isFinite(el.duration) && el.duration > 0) {
        setDuration(el.duration);
      }
    };
    const onEnded = () => {
      setPlaying(false);
      setProgress(0);
    };
    const onPause = () => setPlaying(false);
    const onPlaying = () => {
      setPlaying(true);
      setLoading(false);
    };
    const onWaiting = () => setLoading(true);

    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onTime);
    el.addEventListener("durationchange", onTime);
    el.addEventListener("ended", onEnded);
    el.addEventListener("pause", onPause);
    el.addEventListener("playing", onPlaying);
    el.addEventListener("waiting", onWaiting);
    onTime();

    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onTime);
      el.removeEventListener("durationchange", onTime);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("playing", onPlaying);
      el.removeEventListener("waiting", onWaiting);
      el.pause();
      el.removeAttribute("src");
      el.load();
    };
  }, [audio.src]);

  const toggle = () => {
    const el = audioRef.current;
    if (!el || loading) return;
    if (el.paused) {
      if (!el.getAttribute("src")) {
        el.src = audio.src;
      }
      setLoading(true);
      trackEvent("voice_play", { species_id: speciesId });
      void el.play().catch(() => {
        setPlaying(false);
        setLoading(false);
      });
    } else {
      el.pause();
    }
  };

  const credit = audio.recordist
    ? `${t("voiceCredit")} ${audio.recordist}`
    : undefined;

  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 py-1 pr-3.5 pl-1 backdrop-blur-md"
      id={SPECIES_SECTION_IDS.voice}
      title={credit}
    >
      <audio preload="none" ref={audioRef}>
        <track
          kind="captions"
          label={t("voiceTitle")}
          src="/captions/species-voice.vtt"
          srcLang="zxx"
        />
      </audio>
      <button
        aria-label={playing ? t("voicePause") : t("voicePlay")}
        className="grid size-7 shrink-0 place-items-center rounded-full bg-white text-ink"
        disabled={loading}
        onClick={toggle}
        type="button"
      >
        {loading ? (
          <Loader2 className="size-3 animate-spin" />
        ) : playing ? (
          <Pause className="size-3 fill-current" />
        ) : (
          <Play className="ml-px size-3 fill-current" />
        )}
      </button>
      <span className="text-[12px] text-white/70">{t("voiceTitle")}</span>
      {duration > 0 ? (
        <span className="text-[11px] text-white/45 tabular-nums">
          {formatTime(playing || progress > 0 ? progress : duration)}
        </span>
      ) : null}
    </div>
  );
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const whole = Math.floor(seconds);
  const m = Math.floor(whole / 60);
  const s = whole % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
