"use client";

import Link from "next/link";
import { Calendar, Plug } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { PageTransition } from "@/components/ui/PageTransition";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCalls } from "@/hooks/useCalls";
import { extractBookingsFromCalls } from "@/lib/call-bookings";

export default function AppointmentsPage() {
  const { data, isLoading, error } = useCalls();
  const bookings = extractBookingsFromCalls(data?.calls ?? []);

  return (
    <PageTransition>
      <div className="dashboard-container py-8">
        <h1 className="font-display text-2xl text-text">Appointments</h1>
        <p className="mt-1 text-sm text-muted">
          Booking requests captured during calls — syncs to Google Calendar when connected
        </p>

        {error ? <p className="mt-4 text-sm text-error">{error.message}</p> : null}

        {isLoading ? (
          <Skeleton className="mt-8 h-48 w-full" />
        ) : bookings.length === 0 ? (
          <Card className="mt-8 p-10 text-center">
            <Calendar className="mx-auto h-10 w-10 text-muted" />
            <p className="mt-4 font-medium text-text">No booking requests yet</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              When GreetQ detects a booking during a call, it appears here. Connect Google Calendar
              to write confirmed slots automatically.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/dashboard/integrations" className="btn-primary inline-flex items-center gap-2 text-sm">
                <Plug className="h-4 w-4" />
                Connect Google Calendar
              </Link>
              <Link href="/dashboard/sandbox" className="btn-secondary text-sm">
                Run a test call
              </Link>
            </div>
          </Card>
        ) : (
          <ul className="mt-8 space-y-3">
            {bookings.map((booking) => (
              <li key={booking.id} className="surface-card flex flex-wrap items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-medium text-text">{booking.name}</p>
                  <p className="mt-1 text-sm text-muted">{booking.summary}</p>
                  <p className="mt-1 text-xs text-muted">
                    {new Date(booking.when).toLocaleString("en-CA", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                <Link
                  href={`/dashboard/calls/${booking.callId}`}
                  className="text-sm text-violet-400 hover:text-violet-300"
                >
                  View call →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageTransition>
  );
}
