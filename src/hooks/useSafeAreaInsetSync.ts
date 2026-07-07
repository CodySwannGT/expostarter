/**
 * Captures the device bottom safe-area inset into a global reactive var.
 *
 * Must be called from a component rendered INSIDE `SafeAreaProvider` (where
 * `useSafeAreaInsets()` reads real values). Portal-rendered overlays mount
 * outside the provider and read 0 directly, so they consume the captured
 * value via `useBottomSheetInset`.
 * @module hooks/useSafeAreaInsetSync
 */

import { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { bottomSafeAreaInsetVar } from "@/stores/safeAreaInsets";

/**
 * Syncs the bottom safe-area inset into `bottomSafeAreaInsetVar`.
 */
export const useSafeAreaInsetSync = (): void => {
  const { bottom } = useSafeAreaInsets();
  useEffect(() => {
    bottomSafeAreaInsetVar(bottom);
  }, [bottom]);
};
