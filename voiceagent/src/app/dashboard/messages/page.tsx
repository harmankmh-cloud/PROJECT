"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { PageTransition } from "@/components/ui/PageTransition";
import { DEMO_MESSAGES } from "@/lib/demo-data";

export default function MessagesPage() {
  const [selected, setSelected] = useState(DEMO_MESSAGES[0]?.id ?? "");

  const thread = DEMO_MESSAGES.find((m) => m.id === selected);

  return (
    <PageTransition>
      <div className="dashboard-container py-8">
        <h1 className="font-display text-2xl text-text">Messages</h1>
        <p className="mt-1 text-sm text-muted">SMS summaries and caller messages collected by GreetQ</p>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <div className="space-y-1">
              {DEMO_MESSAGES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelected(m.id)}
                  className={`flex w-full items-start gap-2 rounded-lg p-3 text-left transition ${
                    selected === m.id ? "bg-primary/15" : "hover:bg-white/5"
                  }`}
                >
                  {m.unread && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text">{m.from}</p>
                    <p className="truncate text-xs text-muted">{m.preview}</p>
                  </div>
                  <span className="text-[10px] text-muted">{m.time}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card className="lg:col-span-2">
            {thread ? (
              <div>
                <p className="font-medium text-text">{thread.from}</p>
                <p className="mt-4 text-sm text-muted">{thread.preview}</p>
                <p className="mt-6 font-mono text-xs text-muted">
                  Full message thread will appear here when SMS summaries are enabled.
                </p>
              </div>
            ) : (
              <p className="text-muted">Select a message</p>
            )}
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
