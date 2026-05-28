/**
 * Unit tests for the Index route component.
 * Tests component rendering in isolation.
 * @see https://callstack.github.io/react-native-testing-library
 * @module __tests__/app/index.test
 */
import { Alert, Platform } from "react-native";

import { fireEvent, render, screen } from "@testing-library/react-native";
import * as Clipboard from "expo-clipboard";

import Index from "@/app/index";

jest.mock("expo-clipboard", () => ({
  setStringAsync: jest.fn().mockResolvedValue(undefined),
}));

const HOME_VERSION_TEST_ID = "home:version";

describe("Index", () => {
  describe("rendering", () => {
    it("renders without crashing", () => {
      expect(() => render(<Index />)).not.toThrow();
    });

    it("displays Hello, World! text", () => {
      render(<Index />);
      expect(screen.getByText("Hello, World!")).toBeTruthy();
    });

    it("renders a container element", () => {
      render(<Index />);
      const textElement = screen.getByText("Hello, World!");
      expect(textElement.parent).toBeTruthy();
    });

    it("renders version string pressable", () => {
      render(<Index />);
      expect(screen.getByTestId(HOME_VERSION_TEST_ID)).toBeTruthy();
    });
  });

  describe("version press behavior", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("copies to clipboard on web platform", () => {
      const originalPlatform = Platform.OS;
      Object.defineProperty(Platform, "OS", { value: "web", writable: true });

      render(<Index />);
      const versionPressable = screen.getByTestId(HOME_VERSION_TEST_ID);
      fireEvent.press(versionPressable);

      expect(Clipboard.setStringAsync).toHaveBeenCalledWith(
        expect.stringContaining("v")
      );

      Object.defineProperty(Platform, "OS", {
        value: originalPlatform,
        writable: true,
      });
    });

    it("shows alert on native platform", () => {
      const originalPlatform = Platform.OS;
      Object.defineProperty(Platform, "OS", { value: "ios", writable: true });
      const alertSpy = jest.spyOn(Alert, "alert").mockImplementation();

      render(<Index />);
      const versionPressable = screen.getByTestId(HOME_VERSION_TEST_ID);
      fireEvent.press(versionPressable);

      expect(alertSpy).toHaveBeenCalledWith(
        "Build Info",
        expect.stringContaining("Version:")
      );

      alertSpy.mockRestore();
      Object.defineProperty(Platform, "OS", {
        value: originalPlatform,
        writable: true,
      });
    });
  });
});
