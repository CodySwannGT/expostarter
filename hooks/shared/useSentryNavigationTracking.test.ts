/**
 * Tests for Sentry navigation tracking hook.
 * @module hooks/shared/useSentryNavigationTracking.test
 */
import { renderHook } from "@testing-library/react-native";

import { addNavigationBreadcrumb } from "@/lib/sentry/utils";

import { useSentryNavigationTracking } from "./useSentryNavigationTracking";

const mockUsePathname = jest.fn();
const mockUseSegments = jest.fn();

jest.mock("expo-router", () => ({
  ...jest.requireActual("expo-router"),
  usePathname: () => mockUsePathname(),
  useSegments: () => mockUseSegments(),
}));

jest.mock("@/lib/sentry/utils", () => ({
  addNavigationBreadcrumb: jest.fn(),
}));

describe("useSentryNavigationTracking", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePathname.mockReturnValue("/");
    mockUseSegments.mockReturnValue([]);
  });

  it("should add breadcrumb on initial render", () => {
    mockUsePathname.mockReturnValue("/home");
    mockUseSegments.mockReturnValue(["home"]);

    renderHook(() => useSentryNavigationTracking());

    expect(addNavigationBreadcrumb).toHaveBeenCalledWith("/home", {
      segments: ["home"],
      previousRoute: null,
    });
  });

  it("should add breadcrumb when pathname changes", () => {
    mockUsePathname.mockReturnValue("/home");
    mockUseSegments.mockReturnValue(["home"]);

    const { rerender } = renderHook(() => useSentryNavigationTracking());

    mockUsePathname.mockReturnValue("/profile");
    mockUseSegments.mockReturnValue(["profile"]);

    rerender({});

    expect(addNavigationBreadcrumb).toHaveBeenCalledTimes(2);
    expect(addNavigationBreadcrumb).toHaveBeenLastCalledWith("/profile", {
      segments: ["profile"],
      previousRoute: "/home",
    });
  });

  it("should not add breadcrumb when pathname stays the same", () => {
    mockUsePathname.mockReturnValue("/home");
    mockUseSegments.mockReturnValue(["home"]);

    const { rerender } = renderHook(() => useSentryNavigationTracking());

    rerender({});

    expect(addNavigationBreadcrumb).toHaveBeenCalledTimes(1);
  });

  it("should not add breadcrumb when only segments change but pathname stays the same", () => {
    mockUsePathname.mockReturnValue("/home");
    mockUseSegments.mockReturnValue(["home"]);

    const { rerender } = renderHook(() => useSentryNavigationTracking());

    // Change segments but keep pathname the same
    mockUseSegments.mockReturnValue(["home", "tab"]);
    rerender({});

    // Should still only have been called once (on initial render)
    expect(addNavigationBreadcrumb).toHaveBeenCalledTimes(1);
  });
});
