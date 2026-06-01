"use client";

import { datadogRum } from "@datadog/browser-rum";
import { useEffect } from "react";

let initialized = false;

export function DatadogInit() {
  useEffect(() => {
    const applicationId = process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID;
    const clientToken = process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN;

    if (!applicationId || !clientToken || initialized) return;

    datadogRum.init({
      applicationId,
      clientToken,
      site: process.env.NEXT_PUBLIC_DATADOG_SITE || "datadoghq.com",
      service: "ratelocal",
      env: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV || "production",
      version: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7),
      sessionSampleRate: 100,
      sessionReplaySampleRate: 20,
      trackUserInteractions: true,
      trackResources: true,
      trackLongTasks: true,
      defaultPrivacyLevel: "mask-user-input",
    });

    datadogRum.startSessionReplayRecording();
    initialized = true;
  }, []);

  return null;
}
