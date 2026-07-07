/**
 * @file useBottomSheetInset.test.ts
 * @description Unit tests for the bottom-sheet inset hooks — Platform.OS
 * gating (Android pads, iOS returns 0) and the style-merge behavior of
 * useBottomSheetInsetStyle. The inset value flows through the
 * `bottomSafeAreaInsetVar` reactive var captured at the app root.
 * @module hooks/__tests__/useBottomSheetInset.test
 */
import { act, renderHook } from "@testing-library/react-native";
import { Platform } from "react-native";

import { bottomSafeAreaInsetVar } from "@/stores/safeAreaInsets";

import {
  useBottomSheetInset,
  useBottomSheetInsetStyle,
} from "../useBottomSheetInset";

const originalPlatformOS = Platform.OS;

/**
 * Overrides Platform.OS for a single test.
 * @param os - The platform identifier to report.
 */
const setPlatformOS = (os: typeof Platform.OS) => {
  Object.defineProperty(Platform, "OS", { value: os, configurable: true });
};

describe("useBottomSheetInset", () => {
  afterEach(() => {
    setPlatformOS(originalPlatformOS);
    bottomSafeAreaInsetVar(0);
  });

  it("returns the captured bottom inset on Android", () => {
    setPlatformOS("android");
    bottomSafeAreaInsetVar(24);

    const { result } = renderHook(() => useBottomSheetInset());

    expect(result.current).toBe(24);
  });

  it("re-renders with the new inset when the captured value changes", () => {
    setPlatformOS("android");
    bottomSafeAreaInsetVar(10);

    const { result } = renderHook(() => useBottomSheetInset());
    expect(result.current).toBe(10);

    act(() => {
      bottomSafeAreaInsetVar(24);
    });

    expect(result.current).toBe(24);
  });

  it("returns 0 on iOS even when an inset was captured", () => {
    setPlatformOS("ios");
    bottomSafeAreaInsetVar(34);

    const { result } = renderHook(() => useBottomSheetInset());

    expect(result.current).toBe(0);
  });
});

describe("useBottomSheetInsetStyle", () => {
  afterEach(() => {
    setPlatformOS(originalPlatformOS);
    bottomSafeAreaInsetVar(0);
  });

  it("prepends bottom padding to the caller style on Android", () => {
    setPlatformOS("android");
    bottomSafeAreaInsetVar(24);
    const callerStyle = { backgroundColor: "black" };

    const { result } = renderHook(() => useBottomSheetInsetStyle(callerStyle));

    expect(result.current).toEqual([{ paddingBottom: 24 }, callerStyle]);
  });

  it("returns the caller style unchanged when the Android inset is 0", () => {
    setPlatformOS("android");
    bottomSafeAreaInsetVar(0);
    const callerStyle = { backgroundColor: "black" };

    const { result } = renderHook(() => useBottomSheetInsetStyle(callerStyle));

    expect(result.current).toBe(callerStyle);
  });

  it("returns the caller style unchanged on iOS", () => {
    setPlatformOS("ios");
    bottomSafeAreaInsetVar(34);
    const callerStyle = { backgroundColor: "black" };

    const { result } = renderHook(() => useBottomSheetInsetStyle(callerStyle));

    expect(result.current).toBe(callerStyle);
  });

  it("returns undefined when no style is provided and no inset applies", () => {
    setPlatformOS("ios");

    const { result } = renderHook(() => useBottomSheetInsetStyle());

    expect(result.current).toBeUndefined();
  });
});
