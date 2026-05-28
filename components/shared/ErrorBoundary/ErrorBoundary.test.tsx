/**
 * Tests for ErrorBoundary component.
 * @module components/shared/ErrorBoundary/ErrorBoundary.test
 */
import * as Sentry from "@sentry/react-native";
import { render, screen } from "@testing-library/react-native";
import { Component, ReactNode } from "react";
import { Text } from "react-native";

import { DefaultFallback, ErrorBoundary } from "./ErrorBoundary";

/** Props for the ThrowError test component */
interface ThrowErrorProps {
  readonly shouldThrow?: boolean;
}

/**
 * Test component that throws an error when shouldThrow is true.
 * Uses a class component because functional components can't throw during render
 * in a way that error boundaries can catch reliably in tests.
 */
// eslint-disable-next-line functional/no-classes -- Class required for error boundary testing
class ThrowError extends Component<ThrowErrorProps> {
  // eslint-disable-next-line sonarjs/function-return-type -- Standard error boundary testing pattern: throw path + return path is intentional
  render(): ReactNode {
    if (this.props.shouldThrow) {
      throw new Error("Test error");
    }
    return <Text>No error</Text>;
  }
}

describe("ErrorBoundary", () => {
  const originalError = console.error;

  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress React error boundary console.error in tests
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalError;
  });

  describe("DefaultFallback", () => {
    it("should render the fallback message", () => {
      render(<DefaultFallback />);

      expect(
        screen.getByText("Something went wrong. Please restart the app.")
      ).toBeOnTheScreen();
    });
  });

  it("should render children when no error occurs", () => {
    render(
      <ErrorBoundary>
        <Text>Test Child</Text>
      </ErrorBoundary>
    );

    expect(screen.getByText("Test Child")).toBeOnTheScreen();
  });

  it("should render custom fallback when provided", () => {
    const fallback = <Text>Custom Fallback</Text>;

    render(<ErrorBoundary fallback={fallback}>{null}</ErrorBoundary>);

    // Sentry.ErrorBoundary will render children (null in this case)
    // The fallback is only shown when an error is caught
    expect(screen.queryByText("Custom Fallback")).not.toBeOnTheScreen();
  });

  it("should render default fallback when child throws an error", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow />
      </ErrorBoundary>
    );

    expect(
      screen.getByText("Something went wrong. Please restart the app.")
    ).toBeOnTheScreen();
  });

  it("should render custom fallback when child throws an error", () => {
    const customFallback = <Text>Custom Error Message</Text>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow />
      </ErrorBoundary>
    );

    expect(screen.getByText("Custom Error Message")).toBeOnTheScreen();
  });

  it("should call Sentry.ErrorBoundary with fallback prop", () => {
    const customFallback = <Text>Custom Fallback</Text>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <Text>Child</Text>
      </ErrorBoundary>
    );

    expect(Sentry.ErrorBoundary).toHaveBeenCalled();
    const callArgs = (Sentry.ErrorBoundary as jest.Mock).mock.calls[0][0];
    expect(callArgs.fallback).toBe(customFallback);
  });

  it("should call Sentry.ErrorBoundary with DefaultFallback when no fallback provided", () => {
    render(
      <ErrorBoundary>
        <Text>Child</Text>
      </ErrorBoundary>
    );

    expect(Sentry.ErrorBoundary).toHaveBeenCalled();
    const callArgs = (Sentry.ErrorBoundary as jest.Mock).mock.calls[0][0];
    expect(callArgs.fallback.type).toBe(DefaultFallback);
  });
});
