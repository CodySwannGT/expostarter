/**
 * Tests for safe Sentry utility functions.
 * @module lib/sentry/utils.test
 */
import * as Sentry from "@sentry/react-native";

import {
  addNavigationBreadcrumb,
  captureException,
  captureMessage,
  clearSentryUser,
  setExtraContext,
  setSentryUser,
  setTag,
} from "./utils";

const TEST_EMAIL = "test@example.com";
const TEST_USER_ID = "123";
const TEST_ERROR_MESSAGE = "Test error";
const TEST_MESSAGE = "Test message";

describe("Sentry utils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when Sentry.getClient throws", () => {
    beforeEach(() => {
      (Sentry.getClient as jest.Mock).mockImplementation(() => {
        throw new Error("Sentry not initialized");
      });
    });

    it("setSentryUser should handle exception gracefully", () => {
      setSentryUser({ id: TEST_USER_ID, email: TEST_EMAIL });

      expect(Sentry.setUser).not.toHaveBeenCalled();
    });
  });

  describe("when Sentry is not enabled", () => {
    beforeEach(() => {
      (Sentry.getClient as jest.Mock).mockReturnValue(null);
    });

    it("setSentryUser should not call Sentry.setUser", () => {
      setSentryUser({ id: TEST_USER_ID, email: TEST_EMAIL });

      expect(Sentry.setUser).not.toHaveBeenCalled();
    });

    it("clearSentryUser should not call Sentry.setUser", () => {
      clearSentryUser();

      expect(Sentry.setUser).not.toHaveBeenCalled();
    });

    it("addNavigationBreadcrumb should not call Sentry.addBreadcrumb", () => {
      addNavigationBreadcrumb("/home", { tab: "main" });

      expect(Sentry.addBreadcrumb).not.toHaveBeenCalled();
    });

    it("captureException should log to console instead", () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      const error = new Error(TEST_ERROR_MESSAGE);

      captureException(error);

      expect(Sentry.captureException).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith("[Sentry disabled]", error);
      consoleSpy.mockRestore();
    });

    it("captureMessage should log to console instead", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      captureMessage(TEST_MESSAGE, "warning");

      expect(Sentry.captureMessage).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        `[Sentry disabled] warning: ${TEST_MESSAGE}`
      );
      consoleSpy.mockRestore();
    });

    it("setExtraContext should not call Sentry.setExtra", () => {
      setExtraContext("key", "value");

      expect(Sentry.setExtra).not.toHaveBeenCalled();
    });

    it("setTag should not call Sentry.setTag", () => {
      setTag("key", "value");

      expect(Sentry.setTag).not.toHaveBeenCalled();
    });
  });

  describe("when Sentry is enabled", () => {
    beforeEach(() => {
      (Sentry.getClient as jest.Mock).mockReturnValue({});
    });

    it("setSentryUser should call Sentry.setUser with user data", () => {
      const user = {
        id: TEST_USER_ID,
        email: TEST_EMAIL,
        username: "testuser",
      };

      setSentryUser(user);

      expect(Sentry.setUser).toHaveBeenCalledWith({
        id: TEST_USER_ID,
        email: TEST_EMAIL,
        username: "testuser",
      });
    });

    it("clearSentryUser should call Sentry.setUser with null", () => {
      clearSentryUser();

      expect(Sentry.setUser).toHaveBeenCalledWith(null);
    });

    it("addNavigationBreadcrumb should call Sentry.addBreadcrumb", () => {
      addNavigationBreadcrumb("/profile", { userId: TEST_USER_ID });

      expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({
        category: "navigation",
        message: "Navigated to /profile",
        data: { userId: TEST_USER_ID },
        level: "info",
      });
    });

    it("captureException should call Sentry.captureException", () => {
      const error = new Error(TEST_ERROR_MESSAGE);

      captureException(error);

      expect(Sentry.captureException).toHaveBeenCalledWith(error);
    });

    it("captureException with context should use withScope", () => {
      const error = new Error(TEST_ERROR_MESSAGE);
      const context = { userId: TEST_USER_ID };

      captureException(error, context);

      expect(Sentry.withScope).toHaveBeenCalled();
    });

    it("captureMessage should call Sentry.captureMessage", () => {
      captureMessage(TEST_MESSAGE, "info");

      expect(Sentry.captureMessage).toHaveBeenCalledWith(TEST_MESSAGE, "info");
    });

    it("captureMessage should use default level when not provided", () => {
      captureMessage(TEST_MESSAGE);

      expect(Sentry.captureMessage).toHaveBeenCalledWith(TEST_MESSAGE, "info");
    });

    it("setExtraContext should call Sentry.setExtra", () => {
      setExtraContext("key", { nested: "value" });

      expect(Sentry.setExtra).toHaveBeenCalledWith("key", { nested: "value" });
    });

    it("setTag should call Sentry.setTag", () => {
      setTag("environment", "staging");

      expect(Sentry.setTag).toHaveBeenCalledWith("environment", "staging");
    });
  });
});
