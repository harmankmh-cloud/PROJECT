"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Pause, Phone, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const SCRIPT = [
  { speaker: "ai", text: "Thanks for calling Lakeside Dental! This is the GreetQ assistant. How can I help you today?", ms: 3200 },
  { speaker: "caller", text: "Hi — I'd like to book a cleaning sometime next week if possible.", ms: 2800 },
  { speaker: "ai", text: "Happy to help with that. I have Tuesday at 2 PM or Thursday at 10 AM open — do either of those work?", ms: 3400 },
  { speaker: "caller", text: "Tuesday at 2 works great.", ms: 1800 },
  { speaker: "ai", text: "Perfect — you're booked for Tuesday at 2 PM with Dr. Chen. I'll text you a confirmation right now. Anything else?", ms: 3600 },
  { speaker: "caller", text: "Nope, that's everything. Thanks!", ms: 1600 },
  { speaker: "ai", text: "You're welcome! See you Tuesday.", ms: 1800 },
] as const;

const DEFAULT_AUDIO = "/samples/dental-booking.mp3";

function WaveBars({ active }: { active: boolean }) {
  return (
    <div className="flex h-6 items-center gap-0.5" aria-hidden>
      {Array.from({ length: 24 }).map((_, i) => (
        <motion.span
          key={i}
          className="w-1 rounded-full bg-violet-400/70"
          animate={
            active
              ? { height: ["20%", `${30 + ((i * 37) % 60)}%`, "25%"] }
              : { height: "20%" }
          }
          transition={active ? { duration: 0.9, repeat: Infinity, delay: i * 0.05 } : undefined}
          style={{ height: "20%" }}
        />
      ))}
    </div>
  );
}

export function SampleCallPlayer() {
  const audioSrc =
    process.env.NEXT_PUBLIC_SAMPLE_CALL_AUDIO_URL?.trim() || DEFAULT_AUDIO;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioReady, setAudioReady] = useState(false);
  const [useAudio, setUseAudio] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(-1);

  useEffect(() => {
    const audio = new Audio(audioSrc);
    audio.preload = "metadata";
    const onCanPlay = () => {
      setAudioReady(true);
      setUseAudio(true);
    };
    const onError = () => {
      setUseAudio(false);
    };
    const onEnded = () => setPlaying(false);
    audio.addEventListener("canplaythrough", onCanPlay);
    audio.addEventListener("error", onError);
    audio.addEventListener("ended", onEnded);
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.removeEventListener("canplaythrough", onCanPlay);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("ended", onEnded);
      audioRef.current = null;
    };
  }, [audioSrc]);

  useEffect(() => {
    if (useAudio || !playing) return;
    const isLast = step >= SCRIPT.length - 1;
    const delay = step < 0 ? 300 : SCRIPT[step].ms;
    const timer = setTimeout(() => {
      if (isLast) setPlaying(false);
      else setStep(step + 1);
    }, delay);
    return () => clearTimeout(timer);
  }, [playing, step, useAudio]);

  const done = useAudio ? !playing && audioRef.current?.currentTime !== 0 : step >= SCRIPT.length - 1 && !playing;

  function togglePlay() {
    if (useAudio && audioRef.current) {
      if (playing) {
        audioRef.current.pause();
        setPlaying(false);
      } else {
        void audioRef.current.play().then(() => setPlaying(true));
      }
      return;
    }
    setPlaying((v) => !v);
  }

  function replay() {
    if (useAudio && audioRef.current) {
      audioRef.current.currentTime = 0;
      void audioRef.current.play().then(() => setPlaying(true));
      return;
    }
    setStep(-1);
    setPlaying(true);
  }

  const subtitle = useAudio
    ? "Audio sample with transcript below"
    : "Scripted replay of a typical conversation";

  return (
    <section className="border-t border-border py-16 md:py-20">
      <div className="marketing-container">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <p className="section-eyebrow mb-3">Hear it in action</p>
            <h2 className="font-display text-2xl text-text md:text-3xl">
              Sample booking call{audioReady ? "" : " — scripted preview"}
            </h2>
            <p className="mt-2 text-sm text-muted">
              {audioReady
                ? "Listen to a sample dental booking call."
                : "This is a typical conversation flow until an audio file is added."}
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between border-b border-border/60 px-5 py-3.5">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600/20">
                  <Phone className="h-4 w-4 text-violet-300" />
                </span>
                <div>
                  <p className="text-sm font-medium text-text">Sample call · Dental booking</p>
                  <p className="text-xs text-muted">{subtitle}</p>
                </div>
              </div>
              <WaveBars active={playing} />
            </div>

            {useAudio ? (
              <div className="border-b border-border/60 px-5 py-3">
                <audio controls className="w-full" src={audioSrc} preload="metadata">
                  Your browser does not support audio playback.
                </audio>
              </div>
            ) : null}

            <div className="min-h-[220px] space-y-3 p-5" aria-live="polite">
              <AnimatePresence>
                {(useAudio ? SCRIPT : SCRIPT.slice(0, Math.max(step + 1, 0))).map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={
                      line.speaker === "ai"
                        ? "max-w-[85%] rounded-2xl rounded-tl-sm bg-violet-600/15 p-3 text-sm text-text"
                        : "ml-auto max-w-[75%] rounded-2xl rounded-tr-sm bg-bg/70 p-3 text-sm text-text"
                    }
                  >
                    <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted">
                      {line.speaker === "ai" ? "GreetQ" : "Caller"}
                    </span>
                    {line.text}
                  </motion.div>
                ))}
              </AnimatePresence>
              {!useAudio && step < 0 ? (
                <p className="pt-16 text-center text-sm text-muted">
                  Press play to watch GreetQ handle a booking call.
                </p>
              ) : null}
            </div>

            <div className="flex items-center justify-center gap-3 border-t border-border/60 p-4">
              {done && (useAudio ? audioRef.current?.paused : true) ? (
                <button
                  type="button"
                  onClick={replay}
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-text transition hover:border-violet-500/40"
                >
                  <RotateCcw className="h-4 w-4" /> Replay
                </button>
              ) : (
                <button
                  type="button"
                  onClick={togglePlay}
                  className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(124,58,237,0.35)] transition hover:shadow-[0_0_40px_rgba(124,58,237,0.5)]"
                >
                  {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {playing ? "Pause" : step < 0 && !useAudio ? "Play sample call" : "Resume"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
