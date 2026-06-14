"use client";

import Link from "next/link";
import { Hammer, Home } from "lucide-react";

export function LoginRolePicker() {
  return (
    <div className="grid gap-4">
      <Link
        href="/login/homeowner"
        className="card-dark-hover flex items-start gap-4 p-5 text-left"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/20 text-secondary">
          <Home className="h-6 w-6" />
        </span>
        <div>
          <p className="font-semibold text-slate-50">I need a pro</p>
          <p className="mt-1 text-sm text-slate-400">Homeowner — post jobs, browse pros, track requests.</p>
        </div>
      </Link>
      <Link
        href="/login/pro"
        className="card-dark-hover flex items-start gap-4 p-5 text-left ring-1 ring-primary/30"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
          <Hammer className="h-6 w-6" />
        </span>
        <div>
          <p className="font-semibold text-slate-50">I am a pro</p>
          <p className="mt-1 text-sm text-slate-400">Contractor — manage leads, profile, and messages.</p>
        </div>
      </Link>
      <p className="text-center text-sm text-slate-500">
        New here?{" "}
        <Link href="/signup" className="font-semibold text-primary hover:underline">
          Create account
        </Link>
      </p>
    </div>
  );
}
