/**
 * Hook for tracking navigation events in Sentry.
 * @module hooks/shared/useSentryNavigationTracking
 */
import { usePathname, useSegments } from "expo-router";
import { useEffect, useRef } from "react";

import { addNavigationBreadcrumb } from "@/lib/sentry/utils";

/**
 * Tracks navigation changes and sends breadcrumbs to Sentry.
 * Should be called once in the root layout.
 */
export function useSentryNavigationTracking(): void {
  const pathname = usePathname();
  const segments = useSegments();
  const previousPathname = useRef<string | null>(null);

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      addNavigationBreadcrumb(pathname, {
        segments,
        previousRoute: previousPathname.current,
      });
      previousPathname.current = pathname;
    }
  }, [pathname, segments]);
}
