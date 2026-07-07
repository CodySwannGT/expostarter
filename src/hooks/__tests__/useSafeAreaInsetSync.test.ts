/**
 * @file useSafeAreaInsetSync.test.ts
 * @description Unit tests for useSafeAreaInsetSync — verifies the bottom
 * inset read from react-native-safe-area-context is written into the
 * `bottomSafeAreaInsetVar` reactive var, and re-synced when it changes.
 * @module hooks/__tests__/useSafeAreaInsetSync.test
 */
import { renderHook } from "@testing-library/react-native";

import { bottomSafeAreaInsetVar } from "@/stores/safeAreaInsets";

import { useSafeAreaInsetSync } from "../useSafeAreaInsetSync";

const mockUseSafeAreaInsets = jest.fn();

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => mockUseSafeAreaInsets(),
}));

describe("useSafeAreaInsetSync", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    bottomSafeAreaInsetVar(0);
  });

  it("writes the bottom safe-area inset into bottomSafeAreaInsetVar", () => {
    mockUseSafeAreaInsets.mockReturnValue({
      top: 59,
      right: 0,
      bottom: 34,
      left: 0,
    });

    renderHook(() => useSafeAreaInsetSync());

    expect(bottomSafeAreaInsetVar()).toBe(34);
  });

  it("re-syncs the reactive var when the bottom inset changes", () => {
    mockUseSafeAreaInsets.mockReturnValue({
      top: 59,
      right: 0,
      bottom: 34,
      left: 0,
    });

    const { rerender } = renderHook(() => useSafeAreaInsetSync());
    expect(bottomSafeAreaInsetVar()).toBe(34);

    mockUseSafeAreaInsets.mockReturnValue({
      top: 59,
      right: 0,
      bottom: 0,
      left: 0,
    });
    rerender({});

    expect(bottomSafeAreaInsetVar()).toBe(0);
  });
});
