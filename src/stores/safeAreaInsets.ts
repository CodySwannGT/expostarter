/**
 * Global safe-area inset store.
 *
 * Portal-rendered overlays (actionsheets, drawers, modals) mount OUTSIDE the
 * `SafeAreaProvider` — the app's `PortalProvider` wraps `SafeAreaProvider` in
 * `app/_layout.tsx` — so `useSafeAreaInsets()` returns 0 inside them. We capture
 * the real bottom inset once at the app root (inside `SafeAreaProvider`, via
 * `SafeAreaInsetSync`) into this reactive var, and let sheet primitives read it
 * through `useBottomSheetInset` regardless of where they mount.
 * @module stores/safeAreaInsets
 */

import { makeVar } from "@apollo/client";

/** Bottom safe-area inset (device px) captured at the app root. */
export const bottomSafeAreaInsetVar = makeVar<number>(0);
