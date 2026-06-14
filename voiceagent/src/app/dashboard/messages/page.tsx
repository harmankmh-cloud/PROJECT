"use client";

import Link from "next/link";
import { MessageSquare, Radio } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { PageTransition } from "@/components/ui/PageTransition";

export default function MessagesPage() {
  return (
    <PageTransition>
      <div className="dashboard-container py-8">
        <h1 className="font-display text-2xl text-text">Messages</h1>
        <p className="mt-1 text-sm text-muted">SMS follow-ups and inbound texts handled by GreetQ</p>

        <Card className="mt-8 p-10 text-center">
          <MessageSquare className="mx-auto h-10 w-10 text-muted" />
          <p className="mt-4 font-medium text-text">No messages yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Enable SMS or WhatsApp channels to send booking confirmations and collect inbound texts
            from callers.
          </p>
          <Link
            href="/dashboard/channels"
            className="btn-primary mt-6 inline-flex items-center gap-2 text-sm"
          >
            <Radio className="h-4 w-4" />
            Configure channels
          </Link>
        </Card>
      </div>
    </PageTransition>
  );
}
