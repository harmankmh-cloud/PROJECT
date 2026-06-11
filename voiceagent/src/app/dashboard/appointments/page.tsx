"use client";

import Link from "next/link";
import { Calendar, Plug } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { PageTransition } from "@/components/ui/PageTransition";

export default function AppointmentsPage() {
  return (
    <PageTransition>
      <div className="dashboard-container py-8">
        <h1 className="font-display text-2xl text-text">Appointments</h1>
        <p className="mt-1 text-sm text-muted">Bookings captured by GreetQ during calls</p>

        <Card className="mt-8 p-10 text-center">
          <Calendar className="mx-auto h-10 w-10 text-muted" />
          <p className="mt-4 font-medium text-text">No appointments synced yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            When GreetQ books during a call, appointments appear here after Google Calendar is
            connected.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/dashboard/integrations" className="btn-primary inline-flex items-center gap-2 text-sm">
              <Plug className="h-4 w-4" />
              Connect Google Calendar
            </Link>
            <Link href="/dashboard/settings" className="btn-secondary text-sm">
              Open settings
            </Link>
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}
