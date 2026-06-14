"use client";

import { useEffect, useState } from "react";

const LINES = [
  { role: "GreetQ", text: "Hi! Thanks for calling Pacific Dental. How can I help?" },
  { role: "Caller", text: "I'd like to schedule a cleaning for next Tuesday." },
  { role: "GreetQ", text: "I have 2:00 PM or 4:30 PM available. Which works better?" },
  { role: "Caller", text: "2 PM please." },
  { role: "GreetQ", text: "Perfect — you're booked for Tuesday at 2 PM. See you then!" },
] as const;

export function TranscriptPreview() {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (visible >= LINES.length) return;
    const t = setTimeout(() => setVisible((v) => v + 1), 800);
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <div className="transcript-container h-full space-y-2 overflow-hidden p-4 text-xs">
      {LINES.slice(0, visible).map((line, i) => (
        <p key={i}>
          <span className={line.role === "GreetQ" ? "text-accent" : "text-primary-glow"}>
            {line.role}:
          </span>{" "}
          <span className="text-text">{line.text}</span>
        </p>
      ))}
      {visible < LINES.length && (
        <span className="inline-block h-4 w-0.5 animate-pulse bg-accent" />
      )}
    </div>
  );
}
