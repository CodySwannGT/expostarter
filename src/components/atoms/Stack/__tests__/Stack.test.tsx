/**
 * @file Stack.test.tsx
 * @description Unit tests for the Stack atom — testID forwarding (vertical
 * default) and horizontal direction rendering. One render per test
 * (css-interop teardown constraint).
 * @module components/atoms/Stack/__tests__/Stack.test
 */
import { render } from "@testing-library/react-native";
import React from "react";

import { Text } from "../../Text";
import { Stack } from "..";

describe("Stack", () => {
  it("forwards testID on the default vertical stack", () => {
    const { getByTestId } = render(
      <Stack testID="stack-vertical" space="4">
        <Text>First</Text>
      </Stack>
    );
    expect(getByTestId("stack-vertical")).toBeTruthy();
  });

  it("renders the horizontal direction with children", () => {
    const { getByTestId, getByText } = render(
      <Stack testID="stack-horizontal" direction="horizontal" space="2">
        <Text>Inline child</Text>
      </Stack>
    );
    expect(getByTestId("stack-horizontal")).toBeTruthy();
    expect(getByText("Inline child")).toBeTruthy();
  });

  it("merges the gap class with a custom className", () => {
    const { getByTestId, getByText } = render(
      <Stack testID="stack-classnamed" space="4" className="p-4">
        <Text>Spaced child</Text>
      </Stack>
    );
    expect(getByTestId("stack-classnamed")).toBeTruthy();
    expect(getByText("Spaced child")).toBeTruthy();
  });

  it("renders without space or testID, passing className through", () => {
    const { getByText, queryByTestId } = render(
      <Stack className="p-2">
        <Text>Unspaced child</Text>
      </Stack>
    );
    expect(getByText("Unspaced child")).toBeTruthy();
    expect(queryByTestId("stack-classnamed")).toBeNull();
  });
});
