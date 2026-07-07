/**
 * @file Playground layout — production gate for the design-library gallery.
 * @description The /playground gallery route (RFC §6, ratified decision #7)
 * is a development/QA surface and must be excluded from production builds.
 * When EXPO_PUBLIC_APP_ENV === "production" this layout redirects to the
 * not-found screen before any child route renders, so the gallery is
 * unreachable in production while remaining available on localhost, dev,
 * and staging.
 * @module app/playground/_layout
 */
import { Redirect, Slot } from "expo-router";
import React from "react";

import { env } from "@/lib/env";

/**
 * Gates the playground route group out of production builds.
 * @returns A redirect to not-found in production, otherwise the child route
 */
const PlaygroundLayout = () => {
  if (env.EXPO_PUBLIC_APP_ENV === "production") {
    return <Redirect href="/+not-found" />;
  }
  return <Slot />;
};

export default PlaygroundLayout;
