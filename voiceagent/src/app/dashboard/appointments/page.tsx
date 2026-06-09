"use client";

import Link from "next/link";
import { Calendar } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { PageTransition } from "@/components/ui/PageTransition";
import { DEMO_APPOINTMENTS } from "@/lib/demo-data";

export default function AppointmentsPage() {
  return (
    <PageTransition>
      <div className="dashboard-container py-8">
        <h1 className="font-display text-2xl text-text">Appointments</h1>
        <p className="mt-1 text-sm text-muted">Bookings captured by GreetQ during calls</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEMO_APPOINTMENTS.map((a) => (
            <Card key={a.id}>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary-glow" />
                <div>
                  <p className="font-medium text-text">{a.name}</p>
                  <p className="text-sm text-muted">{a.service}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-accent">
                {a.day} at {a.time}
              </p>
            </Card>
          ))}
        </div>

        <Card className="mt-8 text-center">
          <p className="text-muted">Connect Google Calendar in Settings to sync live bookings.</p>
          <Link href="/dashboard/settings" className="mt-3 inline-block text-sm text-primary-glow hover:underline">
            Open settings →
          </Link>
        </Card>
      </div>
    </PageTransition>
  );
}
