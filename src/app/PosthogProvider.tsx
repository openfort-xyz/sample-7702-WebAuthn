"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

if (!process.env.NEXT_PUBLIC_POSTHOG_KEY || !process.env.NEXT_PUBLIC_POSTHOG_HOST) {
  throw new Error("NEXT_PUBLIC_POSTHOG_KEY and NEXT_PUBLIC_POSTHOG_HOST is required");
}

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  });

  // Set global properties
  posthog.register({
    posthog_project: "sample-7702-delegator",
  });
}

if (process.env.NODE_ENV === "development") {
  posthog.opt_out_capturing();
}

export function PosthogProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
