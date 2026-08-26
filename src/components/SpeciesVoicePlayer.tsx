"use client";

import type { SpeciesAudio } from "@/data/species";
import { SPECIES_SECTION_IDS } from "@/lib/toc";
import { Pause, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const whole = Math.floor(seconds);
  const m = Math.floor(whole / 60);
  const s = whole % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function SpeciesVoicePlayer({ audio }: { audio: SpeciesAudio }) {
  const t = useTranslations("profile");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    el.pause();
    el.currentTime = 0;
    setPlaying(false);
    setProgress(0);

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
    const onPlay = () => setPlaying(true);

    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onTime);
    el.addEventListener("durationchange", onTime);
    el.addEventListener("ended", onEnded);
    el.addEventListener("pause", onPause);
    el.addEventListener("play", onPlay);
    onTime();

    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onTime);
      el.removeEventListener("durationchange", onTime);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("play", onPlay);
      el.pause();
    };
  }, [audio.src]);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play().catch(() => setPlaying(false));
    } else {
      el.pause();
    }
  };

  const credit = audio.recordist
    ? `${t("voiceCredit")} ${audio.recordist}`
    : undefined;

  return (
    <div
      id={SPECIES_SECTION_IDS.voice}
      title={credit}
      className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 py-1 pr-3.5 pl-1 backdrop-blur-md"
    >
      <audio ref={audioRef} src={audio.src} preload="metadata" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? t("voicePause") : t("voicePlay")}
        className="grid size-7 shrink-0 place-items-center rounded-full bg-white text-ink"
      >
        {playing ? (
          <Pause className="size-3 fill-current" />
        ) : (
          <Play className="ml-px size-3 fill-current" />
        )}
      </button>
      <span className="text-[12px] text-white/70">{t("voiceTitle")}</span>
      {duration > 0 ? (
        <span className="text-[11px] tabular-nums text-white/45">
          {formatTime(playing || progress > 0 ? progress : duration)}
        </span>
      ) : null}
    </div>
  );
}
