/**
 * Bottom safe-area inset for portal-rendered sheets.
 *
 * Single source of the "Android edge-to-edge" gating: on Android with
 * `edgeToEdgeEnabled` the system navigation bar overlaps overlay content, so
 * bottom-pinned buttons in actionsheets/drawers must be padded by the bottom
 * inset. iOS already clears the home indicator via the actionsheet's `pb-safe`,
 * so this returns 0 there to avoid double-padding.
 *
 * The value comes from `bottomSafeAreaInsetVar` (captured at the app root by
 * `SafeAreaInsetSync`) because `useSafeAreaInsets()` reads 0 inside the portal.
 * Consumed by the shared `ActionsheetContent` and `DrawerFooter` primitives so
 * individual sheets need no per-component change.
 * @module hooks/useBottomSheetInset
 */

import { useSyncExternalStore } from "react";
import { Platform, type StyleProp, type ViewStyle } from "react-native";

import { bottomSafeAreaInsetVar } from "@/stores/safeAreaInsets";

/**
 * Snapshot reader for `useSyncExternalStore` — also the server snapshot
 * during static rendering (the inset is 0 before hydration).
 * @returns The captured bottom safe-area inset in device px.
 */
const getBottomInsetSnapshot = (): number => bottomSafeAreaInsetVar();

/**
 * Bottom padding a portal-rendered sheet needs to clear the Android system
 * navigation bar. Internal — consumed by `useBottomSheetInsetStyle`.
 * @returns The extra bottom padding in device px; 0 on iOS and on Android
 * devices without a bottom system bar.
 */
export const useBottomSheetInset = (): number => {
  const bottomInset = useSyncExternalStore(
    bottomSafeAreaInsetVar.subscribe,
    getBottomInsetSnapshot,
    getBottomInsetSnapshot
  );
  return Platform.OS === "android" ? bottomInset : 0;
};

/**
 * Merges the Android bottom safe-area inset into a sheet primitive's style.
 * Shared by `ActionsheetContent` and `DrawerFooter` so the inset-application
 * logic lives in one place.
 * @param style - The caller-provided style to extend.
 * @returns The style with extra bottom padding on Android; the original style
 * unchanged on iOS / when no inset is needed.
 */
export const useBottomSheetInsetStyle = (
  style?: StyleProp<ViewStyle>
): StyleProp<ViewStyle> => {
  const bottomInset = useBottomSheetInset();
  return bottomInset ? [{ paddingBottom: bottomInset }, style] : style;
};
