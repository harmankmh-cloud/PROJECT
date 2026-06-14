"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import type { Message, MessageThread } from "@/lib/features-data";
import { Avatar } from "@/components/ui/Avatar";

type Props = {
  asPro?: boolean;
};

export function MessagesInbox({ asPro = false }: Props) {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch(`/api/messages?as=${asPro ? "pro" : "homeowner"}`)
      .then((r) => r.json())
      .then((d) => {
        setThreads(d.threads || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [asPro]);

  useEffect(() => {
    if (!activeId) return;
    fetch(`/api/messages/${activeId}`)
      .then((r) => r.json())
      .then((d) => setMessages(d.messages || []));
  }, [activeId]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!activeId || !reply.trim()) return;
    setSending(true);
    await fetch(`/api/messages/${activeId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: reply, senderRole: asPro ? "pro" : "homeowner" }),
    });
    setReply("");
    const res = await fetch(`/api/messages/${activeId}`);
    const data = await res.json();
    setMessages(data.messages || []);
    setSending(false);
  }

  if (loading) {
    return <div className="h-64 animate-pulse rounded-[14px] bg-surface" />;
  }

  if (threads.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-[14px] border border-dashed border-border bg-surface p-12 text-center">
        <MessageSquare className="h-12 w-12 text-muted" />
        <p className="mt-4 font-medium text-foreground">No conversations yet</p>
        <p className="mt-1 max-w-sm text-sm text-muted">
          {asPro
            ? "When homeowners message you, threads will appear here."
            : "Message a pro from their profile to start a conversation."}
        </p>
      </div>
    );
  }

  const active = threads.find((t) => t.id === activeId) ?? threads[0];
  const providerName =
    (active?.provider as { display_name?: string } | undefined)?.display_name ??
    (active as unknown as { service_providers?: { display_name: string } })?.service_providers
      ?.display_name ??
    "Conversation";

  return (
    <div className="grid gap-4 overflow-hidden rounded-[14px] border border-border bg-surface lg:grid-cols-[280px_1fr]">
      <ul className="border-b border-border lg:border-b-0 lg:border-r">
        {threads.map((t) => {
          const name =
            (t.provider as { display_name?: string })?.display_name ??
            (t as unknown as { service_providers?: { display_name: string } }).service_providers
              ?.display_name ??
            "Pro";
          return (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => setActiveId(t.id)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${
                  (activeId ?? threads[0]?.id) === t.id ? "bg-amber-400/10" : "hover:bg-background"
                }`}
              >
                <Avatar name={name} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{name}</p>
                  <p className="truncate text-xs text-muted">{t.subject || "Job inquiry"}</p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="flex min-h-[320px] flex-col">
        <div className="border-b border-border px-4 py-3">
          <p className="font-semibold text-foreground">{providerName}</p>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                m.sender_role === (asPro ? "pro" : "homeowner")
                  ? "ml-auto bg-primary text-white"
                  : "bg-background text-foreground"
              }`}
            >
              {m.body}
            </div>
          ))}
        </div>
        <form onSubmit={handleSend} className="flex gap-2 border-t border-border p-4">
          <input
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type a message..."
            className="input-focus-glow flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={sending}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
