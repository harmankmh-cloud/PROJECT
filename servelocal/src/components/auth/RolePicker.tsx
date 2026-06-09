"use client";

import Link from "next/link";
import { Hammer, Home } from "lucide-react";

export function RolePicker() {
  return (
    <div className="grid gap-4">
      <Link
        href="/signup/homeowner"
        className="card-dark-hover flex items-start gap-4 p-5 text-left"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/20 text-secondary">
          <Home className="h-6 w-6" />
        </span>
        <div>
          <p className="font-semibold text-slate-50">I need a pro</p>
          <p className="mt-1 text-sm text-slate-400">
            Post jobs, browse pros, and track requests — free for homeowners.
          </p>
        </div>
      </Link>
      <Link
        href="/signup/pro"
        className="card-dark-hover flex items-start gap-4 p-5 text-left ring-1 ring-primary/30"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
          <Hammer className="h-6 w-6" />
        </span>
        <div>
          <p className="font-semibold text-slate-50">I am a pro</p>
          <p className="mt-1 text-sm text-slate-400">
            Create your profile, browse job leads, and contact homeowners directly.
          </p>
        </div>
      </Link>
      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
